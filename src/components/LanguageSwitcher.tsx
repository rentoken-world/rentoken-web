"use client";

import { useI18n } from "@/hooks/useI18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  return (
    <div className="min-w-[90px]">
      <Select value={language} onValueChange={(value: "en" | "zh") => setLanguage(value)}>
        <SelectTrigger className="w-[90px] h-8 text-xs glass border border-primary/30 focus:border-primary">
          <SelectValue placeholder="Lang" />
        </SelectTrigger>
        <SelectContent className="glass border border-primary/20">
          <SelectItem value="en" className="text-sm">
            🇺🇸 EN
          </SelectItem>
          <SelectItem value="zh" className="text-sm">
            🇨🇳 中文
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
