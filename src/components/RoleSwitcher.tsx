"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Building, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/useI18n";

export function RoleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState("investor");
  const [mounted, setMounted] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    setMounted(true);
    setRole(
      pathname.includes("/investor") ? "investor" : 
      pathname.includes("/owner") ? "owner" : "investor"
    );
  }, [pathname]);

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    router.push(`/${newRole}`);
  };

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 min-w-[280px]">
        <Button variant="ghost" size="sm" className="min-w-[130px] justify-start gap-1">
          <TrendingUp className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">🚀 {t("investor")}</span>
        </Button>
        <Button variant="ghost" size="sm" className="min-w-[130px] justify-start gap-1">
          <Building className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">🏠 {t("owner")}</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 min-w-[280px]">
      <Button 
        variant={role === "investor" ? "sushi" : "ghost"}
        size="sm"
        onClick={() => handleRoleChange("investor")}
        className="gap-1 min-w-[130px] justify-start"
      >
        <TrendingUp className="h-4 w-4 flex-shrink-0" />
        <span className="truncate">🚀 {t("investor")}</span>
      </Button>
      <Button 
        variant={role === "owner" ? "sushi" : "ghost"}
        size="sm"
        onClick={() => handleRoleChange("owner")}
        className="gap-1 min-w-[130px] justify-start"
      >
        <Building className="h-4 w-4 flex-shrink-0" />
        <span className="truncate">🏠 {t("owner")}</span>
      </Button>
    </div>
  );
}
