"use client";

import { useState } from "react";
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
  onInvestmentSuccess
}: PropertyCardProps) {
  const { t } = useI18n();
  const { address, isConnected } = useAccount();
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [tokenAmount, setTokenAmount] = useState(1);
  const [isInvesting, setIsInvesting] = useState(false);

  const remainingTokens = totalTokens - soldTokens;
  const progressPercentage = (soldTokens / totalTokens) * 100;
  const investmentAmount = tokenAmount * tokenPrice;

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
    if (!isConnected || !address) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      setIsInvesting(true);
      const response = await fetch('/api/investments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId: id,
          investorAddress: address,
          tokenAmount,
          investmentAmount,
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert(`🎉 Successfully invested $${investmentAmount.toLocaleString()} for ${tokenAmount} tokens!`);
        setShowInvestModal(false);
        setTokenAmount(1);
        onInvestmentSuccess?.();
      } else {
        alert(`❌ Investment failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Investment error:', error);
      alert('❌ Investment failed. Please try again.');
    } finally {
      setIsInvesting(false);
    }
  };

  return (
    <Card variant="sushi" className="group overflow-hidden">
      {/* Gradient background effect */}
      <div className="absolute inset-0 bg-gradient-sushi opacity-0 group-hover:opacity-5 transition-opacity duration-500 -z-10" />
      
      {/* Property Image */}
      <div className="relative h-56 overflow-hidden rounded-t-xl">
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
              ${monthlyRent.toLocaleString()}
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
                disabled={isInvesting || !isConnected}
                className="flex-1"
              >
                {isInvesting ? "🔄 Investing..." : isConnected ? "🚀 Confirm Investment" : "🔒 Connect Wallet"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
