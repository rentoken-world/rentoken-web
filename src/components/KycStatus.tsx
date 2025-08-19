"use client";

import { useKycStatus } from "@/hooks/useKycStatus";
import { useAccount } from "wagmi";
import { useI18n } from "@/hooks/useI18n";

export function KycStatus() {
  const { isConnected } = useAccount();
  const { kycStatus, loading, isKycVerified, needsKycVerification } = useKycStatus();
  const { t } = useI18n();

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
      <div className="flex items-center gap-1 text-xs text-orange-600">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <span>{t("kycRequired")}</span>
        <button className="ml-1 text-primary underline hover:no-underline">
          {t("contactUs")}
        </button>
      </div>
    );
  }

  return null;
}
