import axios from 'axios';
// User Details
export interface UserDetails {
    balance: any;
    keysOwned: any;
    id: number;
    address: string;
    twitterUsername: string;
    twitterName: string;
    twitterPfpUrl: string;
    twitterUserId: string;
    lastOnline: number;
    holderCount: number;
    holdingCount: number;
    shareSupply: number;
    displayPrice: string;
    lifetimeFeesCollectedInWei: string;
}

// Trader and Subject
interface TraderSubject {
    address: string;
    pfpUrl: string;
    username: string;
    name: string;
}

// Holdings Activity
export interface HoldingsActivityEvent {
    trader: TraderSubject;
    subject: TraderSubject;
    isBuy: boolean;
    shareAmount: string;
    ethAmount: string;
    createdAt: number;
}

export interface HoldingsActivity {
    events: HoldingsActivityEvent[];
    nextPageStart: number;
}

// Friends Activity
export interface FriendsActivityEvent {
    trader: TraderSubject;
    subject: TraderSubject;
    isBuy: boolean;
    shareAmount: string;
    ethAmount: string;
    createdAt: number;
}

export interface FriendsActivity {
    events: FriendsActivityEvent[];
    nextPageStart: number;
}

// Portfolio
export interface PortfolioHolding {
    pfpUrl: string;
    username: string;
    name: string;
    subject: string;
    chatRoomId: string;
    price: string;
    balance: string;
    balanceEthValue: string;
    lastOnline: number | null;
    lastMessageName: string;
    lastMessageTime: number;
    lastMessageText: string;
    lastRead: number;
}

export interface Portfolio {
    holdings: PortfolioHolding[];
    portfolioValueWei: string;
    nextPageStart: number;
}

// Points
export interface Points {
    address: string;
    totalPoints: number;
    tier: string;
}

// Used Code
export interface UsedCode {
    isAddressInvited: boolean;
}

// Gating State
export interface GatingState {
    isAccepted: boolean;
}

// Chatroom Enabled
export interface ChatroomEnabled {
    isEnabled: true;
}

// Users by ID
export interface UserById extends UserDetails { }

// Search Users by Twitter Handle
export interface SearchUsers {
    users: UserDetails[];
}

// Events
export interface Event {
    id: number;
    createdAt: number
    ethAmount: string
    isBuy: boolean
    shareAmount: string
    subject: {
        address: string
        name: string
        pfpUrl: string
        username: string
    }
    trader: {
        address: string
        name: string
        pfpUrl: string
        username: string
    }
}

export interface Events {
    events: Event[];
}

// Top List by Price
export interface TopListByPrice {
    users: UserDetails[];
}

// Trending
export interface TrendingUser {
    twitterUsername: string;
    twitterName: string;
    twitterPfpUrl: string;
    lastOnline: number;
    displayPrice: string;
    volume: string;
    netBuy: string;
}

export interface Trending {
    users: TrendingUser[];
}

// Bonus Endpoints
// Accounts (undetermined)
// Kosetto Config
export interface KosettoConfig {
    minAppVersionIOS: string;
    minAppVersionAndroid: string;
    gachaCost: number;
    network: string;
    contractAddress: string;
    gachaLaunchMs: number;
}

// Error Response
export interface ErrorResponse {
    message: string;
}

const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiMHg1NDNiZTQyYTg3NjgxY2Q2ZDIzNzkwYzI5MzRjYzc1ZDNlNWU3MjBhIiwiaWF0IjoxNjk1MDA2ODAzLCJleHAiOjE2OTc1OTg4MDN9.eWbhjsWSFGGAQh_D5EjagZ0qX-VeLBxmqsASaR96AM8'

const BASE_URL = 'https://prod-api.kosetto.com';

const apiClient = axios.create({
    baseURL: BASE_URL,
});

const getHeaders = () => {
    return authToken ? { Authorization: authToken } : {};
};

