"use client";

import { useState } from "react";
import { useI18n } from "@/hooks/useI18n";
import { useProperties } from "@/hooks/useProperties";
import { useInvestorStats } from "@/hooks/useInvestorStats";
import { useInvestorInvestments } from "@/hooks/useInvestorInvestments";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAccount } from "wagmi";

export default function InvestorPage() {
  const { t } = useI18n();
  const { isConnected } = useAccount();
  
  // 搜索和分页状态
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // 投资记录相关状态
  const [currentView, setCurrentView] = useState<'properties' | 'investments'>('properties');
  const [investmentsPage, setInvestmentsPage] = useState(1);
  const [investmentsSortBy, setInvestmentsSortBy] = useState<'date' | 'amount' | 'tokens'>('date');
  const [investmentsSortOrder, setInvestmentsSortOrder] = useState<'asc' | 'desc'>('desc');

    // 获取房产数据
  const { 
    data: propertiesData, 
    loading: propertiesLoading, 
    error: propertiesError,
    refetch: refetchProperties
  } = useProperties({
    page: currentPage,
    limit: 9,
    search: searchTerm,
  });

  // 获取投资者统计数据
  const { 
    data: statsData, 
    loading: statsLoading, 
    error: statsError,
    refetch: refetchStats
  } = useInvestorStats();

  // 获取投资记录数据
  const {
    data: investmentsData,
    loading: investmentsLoading,
    error: investmentsError,
    refetch: refetchInvestments
  } = useInvestorInvestments({
    page: investmentsPage,
    limit: 10,
    sortBy: investmentsSortBy,
    sortOrder: investmentsSortOrder,
  });

  const handleInvestmentSuccess = () => {
    // 刷新数据
    refetchProperties();
    refetchStats();
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Card variant="glass" className="p-8 mb-8 border-primary/20 backdrop-blur-sm">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Investment{" "}
              <span className="neon-text bg-gradient-sushi bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Manage your real estate investments and discover new{" "}
              <span className="text-secondary font-semibold">tokenized opportunities</span>.
            </p>
          </div>
        </Card>
        
        {/* 投资概览 */}
        <section className="mb-8">
          {isConnected ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card variant="sushi" className="p-6 backdrop-blur-sm">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Invested</h3>
                {statsLoading ? (
                  <div className="text-2xl font-bold neon-text animate-pulse">Loading...</div>
                ) : (
                  <>
                    <p className="text-2xl font-bold neon-text bg-gradient-sushi bg-clip-text text-transparent">
                      ${statsData?.totalInvested.toLocaleString() || '0'}
                    </p>
                    <p className="text-xs text-secondary">+{statsData?.monthlyGrowth || 0}% this month</p>
                  </>
                )}
              </Card>
              <Card variant="sushi" className="p-6 backdrop-blur-sm">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Monthly Income</h3>
                {statsLoading ? (
                  <div className="text-2xl font-bold neon-text animate-pulse">Loading...</div>
                ) : (
                  <>
                    <p className="text-2xl font-bold neon-text bg-gradient-sushi-secondary bg-clip-text text-transparent">
                      ${statsData?.monthlyIncome.toFixed(2) || '0.00'}
                    </p>
                    <p className="text-xs text-secondary">Next payment in {statsData?.nextPaymentDays || 0} days</p>
                  </>
                )}
              </Card>
              <Card variant="sushi" className="p-6 backdrop-blur-sm">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Properties</h3>
                <p className="text-2xl font-bold neon-text bg-gradient-sushi-accent bg-clip-text text-transparent">
                  {statsData?.totalProperties || 0}
                </p>
                <p className="text-xs text-muted-foreground">Active investments</p>
              </Card>
              <Card variant="sushi" className="p-6 backdrop-blur-sm">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Avg APY</h3>
                <p className="text-2xl font-bold neon-text bg-gradient-sushi bg-clip-text text-transparent">
                  {statsData?.averageApy || 0}%
                </p>
                <p className="text-xs text-secondary">Above market average</p>
              </Card>
            </div>
          ) : (
            <Card variant="glass" className="p-8 text-center border-primary/30">
              <div className="w-16 h-16 bg-gradient-sushi rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <span className="text-2xl">🔐</span>
              </div>
              <p className="text-xl font-semibold mb-2 text-card-foreground">Connect Your Wallet</p>
              <p className="text-muted-foreground">Connect your wallet to view your investment statistics</p>
            </Card>
          )}
        </section>
        
        {/* 项目列表区域 */}
        <section className="mb-8">
          <Card variant="glass" className="p-6 mb-6 border-primary/20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-2xl font-bold">{t("availableProjects")}</h2>
              <div className="flex gap-3">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder={t("searchPlaceholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 bg-background/50 border border-primary/30 rounded-lg text-sm min-w-[200px] backdrop-blur-sm focus:border-primary focus:outline-none transition-colors"
                  />
                  <Button type="submit" variant="sushi" size="sm">
                    🔍 Search
                  </Button>
                </form>
                <Button variant="glass" size="sm" className="border-primary/30 hover:border-primary">
                  📊 {t("myProjects")}
                </Button>
              </div>
            </div>
          </Card>

          {/* 加载状态 */}
          {propertiesLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} variant="glass" className="p-6 animate-pulse border-primary/20">
                  <div className="h-48 bg-muted/30 rounded-lg mb-4"></div>
                  <div className="h-4 bg-muted/30 rounded mb-2"></div>
                  <div className="h-4 bg-muted/30 rounded w-2/3"></div>
                </Card>
              ))}
            </div>
          )}

          {/* 错误状态 */}
          {propertiesError && (
            <Card variant="glass" className="p-8 text-center border-destructive/30">
              <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <p className="text-xl font-semibold text-destructive mb-2">Error Loading Properties</p>
              <p className="text-muted-foreground">{propertiesError}</p>
            </Card>
          )}

          {/* Property Cards Grid */}
          {propertiesData && propertiesData.data && !propertiesLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {propertiesData.data.map((property) => (
                <PropertyCard 
                  key={property.id} 
                  {...property} 
                  onInvestmentSuccess={handleInvestmentSuccess}
                />
              ))}
            </div>
          )}

          {/* 空状态 */}
          {propertiesData && (!propertiesData.data || propertiesData.data.length === 0) && !propertiesLoading && (
            <Card variant="glass" className="p-12 text-center border-primary/20">
              <div className="w-24 h-24 bg-gradient-sushi-secondary rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                <span className="text-4xl">🏠</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-card-foreground">
                {searchTerm ? "No Properties Found" : "No Properties Available"}
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-md mx-auto">
                {searchTerm 
                  ? `No properties found for "${searchTerm}". Try adjusting your search terms.`
                  : "There are currently no properties available for investment. Check back soon for new opportunities!"
                }
              </p>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}
