import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 导出 RentToken 工具函数
export { 
  getRentTokenBalance, 
  getRentTokenPhase, 
  getRentTokenClaimable,
  getBatchRentTokenStatus,
  RentTokenPhase,
  PHASE_DESCRIPTIONS,
  type RentTokenStatus
} from './rentTokenUtils';
