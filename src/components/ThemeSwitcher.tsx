"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";

export function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 min-w-[100px] justify-center">
        <span className="text-sm w-6 text-center">🌞</span>
        <Switch disabled className="flex-shrink-0" />
        <span className="text-sm w-6 text-center">🌙</span>
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className="flex items-center gap-2 min-w-[100px] justify-center">
      <span className={`text-sm w-6 text-center transition-opacity ${isDark ? 'opacity-50' : 'opacity-100'}`}>🌞</span>
      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        className="data-[state=checked]:bg-primary flex-shrink-0"
      />
      <span className={`text-sm w-6 text-center transition-opacity ${isDark ? 'opacity-100' : 'opacity-50'}`}>🌙</span>
    </div>
  );
}