"use client";

import { useContractConfig, useContractValidation } from '@/hooks/useContractConfig';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { useState } from 'react';

export function EnvironmentIndicator() {
  const config = useContractConfig();
  const validation = useContractValidation();
  const [showDetails, setShowDetails] = useState(false);

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case 'mainnet':
        return 'bg-red-500 hover:bg-red-600';
      case 'testnet':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'local':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getEnvironmentLabel = (env: string) => {
    switch (env) {
      case 'mainnet':
        return '生产环境';
      case 'testnet':
        return '测试网';
      case 'local':
        return '本地环境';
      default:
        return '未知环境';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex flex-col items-end gap-2">
        {/* 环境指示器 */}
        <Badge
          className={`${getEnvironmentColor(config.environment)} text-white cursor-pointer transition-all duration-200`}
          onClick={() => setShowDetails(!showDetails)}
        >
          {getEnvironmentLabel(config.environment)}
          {!validation.isValid && ' ⚠️'}
        </Badge>

        {/* 详细信息面板 */}
        {showDetails && (
          <Card className="p-4 min-w-[300px] bg-background/95 backdrop-blur-sm border shadow-lg">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">环境配置</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">当前环境:</span>
                  <span className="font-mono">{config.environment}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">链ID:</span>
                  <span className="font-mono">{config.chainId}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">环境匹配:</span>
                  <span className={config.isEnvironmentMatched ? 'text-green-600' : 'text-red-600'}>
                    {config.isEnvironmentMatched ? '✓ 匹配' : '✗ 不匹配'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">合约状态:</span>
                  <span className={validation.hasValidContracts ? 'text-green-600' : 'text-red-600'}>
                    {validation.hasValidContracts ? '✓ 有效' : '✗ 无效'}
                  </span>
                </div>
              </div>

              {/* 合约地址 */}
              <div className="border-t pt-3">
                <h4 className="font-medium text-xs mb-2">合约地址</h4>
                <div className="space-y-1 text-xs">
                  <div>
                    <div className="text-muted-foreground">RenToken:</div>
                    <div className="font-mono text-[10px] break-all">
                      {config.addresses.renToken}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">PropertyManager:</div>
                    <div className="font-mono text-[10px] break-all">
                      {config.addresses.propertyManager}
                    </div>
                  </div>
                </div>
              </div>

              {/* 问题提示 */}
              {validation.issues.length > 0 && (
                <div className="border-t pt-3">
                  <h4 className="font-medium text-xs mb-2 text-red-600">问题</h4>
                  <ul className="text-xs space-y-1">
                    {validation.issues.map((issue, index) => (
                      <li key={index} className="text-red-600">• {issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 帮助信息 */}
              {config.environment === 'local' && (
                <div className="border-t pt-3">
                  <p className="text-xs text-muted-foreground">
                    💡 在本地环境中，确保 Hardhat 或 Anvil 正在运行
                  </p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
