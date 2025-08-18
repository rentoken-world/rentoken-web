import { ChainId } from "./chainId";

export type Token = {
    id: string;
    name: string;
    symbol: string;
    decimals: number;
    network: ChainId;
}