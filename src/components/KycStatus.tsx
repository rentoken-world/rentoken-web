"use client";

import { useKycStatus } from "@/hooks/useKycStatus";
import { useAccount } from "wagmi";
import { useI18n } from "@/hooks/useI18n";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function KycStatus() {
  const { isConnected, address } = useAccount();
  const { kycStatus, loading, isKycVerified, needsKycVerification, refetch } = useKycStatus();
  const { t } = useI18n();
  
  // KYC申请状态
  const [showKycDialog, setShowKycDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });

  // 处理KYC申请提交
  const handleKycSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !formData.fullName || !formData.email) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/kyc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: address,
          fullName: formData.fullName,
          email: formData.email,
          documents: [], // 可以后续扩展为文件上传
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        // 打开邮箱链接
        if (result.data.mailtoLink) {
          window.location.href = result.data.mailtoLink;
        }
        
        // 关闭对话框并重置表单
        setShowKycDialog(false);
        setFormData({ fullName: "", email: "" });
        
        // 刷新KYC状态
        setTimeout(() => {
          refetch();
        }, 1000);
        
        alert('KYC申请已提交！请检查您的邮箱应用并发送KYC材料邮件。');
      } else {
        alert('KYC申请失败：' + result.error);
      }
    } catch (error) {
      console.error('KYC申请错误:', error);
      alert('KYC申请失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  }; 
  if (!isConnected) return null;

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className="w-3 h-3 border border-current rounded-full animate-spin border-t-transparent"></div>
        {t("checkingKyc")}
      </div>
    );
  }

  if (isKycVerified) {
    return (
      <div className="flex items-center gap-1 text-xs text-green-600">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        {t("kycVerified")}
      </div>
    );
  }

  if (needsKycVerification) {
    return (
      <>
        <div className="flex items-center gap-1 text-xs text-orange-600 bg-background">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{t("kycRequired")}</span>
          <Dialog open={showKycDialog} onOpenChange={setShowKycDialog}>
            <DialogTrigger asChild>
              <button className="ml-1 text-primary underline hover:no-underline">
                申请KYC
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>KYC身份验证申请</DialogTitle>
                <DialogDescription>
                  请填写您的基本信息，我们将通过邮件为您处理KYC申请。
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleKycSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">真实姓名</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="请输入您的真实姓名"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">邮箱地址</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="请输入您的邮箱地址"
                    required
                  />
                </div>
                <div className="bg-muted p-3 rounded-lg text-sm text-muted-foreground">
                  <p>📧 提交后系统会自动打开您的邮箱应用，请发送预填好的邮件到KYC审核团队。</p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowKycDialog(false)}
                    disabled={isSubmitting}
                  >
                    取消
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !formData.fullName || !formData.email}
                  >
                    {isSubmitting ? "提交中..." : "提交申请"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </>
    );
  }

  if (kycStatus === 'pending') {
    return (
      <div className="flex items-center gap-1 text-xs text-blue-600">
        <svg className="w-3 h-3 animate-spin" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 2a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm2 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2H7a1 1 0 01-1-1z" />
        </svg>
        <span>KYC审核中</span>
      </div>
    );
  }

  return null;
}
