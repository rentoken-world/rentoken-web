"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, ChevronDown } from 'lucide-react';
import Image from 'next/image';

export function WalletConnectButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // 确保组件已挂载
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    variant="sushi"
                    size="default"
                    className="gap-2 min-w-[140px]"
                  >
                    <Wallet className="h-4 w-4" />
                    Connect Wallet
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button
                    onClick={openChainModal}
                    variant="destructive"
                    size="default"
                    className="gap-2"
                  >
                    ⚠️ Wrong network
                  </Button>
                );
              }

              return (
                <div className="flex items-center gap-2">
                  {/* Chain Switcher */}
                  <Button
                    onClick={openChainModal}
                    variant="glass"
                    size="sm"
                    className="gap-1 h-10"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 16,
                          height: 16,
                          borderRadius: 999,
                          overflow: 'hidden',
                        }}
                      >
                        {chain.iconUrl && (
                          <Image
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            width={16}
                            height={16}
                            className="rounded-full"
                          />
                        )}
                      </div>
                    )}
                    <span className="hidden sm:inline text-xs">
                      {chain.name}
                    </span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>

                  {/* Account Button */}
                  <Button
                    onClick={openAccountModal}
                    variant="sushi"
                    size="default"
                    className="gap-2 relative group min-w-[120px]"
                  >
                    <Wallet className="h-4 w-4" />
                    <span className="font-medium">
                      {account.displayName}
                    </span>
                    {account.hasPendingTransactions && (
                      <Badge variant="secondary" className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs animate-pulse">
                        •
                      </Badge>
                    )}
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
