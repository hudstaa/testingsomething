import { create } from 'zustand';
import axios from 'axios';

interface HoldingData {
    users: {
        twitterName: string;
        twitterUsername: string;
        twitterPfpUrl: string;
        shareSupply: number;
        displayPrice: string;
        holderCount: number;
        balance: number;
        address: string;
    }[];
}

interface HoldingStore {
    holdingCache: Record<string, HoldingData | undefined>;
    loading: Record<string, boolean>;
    error: Record<string, string | null>;
    setHoldingData: (address: string, data: HoldingData) => void;
    isLoading: (address: string) => boolean;
    setError: (address: string, error: string | null) => void;
    fetchHoldingData: (address: string) => void;
    getHolding: (wallet: string | undefined, address: string) => HoldingData | undefined;
    getError: (address: string) => string | null | undefined;
}

export const useFriendTechHolders = create<HoldingStore>((set, store) => ({
    holdingCache: {},
    loading: {},
    error: {},
    setHoldingData: (address, data) =>
        set(state => ({
            holdingCache: { ...state.holdingCache, [address]: data },
            loading: { ...state.loading, [address]: false },
            error: { ...state.error, [address]: null },
        })),
    isLoading: (address) => store().loading[address],
    setError: (address, error) =>
        set(state => ({ error: { ...state.error, [address]: error } })),
    getHolding: (wallet, address) => {
        if (typeof address === 'undefined' || address.length === 0) {
            return;
        }
        if (store().holdingCache[address]) {
            return store().holdingCache[address];
        }
        if (store().loading[address] || store().error[address]) {
            return;
        }
        setTimeout(() => {
            store().fetchHoldingData(address);
        }, 0);
    },
    getError: (address) => store().error[address],
    fetchHoldingData: async (address) => {
        if (store().isLoading(address)) {
            return;
        }
        try {
            set(state => ({ loading: { ...state.loading, [address]: true } }));
            const response = await axios.get(`https://prod-api.kosetto.com/users/${address}/token/holders`);
            set(state => ({
                holdingCache: { ...state.holdingCache, [address]: response.data },
                error: { ...state.error, [address]: null },
            }));
        } catch (err: any) {
            set(state => ({ error: { ...state.error, [address]: err.message } }));
        } finally {
            set(state => ({ loading: { ...state.loading, [address]: false } }));
        }
    },
}));






