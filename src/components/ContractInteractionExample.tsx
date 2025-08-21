"use client";

import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { useContractAddress, useContractConfig } from '@/hooks/useContractConfig';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

// 这是一个示例组件，展示如何在组件中使用合约配置
export function ContractInteractionExample() {
  const { address, isConnected } = useAccount();
  const config = useContractConfig();
  const renTokenAddress = useContractAddress('renToken');
  const [loading, setLoading] = useState(false);

  // 示例：读取合约数据
  const { data: tokenName } = useReadContract({
    address: renTokenAddress as `0x${string}`,
    abi: [
      {
        name: 'name',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ type: 'string' }],
      },
    ],
    functionName: 'name',
  });

  // 示例：写入合约（需要根据实际合约 ABI 调整）
  const { writeContract } = useWriteContract();

  const handleContractCall = async () => {
    if (!isConnected || !address) {
      alert('请先连接钱包');
      return;
    }

    setLoading(true);
    try {
      // 这里是示例调用，实际使用时需要替换为真实的合约方法
      writeContract({
        address: renTokenAddress as `0x${string}`,
        abi: [
          // 实际的合约 ABI
        ],
        functionName: 'someFunction',
        args: [],
      });
    } catch (error) {
      console.error('合约调用失败:', error);
      alert('合约调用失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">合约交互示例</h3>
          <Badge variant="outline">
            {config.environment}
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">环境:</span>
            <span>{config.environment}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">链ID:</span>
            <span>{config.chainId}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">RenToken合约:</span>
            <span className="font-mono text-xs">{renTokenAddress}</span>
          </div>

          {tokenName && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">代币名称:</span>
              <span>{tokenName as string}</span>
            </div>
          )}
        </div>

        {config.environment === 'local' && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              💡 当前为本地环境，确保本地区块链节点正在运行
            </p>
          </div>
        )}

        {config.environment === 'mainnet' && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">
              ⚠️ 当前为生产环境，请谨慎操作
            </p>
          </div>
        )}

        <Button 
          onClick={handleContractCall}
          disabled={!isConnected || loading}
          className="w-full"
        >
          {loading ? '调用中...' : '示例合约调用'}
        </Button>

        {!isConnected && (
          <p className="text-center text-sm text-muted-foreground">
            请先连接钱包以使用合约功能
          </p>
        )}
      </div>
    </Card>
  );
}
