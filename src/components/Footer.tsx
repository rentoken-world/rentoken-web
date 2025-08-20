"use client";

import React from "react";
import { siteConfig } from "@/config/site";
import { useI18n } from "@/hooks/useI18n";
import { Github, Mail, Twitter, Send, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Footer() {
  const { t } = useI18n();

  const socialLinks = [
    {
      href: siteConfig.github,
      icon: Github,
      label: "GitHub",
      external: true
    },
    {
      href: `mailto:${siteConfig.email}`,
      icon: Mail,
      label: t("email"),
      external: false
    },
    {
      href: siteConfig.twitter,
      icon: Twitter,
      label: "Twitter",
      external: true
    },
    {
      href: siteConfig.telegram,
      icon: Send,
      label: "Telegram",
      external: true
    }
  ];

  return (
    <footer className="relative w-full mt-16 border-t border-primary/20 bg-gradient-to-b from-background/50 to-background backdrop-blur-sm">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-sushi opacity-5" />
      
      <div className="relative container mx-auto px-6 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-sushi flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="font-bold text-xl neon-text bg-gradient-sushi bg-clip-text text-transparent">
                {t("rentoken")}
              </span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-left max-w-sm">
              🏠 Tokenizing real estate revenue streams for global investors
            </p>
            <Badge variant="secondary" className="text-xs">
              DeFi Platform
            </Badge>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center space-y-3">
            <h3 className="font-semibold text-sm text-foreground">Quick Links</h3>
            <div className="flex flex-col space-y-2 text-center">
              <Button variant="ghost" size="sm" className="text-xs h-auto p-1" asChild>
                <a href="/investor">🚀 Start Investing</a>
              </Button>
              <Button variant="ghost" size="sm" className="text-xs h-auto p-1" asChild>
                <a href="/owner">🏠 List Property</a>
              </Button>
              <Button variant="ghost" size="sm" className="text-xs h-auto p-1" asChild>
                <a href="/analytics">📊 Analytics</a>
              </Button>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center md:items-end space-y-4">
            <h3 className="font-semibold text-sm text-foreground">Connect</h3>
            <div className="flex items-center gap-3">
              {socialLinks.map((link) => {
                const IconComponent = link.icon as React.ComponentType<{ className?: string }>;
                return (
                  <Button
                    key={link.label}
                    variant="glass"
                    size="icon"
                    className="h-9 w-9 border border-primary/30 hover:border-primary transition-all duration-300 group"
                    asChild
                  >
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      aria-label={link.label}
                    >
                      <IconComponent className="h-4 w-4 group-hover:text-primary transition-colors" />
                    </a>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>© 2025 {t("rentoken")}</span>
            <span className="hidden md:inline">•</span>
            <span className="flex items-center gap-1">
              {/* @ts-ignore - React 19 compatibility issue */}
              Made with <Heart className="h-3 w-3 text-red-400 animate-pulse" /> for DeFi
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-xs">
            <Button variant="ghost" size="sm" className="text-xs h-auto p-1">
              Privacy Policy
            </Button>
            <Button variant="ghost" size="sm" className="text-xs h-auto p-1">
              Terms of Service
            </Button>
            <Button variant="ghost" size="sm" className="text-xs h-auto p-1">
              Documentation
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
