"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useI18n } from "@/hooks/useI18n";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useInvest } from "@/hooks/useInvest";
interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  monthlyRent: number;
  tokenPrice: number;
  totalTokens: number;
  soldTokens: number;
  apy: number;
  imageUrl: string;
  status: "funding" | "active" | "completed";
  sourceData:any;
  onInvestmentSuccess?: () => void;
}

export function PropertyCard({
  id,
  title,
  location,
  monthlyRent,
  tokenPrice,
  totalTokens,
  soldTokens,
  apy,
  imageUrl,
  status,
  sourceData,
  onInvestmentSuccess
}: PropertyCardProps) {
  const { t } = useI18n();
  const { address, isConnected } = useAccount();
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [tokenAmount, setTokenAmount] = useState(1);
  const remainingTokens = totalTokens - soldTokens;
  const progressPercentage = (soldTokens / totalTokens) * 100;
  const investmentAmount = tokenAmount * tokenPrice;
  
  // 使用 useInvest hook 进行区块链投资操作
  const {
    invest,
    isInvesting,
    error: investError,
    success: investSuccess,
    balance,
    txHash,
    isConnected: isWalletConnected,
    hasValidRentTokenAddress
  } = useInvest(id, investmentAmount, sourceData?.payoutToken);
  // 处理投资成功状态
  useEffect(() => {
    if (investSuccess) {
      alert(`🎉 投资成功！您已购买 ${tokenAmount} 个代币，总投资金额 $${investmentAmount.toLocaleString()}${txHash ? `\n\n交易哈希: ${txHash}` : ''}`);
      setShowInvestModal(false);
      setTokenAmount(1);
      onInvestmentSuccess?.();
    }
  }, [investSuccess, tokenAmount, investmentAmount, txHash, onInvestmentSuccess]);

  // 处理投资错误状态
  useEffect(() => {
    if (investError) {
      alert(`❌ 投资失败: ${investError}`);
    }
  }, [investError]);
  const getStatusColor = () => {
    switch (status) {
      case "funding":
        return "bg-primary/90 text-primary-foreground border-primary shadow-lg backdrop-blur-sm";
      case "active":
        return "bg-emerald-500/90 text-white border-emerald-600 shadow-lg backdrop-blur-sm";
      case "completed":
        return "bg-muted/90 text-muted-foreground border-border shadow-lg backdrop-blur-sm";
      default:
        return "bg-primary/90 text-primary-foreground border-primary shadow-lg backdrop-blur-sm";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "funding":
        return "🚀 Funding";
      case "active":
        return "✅ Active";
      case "completed":
        return "🏁 Completed";
      default:
        return "🚀 Funding";
    }
  };

  const handleInvest = async () => {
    // 检查钱包连接状态
    if (!isConnected || !address) {
      alert("请先连接您的钱包");
      return;
    }

    // 检查是否有有效的RentToken合约地址
    if (!hasValidRentTokenAddress) {
      alert("❌ 未找到该房产对应的合约地址，请联系管理员");
      return;
    }

    try {
      // 调用 useInvest hook 的 invest 方法进行区块链投资
      await invest();
      
      // 投资成功后的处理会在 useEffect 中处理
    } catch (error) {
      console.error('Investment error:', error);
      // 错误处理已在 useInvest hook 中处理，这里不需要额外处理
    }
  };

  return (
    <Card variant="sushi" className="group overflow-hidden">
      {/* Gradient background effect */}
      <div className="absolute inset-0 bg-gradient-sushi opacity-0 group-hover:opacity-5 transition-opacity duration-500 -z-10" />
      
      {/* Property Image */}
      <div className="relative h-56 overflow-hidden rounded-t-xl">
        {/* @ts-ignore - React 19 compatibility issue */}
        <Image 
          src={imageUrl || "/placeholder-property.jpg"} 
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Status badge */}
        <Badge 
          variant="secondary" 
          className={cn(
            "absolute top-4 right-4 backdrop-blur-md border",
            getStatusColor()
          )}
        >
          {getStatusText()}
        </Badge>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {/* Property info overlay */}
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="font-bold text-xl mb-1 drop-shadow-lg">{title}</h3>
          <p className="text-sm opacity-90 flex items-center gap-1">
            <span>📍</span> {location}
          </p>
        </div>
      </div>

      <CardHeader className="pb-4">
        {/* Financial Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass p-3 rounded-lg border border-border/50">
            <div className="text-xs text-muted-foreground mb-1">Monthly Rent</div>
            <div className="font-bold text-lg neon-text">
              {/* ${monthlyRent.toLocaleString()} */}
            </div>
          </div>
          <div className="glass p-3 rounded-lg border border-border/50">
            <div className="text-xs text-muted-foreground mb-1">Token Price</div>
            <div className="font-bold text-lg">${tokenPrice}</div>
          </div>
        </div>

        <div className="glass p-3 rounded-lg border border-border/50">
          <div className="text-xs text-muted-foreground mb-1">Expected APY</div>
          <div className="font-bold text-xl text-emerald-400 flex items-center gap-1">
            🚀 {apy}%
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{soldTokens.toLocaleString()} / {totalTokens.toLocaleString()} tokens</span>
          </div>
          <div className="relative w-full bg-muted rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-sushi h-3 rounded-full transition-all duration-700 relative overflow-hidden"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" 
                   style={{ animationDuration: '2s' }} />
            </div>
          </div>
          <div className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
            <span>⚡</span> {remainingTokens.toLocaleString()} tokens remaining
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            variant="sushi"
            size="default"
            className="flex-1"
            disabled={status === "completed" || remainingTokens === 0}
            onClick={() => setShowInvestModal(true)}
          >
            {status === "completed" || remainingTokens === 0 ? "🔒 Sold Out" : "🦄 Invest Now"}
          </Button>
          <Button variant="glass" size="default" className="px-4">
            📊
          </Button>
        </div>
      </CardContent>

      {/* Investment Modal */}
      <Dialog open={showInvestModal} onOpenChange={setShowInvestModal}>
        <DialogContent className="max-w-md glass border border-primary/30 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-sushi opacity-5 rounded-xl pointer-events-none" />
          
          <DialogHeader className="relative z-10">
            <DialogTitle className="neon-text text-2xl">
              🦄 Invest in {title}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Purchase tokens to become a partial owner of this property
            </DialogDescription>
          </DialogHeader>

          <div className="relative z-10 space-y-6">
            <div>
              <Label htmlFor="token-amount" className="block text-sm font-bold mb-3 text-muted-foreground">
                Number of Tokens (Available: {remainingTokens.toLocaleString()})
              </Label>
              <Input
                id="token-amount"
                type="number"
                min="1"
                max={remainingTokens}
                value={tokenAmount}
                onChange={(e) => setTokenAmount(Math.max(1, Math.min(remainingTokens, parseInt(e.target.value) || 1)))}
                className="w-full p-4 glass border border-primary/30 text-center text-xl font-bold bg-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
              />
            </div>

            {/* 错误信息显示 */}
            {investError && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                ❌ {investError}
              </div>
            )}

            {/* 交易哈希显示 */}
            {txHash && (
              <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 text-sm">
                📝 交易哈希: <code className="text-xs break-all">{txHash}</code>
              </div>
            )}

            <Card variant="glass" className="border border-border/50">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Token Price:</span>
                  <span className="font-bold">${tokenPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tokens:</span>
                  <span className="font-bold">{tokenAmount.toLocaleString()}</span>
                </div>
                <div className="h-px bg-gradient-sushi" />
                <div className="flex justify-between text-xl">
                  <span className="text-muted-foreground">Total Investment:</span>
                  <span className="font-bold neon-text">
                    ${investmentAmount.toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                  💎 Expected monthly income: <span className="text-emerald-400 font-semibold">
                    ${((investmentAmount * apy / 100) / 12).toFixed(2)}
                  </span>
                </div>
                {/* 显示当前持有的代币余额 */}
                {balance !== "0" && (
                  <div className="text-sm text-green-400 bg-green-500/20 p-3 rounded-lg border border-green-500/30">
                    💰 您当前持有: {parseFloat(balance).toFixed(2)} 个代币
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                variant="ghost"
                onClick={() => setShowInvestModal(false)}
                className="flex-1 glass border border-border/50"
                disabled={isInvesting}
              >
                Cancel
              </Button>
              <Button
                variant="sushi"
                onClick={handleInvest}
                disabled={isInvesting || !isConnected || !hasValidRentTokenAddress}
                className="flex-1"
              >
                {isInvesting 
                  ? "🔄 投资中..." 
                  : !isConnected 
                    ? "🔒 连接钱包" 
                    : !hasValidRentTokenAddress
                      ? "❌ 合约未配置"
                      : "🚀 确认投资"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
