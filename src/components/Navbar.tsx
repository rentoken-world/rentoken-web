
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { WalletConnectButton } from "@/components/WalletConnectButton";
import { useI18n } from "@/hooks/useI18n";

export function Navbar() {
  const { t } = useI18n();

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 glass-dark border-b border-primary/20 backdrop-blur-md sticky top-0 z-50">
      {/* Logo Section */}
      <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <div className="relative group">
          <Image 
            src="/logo.jpg" 
            alt={`${t("rentoken")} Logo`} 
            width={40} 
            height={40} 
            className="rounded-lg ring-2 ring-primary/30 transition-all duration-300 group-hover:ring-primary/60" 
          />
          <div className="absolute inset-0 rounded-lg bg-gradient-sushi opacity-20 animate-pulse group-hover:opacity-30 transition-opacity"></div>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-xl tracking-tight neon-text bg-gradient-sushi bg-clip-text text-transparent">
            {t("rentoken")}
          </span>
          <Badge variant="secondary" className="text-xs px-2 py-0 h-auto">
            RWA Platform
          </Badge>
        </div>
      </Link>
      
      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-6 min-w-[600px] justify-end">
        {/* Language Switcher */}
        <div className="flex-shrink-0">
          <LanguageSwitcher />
        </div>
        
        <div className="h-6 w-px bg-border/50 flex-shrink-0"></div>
        
        {/* Theme Switcher */}
        <div className="flex-shrink-0">
          <ThemeSwitcher />
        </div>
        
        <div className="h-6 w-px bg-border/50 flex-shrink-0"></div>
        
        {/* Role Switcher - Investor/Owner Items */}
        <div className="flex-shrink-0">
          <RoleSwitcher />
        </div>
        
        <div className="h-6 w-px bg-border/50 flex-shrink-0"></div>

        {/* Wallet Connection */}
        <div className="flex-shrink-0">
          <WalletConnectButton />
        </div>
      </div>

      {/* Tablet Navigation */}
      <div className="hidden md:flex lg:hidden items-center gap-3 min-w-[300px] justify-end">
        {/* Compact view for tablets */}
        <div className="flex-shrink-0">
          <LanguageSwitcher />
        </div>
        <div className="flex-shrink-0">
          <ThemeSwitcher />
        </div>
        <div className="flex-shrink-0">
          <WalletConnectButton />
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center gap-2">
        {/* Quick Theme Switcher for Mobile */}
        <div className="flex-shrink-0">
          <ThemeSwitcher />
        </div>
        
        {/* Mobile Menu Sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="glass" size="icon" className="glass border border-primary/30 hover:border-primary transition-all duration-300 relative">
              <Menu className="h-5 w-5 text-primary" />
              <span className="sr-only">Toggle mobile menu</span>
              {/* Indicator dot */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-sushi rounded-full animate-pulse" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="glass-dark border-primary/20 w-full sm:w-80 p-0">
            <div className="flex flex-col h-full">
              {/* Header */}
              <SheetHeader className="p-6 border-b border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-sushi flex items-center justify-center">
                    <span className="text-white font-bold">R</span>
                  </div>
                  <div>
                    <SheetTitle className="neon-text bg-gradient-sushi bg-clip-text text-transparent text-xl">
                      {t("rentoken")}
                    </SheetTitle>
                    <p className="text-xs text-muted-foreground">DeFi Platform</p>
                  </div>
                </div>
              </SheetHeader>
              
              {/* Navigation Content */}
              <div className="flex-1 p-6 space-y-6">
                {/* Role Selection - Enhanced for Mobile */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Choose Your Role
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <RoleSwitcher />
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    <Button variant="ghost" className="justify-start h-12 text-left" asChild>
                      <a href="/investor" className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          🚀
                        </div>
                        <div>
                          <div className="font-medium">Start Investing</div>
                          <div className="text-xs text-muted-foreground">Browse properties</div>
                        </div>
                      </a>
                    </Button>
                    <Button variant="ghost" className="justify-start h-12 text-left" asChild>
                      <a href="/owner" className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                          🏠
                        </div>
                        <div>
                          <div className="font-medium">List Property</div>
                          <div className="text-xs text-muted-foreground">Tokenize your asset</div>
                        </div>
                      </a>
                    </Button>
                    <Button variant="ghost" className="justify-start h-12 text-left" asChild>
                      <a href="/analytics" className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                          📊
                        </div>
                        <div>
                          <div className="font-medium">Analytics</div>
                          <div className="text-xs text-muted-foreground">Market insights</div>
                        </div>
                      </a>
                    </Button>
                  </div>
                </div>

                {/* Settings */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Settings
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg glass border border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          🌐
                        </div>
                        <span className="font-medium">Language</span>
                      </div>
                      <LanguageSwitcher />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg glass border border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                          🎨
                        </div>
                        <span className="font-medium">Theme</span>
                      </div>
                      <ThemeSwitcher />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer - Wallet Connection */}
              <div className="p-6 border-t border-primary/20 bg-gradient-to-r from-background/50 to-primary/5">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Connect Wallet
                  </h3>
                  <WalletConnectButton />
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