// Error Handling
const handleError = (error: any): ErrorResponse => {
    return error.response?.data || { message: 'An unexpected error occurred' };
};

// User Endpoints
export const getUserDetails = async (
    address: string,
): Promise<UserDetails | ErrorResponse> => {
    try {
        const response = await apiClient.get<UserDetails>(`/users/${address}`, {
            headers: getHeaders(),
        });
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

// Search Users by Twitter Handle
export const searchUsersByTwitterHandle = async (
    username: string,
): Promise<{ users: Array<any> } | ErrorResponse> => {
    try {
        const response = await apiClient.get(`/search/users?username=${username}`, {
            headers: getHeaders(),
        });
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};
export const getWalletInfo = async (
    address: string,
): Promise<{ feesCollected: string, portfolioValue: string } | ErrorResponse> => {
    try {
        const response = await apiClient.get(`/wallet-info/${address}`, {
            headers: getHeaders(),
        });
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};
export const getHolders = async (
    address: string,
): Promise<{ users: UserDetails[], address: string }> => {
    try {
        const response = await apiClient.get(`users/${address}/token/holders`, {
        });
        return { ...response.data, address };
    } catch (error) {
        return { ...handleError(error), users: [], address };
    }
};

export const getHolding = async (
    address: string,
): Promise<{ users: UserDetails[], address: string }> => {
    try {
        const response = await apiClient.get(`users/${address}/token-holdings`, {
            headers: getHeaders()
        });
        return { ...response.data, address };
    } catch (error) {
        return { ...handleError(error), users: [], address };
    }
};



// Holdings Activity
export const getHoldingsActivity = async (
    address: string,
    offset: number
): Promise<HoldingsActivity | ErrorResponse> => {
    try {
        const response = await apiClient.get<HoldingsActivity>('/holdings-activity/' + address + '?pageStart=' + offset, {
            headers: getHeaders(),
        });
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

// Holdings Activity
export const getGlobalActivity = async (): Promise<HoldingsActivity | ErrorResponse> => {
    try {
        const response = await apiClient.get<HoldingsActivity>('/global-activity/?pageStart=', {
            headers: getHeaders(),
        });
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

// Trade Activity
export const getTradesActivity = async (
    address: string,
    offset: number
): Promise<HoldingsActivity | ErrorResponse> => {
    try {
        const response = await apiClient.get<HoldingsActivity>(`/users/${address}/trade-activity`, {
            headers: getHeaders(),
        });
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

// Friends Activity
export const getFriendsActivity = async (
    address: string,
): Promise<FriendsActivity | ErrorResponse> => {
    try {
        const response = await apiClient.get<FriendsActivity>(`/friends-activity/${address}`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

// Portfolio
export const getWatchlistActivity = async (
    address: string,
): Promise<Events | ErrorResponse> => {
    try {
        const response = await apiClient.get<Events>(`/watchlist-activity/${address}`, {
            headers: getHeaders(),
        });
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

// Points
export const getPoints = async (address: string): Promise<Points | ErrorResponse> => {
    try {
        const response = await apiClient.get<Points>(`/points/${address}`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

// Events
export const getEvents = async (): Promise<Events | ErrorResponse> => {
    try {
        const response = await apiClient.get<Events>('/events');
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

// Top List by Price
export const getTopListByPrice = async (): Promise<TopListByPrice | ErrorResponse> => {
    try {

        const response = await apiClient.get<TopListByPrice>('/lists/top-by-price');
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

// Trending
export const getTrending = async (): Promise<Trending | ErrorResponse> => {
    try {
        const response = await apiClient.get<Trending>('/lists/trending');
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

// Trending
export const getActive = async (): Promise<Trending | ErrorResponse> => {
    try {
        const response = await apiClient.get<Trending>('/lists/online');
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

// Kosetto Config
export const getKosettoConfig = async (): Promise<KosettoConfig | ErrorResponse> => {
    try {
        const response = await apiClient.get<KosettoConfig>('/config');
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};