/*
 * @Author: dreamworks.cnn@gmail.com
 * @Date: 2025-08-23 20:00:00
 * @LastEditors: dreamworks.cnn@gmail.com
 * @LastEditTime: 2025-08-23 20:00:00
 * @FilePath: /rentoken-web/src/hooks/index.ts
 * @Description: Hooks统一导出文件
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */

// 现有的hooks
export { useContractConfig, useContractAddress, useContractValidation } from './useContractConfig';
export { useInvest } from './useInvest';
export { useInvestorInvestments } from './useInvestorInvestments';
export { useInvestorStats } from './useInvestorStats';
export { useKycStatus } from './useKycStatus';
export { useProperties } from './useProperties';
export { useI18n } from './useI18n';

// RentToken相关hooks
export { useRentTokenBalance } from './useRentTokenBalance';
export { useRentTokenPhase, RentTokenPhase, PHASE_DESCRIPTIONS } from './useRentTokenPhase';
export { useRentTokenClaimable } from './useRentTokenClaimable';
export { usePropertiesBlockchainState } from './usePropertiesBlockchainState';
