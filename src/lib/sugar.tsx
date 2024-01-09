import { Capacitor } from "@capacitor/core";
import { getAuth, initializeAuth } from "firebase/auth";
import * as linkifyjs from 'linkifyjs';
import { formatEther } from "viem";
import { app } from "../App";

export const formatEth = (info: bigint | undefined) => {
    if (typeof info == 'undefined') {
        return ""
    }
    return parseFloat(formatEther(info)).toFixed(3) + "Ξ"
}

export const uniq = (array: Record<string, any>[]) => {

    return array.filter((person, index, self) =>
        !self.some((otherPerson, otherIndex) =>
            otherIndex < index &&
            person.address.toLowerCase() === otherPerson.address.toLowerCase()
        )
    );
}
export const uniqId = (array: Record<string, any>[]) => {

    return array.filter((person, index, self) =>
        !self.some((otherPerson, otherIndex) =>
            otherIndex < index &&
            person.id.toLowerCase() === otherPerson.id.toLowerCase()
        )
    );
}
export const uniqByProp = (array: Record<string, any>[], prop: string) => {

    return array.filter((person, index, self) =>
        !self.some((otherPerson, otherIndex) =>
            otherIndex < index &&
            person[prop].toLowerCase() === otherPerson[prop].toLowerCase()
        )
    );
}

export function nativeAuth() {
    let auth
    if (Capacitor.isNativePlatform()) {
        auth = initializeAuth(app)
    } else {
        auth = getAuth()
    }
    return auth
}
export function hideTabs() {
    const tabsEl = document.querySelector('ion-tab-bar');
    if (tabsEl) {
        tabsEl.style.display = 'none'; // Slide out
    }
}

export function showTabs() {
    const tabsEl = document.querySelector('ion-tab-bar');
    if (tabsEl) {
        tabsEl.style.display = ''; // Slide in
    }
}
export function slideTabOut() {
    const tabsEl = document.querySelector('ion-tab-bar');
    if (tabsEl) {
        // Slide out - move the element down by its own height
        tabsEl.style.transform = `translateY(${tabsEl.clientHeight}px)`;
    }
}

export function slideTabIn() {
    const tabsEl = document.querySelector('ion-tab-bar');
    if (tabsEl) {
        // Slide in - move the element back to its original position
        tabsEl.style.transform = 'translateY(0)';
    }
}

// Create a new token that class that the parser emits when it finds a hashtag
const CashtagToken = linkifyjs.createTokenClass('cashtag', {
    isLink: true,
    toHref() {
        return window.location.host + '' + known_pairs[this.toString().slice(1).toLowerCase()]?.swap;
    }
});
const USDCSOLAddress = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
const WSOLAddress = 'So11111111111111111111111111111111111111112'
/**
 * @type {import('linkifyjs').Plugin}
 */
function cashtag(_ref: any) {
    let {
        scanner,
        parser
    } = _ref;
    // Various tokens that may compose a hashtag
    const {
        DOLLAR,
        UNDERSCORE
    } = scanner.tokens;
    const {
        alpha,
        numeric,
        alphanumeric,
        emoji
    } = scanner.tokens.groups;

    // Take or create a transition from start to the '#' sign (non-accepting)
    // Take transition from '#' to any text token to yield valid hashtag state
    // Account for leading underscore (non-accepting unless followed by alpha)
    const Hash = parser.start.tt(DOLLAR);
    const HashPrefix = Hash.tt(UNDERSCORE);
    const Hashtag = new linkifyjs.State(CashtagToken);
    Hash.ta(numeric, HashPrefix);
    Hash.ta(alpha, Hashtag);
    Hash.ta(emoji, Hashtag);
    HashPrefix.ta(alpha, Hashtag);
    HashPrefix.ta(emoji, Hashtag);
    HashPrefix.ta(numeric, HashPrefix);
    HashPrefix.tt(UNDERSCORE, HashPrefix);
    Hashtag.ta(alphanumeric, Hashtag);
    Hashtag.ta(emoji, Hashtag);
    Hashtag.tt(UNDERSCORE, Hashtag); // Trailing underscore is okay
}

linkifyjs.registerPlugin('cashtag', cashtag);
export type currencySwapInfo = { chain: string, inputCurrency?: string, outputCurrency: string };
export const known_pairs: Record<string, { swap: currencySwapInfo, emoji: string, symbol: string }> = {
    nola: {
        emoji: '🐈‍⬛',
        swap: {
            outputCurrency: '0xF8388c2B6Edf00E2E27eEF5200B1beFB24cE141d',
            chain: 'arbitrum',
            inputCurrency: 'ETH'
        },
        symbol: 'NOLAWETH_DB9A76.USD',
    },
    size: {
        emoji: '💪',
        swap: {
            outputCurrency: "0x939727d85D99d0aC339bF1B76DfE30Ca27C19067",
            chain: "arbitrum",
            inputCurrency: "ETH"
        },
        symbol: 'SIZEWETH_E8DD5E.USD',
    },
    tribe: {
        emoji: '🏕️',
        "swap": {
            "outputCurrency": "0x0",
            "chain": "solana",
            "inputCurrency": "0x0"
        },
        symbol: 'unknown'
    },
    bonk: {
        emoji: '🏏',
        swap: {
            chain: "solana",
            outputCurrency: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
            inputCurrency: USDCSOLAddress,
        },
        symbol: 'BONKUSDT'
    },
    merlin: {
        emoji: '🪄',
        swap: {
            inputCurrency: 'ETH',
            outputCurrency: "0x234F534D322dF1a8a236a2F952d6657bf800F1FA",
            chain: "arbitrum"
        },
        symbol: 'MERLINWETH_E75D23'
    },
    mog: {
        emoji: '🕶️',
        swap: {
            outputCurrency: "0xaaeE1A9723aaDB7afA2810263653A34bA2C21C7a",
            chain: "mainnet",
            inputCurrency: "ETH"
        },
        symbol: 'MOGWETH_C2EAB7.USD'
    },
    pepe: {
        emoji: '🐸',
        swap: {
            outputCurrency: '0x6982508145454Ce325dDbE47a25d4ec3d2311933', chain: 'mainnet', inputCurrency: 'ETH'
        },
        symbol: 'PEPEUSDT'
    },
    wif: {
        symbol: 'WIFUSDT',
        emoji: '👒', swap:
            { outputCurrency: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', chain: 'solana' }
    },
    bitcoin: {
        symbol: 'BITCOINWETH_0C3006.USD',
        emoji: '🦔',
        swap: {
            outputCurrency: "0x72e4f9f808c49a2a61de9c5896298920dc4eeea9",
            chain: "mainnet",
            inputCurrency: "ETH"
        }
    },
    "WETH": {
        "symbol": "WETH",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "0xBTC": {
        "symbol": "0xBTC",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xB6eD7644C69416d67B522e20bC294A9a9B405B31",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "aDAI": {
        "symbol": "aDAI",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xfC1E690f61EFd961294b3e1Ce3313fBD8aa4f85d",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "AMN": {
        "symbol": "AMN",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x737F98AC8cA59f2C68aD658E3C3d8C8963E40a4c",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "AMPL": {
        "symbol": "AMPL",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xD46bA6D942050d489DBd938a2C909A5d5039A161",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "ANJ": {
        "symbol": "ANJ",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xcD62b1C403fa761BAadFC74C525ce2B51780b184",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "ANT": {
        "symbol": "ANT",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x960b236A07cf122663c4303350609A66A7B288C0",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "AST": {
        "symbol": "AST",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x27054b13b1B798B345b591a4d22e6562d47eA75a",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "BAND": {
        "symbol": "BAND",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xBA11D00c5f74255f56a5E366F4F77f5A186d7f55",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "BAT": {
        "symbol": "BAT",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x0D8775F648430679A709E98d2b0Cb6250d2887EF",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "BAL": {
        "symbol": "BAL",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xba100000625a3754423978a60c9317c58a424e3D",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "BLT": {
        "symbol": "BLT",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x107c4504cd79C5d2696Ea0030a8dD4e92601B82e",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "BNT": {
        "symbol": "BNT",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "BTC++": {
        "symbol": "BTC++",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x0327112423F3A68efdF1fcF402F6c5CB9f7C33fd",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "BZRX": {
        "symbol": "BZRX",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x56d811088235F11C8920698a204A5010a788f4b3",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "CELR": {
        "symbol": "CELR",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x4F9254C83EB525f9FCf346490bbb3ed28a81C667",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "cSAI": {
        "symbol": "cSAI",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xF5DCe57282A584D2746FaF1593d3121Fcac444dC",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "cDAI": {
        "symbol": "cDAI",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "cUSDC": {
        "symbol": "cUSDC",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x39AA39c021dfbaE8faC545936693aC917d5E7563",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "CEL": {
        "symbol": "CEL",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xaaAEBE6Fe48E54f431b0C390CfaF0b017d09D42d",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "CHAI": {
        "symbol": "CHAI",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x06AF07097C9Eeb7fD685c692751D5C66dB49c215",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "COMP": {
        "symbol": "COMP",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xc00e94Cb662C3520282E6f5717214004A7f26888",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "SAI": {
        "symbol": "SAI",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "DAI": {
        "symbol": "DAI",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "DATA": {
        "symbol": "DATA",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x0Cf0Ee63788A0849fE5297F3407f701E122cC023",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "DGD": {
        "symbol": "DGD",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xE0B7927c4aF23765Cb51314A0E0521A9645F0E2A",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "DGX": {
        "symbol": "DGX",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x4f3AfEC4E5a3F2A6a1A411DEF7D7dFe50eE057bF",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "DIP": {
        "symbol": "DIP",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xc719d010B63E5bbF2C0551872CD5316ED26AcD83",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "DONUT": {
        "symbol": "DONUT",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xC0F9bD5Fa5698B6505F643900FFA515Ea5dF54A9",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "EBASE": {
        "symbol": "EBASE",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x86FADb80d8D2cff3C3680819E4da99C10232Ba0F",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "ENJ": {
        "symbol": "ENJ",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "FAME": {
        "symbol": "FAME",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x06f65b8CfCb13a9FE37d836fE9708dA38Ecb29B2",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "FOAM": {
        "symbol": "FOAM",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x4946Fcea7C692606e8908002e55A582af44AC121",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "FUN": {
        "symbol": "FUN",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x419D0d8BdD9aF5e606Ae2232ed285Aff190E711b",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "FXC": {
        "symbol": "FXC",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x4a57E687b9126435a9B19E4A802113e266AdeBde",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "GEN": {
        "symbol": "GEN",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x543Ff227F64Aa17eA132Bf9886cAb5DB55DCAddf",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "GNO": {
        "symbol": "GNO",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x6810e776880C02933D47DB1b9fc05908e5386b96",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "GRID": {
        "symbol": "GRID",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x12B19D3e2ccc14Da04FAe33e63652ce469b3F2FD",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "GST2": {
        "symbol": "GST2",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x0000000000b3F879cb30FE243b4Dfee438691c04",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "HEDG": {
        "symbol": "HEDG",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xF1290473E210b2108A85237fbCd7b6eb42Cc654F",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "HOT": {
        "symbol": "HOT",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x6c6EE5e31d828De241282B9606C8e98Ea48526E2",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "HUSD": {
        "symbol": "HUSD",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xdF574c24545E5FfEcb9a659c229253D4111d87e1",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "iDAI": {
        "symbol": "iDAI",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x493C57C4763932315A328269E1ADaD09653B9081",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "iSAI": {
        "symbol": "iSAI",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x14094949152EDDBFcd073717200DA82fEd8dC960",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "IOTX": {
        "symbol": "IOTX",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x6fB3e0A217407EFFf7Ca062D46c26E5d60a14d69",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "KEY": {
        "symbol": "KEY",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x4Cd988AfBad37289BAAf53C13e98E2BD46aAEa8c",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "KNC": {
        "symbol": "KNC",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xdd974D5C2e2928deA5F71b9825b8b646686BD200",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "LINK": {
        "symbol": "LINK",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x514910771AF9Ca656af840dff83E8264EcF986CA",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "LRC": {
        "symbol": "LRC",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "LEND": {
        "symbol": "LEND",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x80fB784B7eD66730e8b1DBd9820aFD29931aab03",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "LOOM": {
        "symbol": "LOOM",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xA4e8C3Ec456107eA67d3075bF9e3DF3A75823DB0",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "LPT": {
        "symbol": "LPT",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x58b6A8A3302369DAEc383334672404Ee733aB239",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "LQD": {
        "symbol": "LQD",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xD29F0b5b3F50b07Fe9a9511F7d86F4f4bAc3f8c4",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "MANA": {
        "symbol": "MANA",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x0F5D2fB29fb7d3CFeE444a200298f468908cC942",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "MATIC": {
        "symbol": "MATIC",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "MBC": {
        "symbol": "MBC",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x8888889213DD4dA823EbDD1e235b09590633C150",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "MCX": {
        "symbol": "MCX",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xd15eCDCF5Ea68e3995b2D0527A0aE0a3258302F8",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "MET": {
        "symbol": "MET",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xa3d58c4E56fedCae3a7c43A725aeE9A71F0ece4e",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "MGN": {
        "symbol": "MGN",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x80f222a749a2e18Eb7f676D371F19ad7EFEEe3b7",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "MKR": {
        "symbol": "MKR",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "MLN": {
        "symbol": "MLN",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xec67005c4E498Ec7f55E092bd1d35cbC47C91892",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "MOD": {
        "symbol": "MOD",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x957c30aB0426e0C93CD8241E2c60392d08c6aC8e",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "mUSD": {
        "symbol": "mUSD",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xe2f2a5C287993345a840Db3B0845fbC70f5935a5",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "NEXO": {
        "symbol": "NEXO",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xB62132e35a6c13ee1EE0f84dC5d40bad8d815206",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "NMR": {
        "symbol": "NMR",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "OCEAN": {
        "symbol": "OCEAN",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x7AFeBBB46fDb47ed17b22ed075Cde2447694fB9e",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "OXT": {
        "symbol": "OXT",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x4575f41308EC1483f3d399aa9a2826d74Da13Deb",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "PAN": {
        "symbol": "PAN",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xD56daC73A4d6766464b38ec6D91eB45Ce7457c44",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "PAX": {
        "symbol": "PAX",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x8E870D67F660D95d5be530380D0eC0bd388289E1",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "PAXG": {
        "symbol": "PAXG",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x45804880De22913dAFE09f4980848ECE6EcbAf78",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "PNK": {
        "symbol": "PNK",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x93ED3FBe21207Ec2E8f2d3c3de6e058Cb73Bc04d",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "POA20": {
        "symbol": "POA20",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x6758B7d441a9739b98552B373703d8d3d14f9e62",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "QCH": {
        "symbol": "QCH",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x687BfC3E73f6af55F0CccA8450114D107E781a0e",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "QNT": {
        "symbol": "QNT",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x4a220E6096B25EADb88358cb44068A3248254675",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "QSP": {
        "symbol": "QSP",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x99ea4dB9EE77ACD40B119BD1dC4E33e1C070b80d",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "RCN": {
        "symbol": "RCN",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xF970b8E36e23F7fC3FD752EeA86f8Be8D83375A6",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "RDN": {
        "symbol": "RDN",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x255Aa6DF07540Cb5d3d297f0D0D4D84cb52bc8e6",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "REN": {
        "symbol": "REN",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x408e41876cCCDC0F92210600ef50372656052a38",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "renBCH": {
        "symbol": "renBCH",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x459086F2376525BdCebA5bDDA135e4E9d3FeF5bf",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "renBTC": {
        "symbol": "renBTC",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "renZEC": {
        "symbol": "renZEC",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x1C5db575E2Ff833E46a2E9864C22F4B22E0B37C2",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "REP": {
        "symbol": "REP",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x1985365e9f78359a9B6AD760e32412f4a445E862",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "REPv2": {
        "symbol": "REPv2",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x221657776846890989a759BA2973e427DfF5C9bB",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "RING": {
        "symbol": "RING",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x9469D013805bFfB7D3DEBe5E7839237e535ec483",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "RLC": {
        "symbol": "RLC",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x607F4C5BB672230e8672085532f7e901544a7375",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "RPL": {
        "symbol": "RPL",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xB4EFd85c19999D84251304bDA99E90B92300Bd93",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "SALT": {
        "symbol": "SALT",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x4156D3342D5c385a87D264F90653733592000581",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "SAN": {
        "symbol": "SAN",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x7C5A0CE9267ED19B22F8cae653F198e3E8daf098",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "sETH": {
        "symbol": "sETH",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x5e74C9036fb86BD7eCdcb084a0673EFc32eA31cb",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "SHUF": {
        "symbol": "SHUF",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x3A9FfF453d50D4Ac52A6890647b823379ba36B9E",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "SNT": {
        "symbol": "SNT",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x744d70FDBE2Ba4CF95131626614a1763DF805B9E",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "SNX": {
        "symbol": "SNX",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "SOCKS": {
        "symbol": "SOCKS",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x23B608675a2B2fB1890d3ABBd85c5775c51691d5",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "SPANK": {
        "symbol": "SPANK",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x42d6622deCe394b54999Fbd73D108123806f6a18",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "STAKE": {
        "symbol": "STAKE",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x0Ae055097C6d159879521C384F1D2123D1f195e6",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "STORJ": {
        "symbol": "STORJ",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xB64ef51C888972c908CFacf59B47C1AfBC0Ab8aC",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "sUSD": {
        "symbol": "sUSD",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x57Ab1ec28D129707052df4dF418D58a2D46d5f51",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "sXAU": {
        "symbol": "sXAU",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x261EfCdD24CeA98652B9700800a13DfBca4103fF",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "SXP": {
        "symbol": "SXP",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x8CE9137d39326AD0cD6491fb5CC0CbA0e089b6A9",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "TAUD": {
        "symbol": "TAUD",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x00006100F7090010005F1bd7aE6122c3C2CF0090",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "TCAD": {
        "symbol": "TCAD",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x00000100F2A2bd000715001920eB70D229700085",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "TGBP": {
        "symbol": "TGBP",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x00000000441378008EA67F4284A57932B1c000a5",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "THKD": {
        "symbol": "THKD",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x0000852600CEB001E08e00bC008be620d60031F2",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "TKN": {
        "symbol": "TKN",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xaAAf91D9b90dF800Df4F55c205fd6989c977E73a",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "TRB": {
        "symbol": "TRB",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x0Ba45A8b5d5575935B8158a88C631E9F9C95a2e5",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "TRST": {
        "symbol": "TRST",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xCb94be6f13A1182E4A4B6140cb7bf2025d28e41B",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "TRYB": {
        "symbol": "TRYB",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x2C537E5624e4af88A7ae4060C022609376C8D0EB",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "TUSD": {
        "symbol": "TUSD",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x0000000000085d4780B73119b644AE5ecd22b376",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "UBT": {
        "symbol": "UBT",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x8400D94A5cb0fa0D041a3788e395285d61c9ee5e",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "UMA": {
        "symbol": "UMA",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "USDC": {
        "symbol": "USDC",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "USDS": {
        "symbol": "USDS",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xA4Bdb11dc0a2bEC88d24A3aa1E6Bb17201112eBe",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "USDT": {
        "symbol": "USDT",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "USDx": {
        "symbol": "USDx",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xeb269732ab75A6fD61Ea60b06fE994cD32a83549",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "USD++": {
        "symbol": "USD++",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x9A48BD0EC040ea4f1D3147C025cd4076A2e71e3e",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "VERI": {
        "symbol": "VERI",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x8f3470A7388c05eE4e7AF3d01D8C722b0FF52374",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "WBTC": {
        "symbol": "WBTC",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "WCK": {
        "symbol": "WCK",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x09fE5f0236F0Ea5D930197DCE254d77B04128075",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "XCHF": {
        "symbol": "XCHF",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xB4272071eCAdd69d933AdcD19cA99fe80664fc08",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "XIO": {
        "symbol": "XIO",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x0f7F961648aE6Db43C75663aC7E5414Eb79b5704",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "MTA": {
        "symbol": "MTA",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xa3BeD4E1c75D00fa6f4E5E6922DB7261B5E9AcD2",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "SRM": {
        "symbol": "SRM",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x476c5E26a75bd202a9683ffD34359C0CC15be0fF",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "ZRX": {
        "symbol": "ZRX",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xE41d2489571d322189246DaFA5ebDe1F4699F498",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "CRV": {
        "symbol": "CRV",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xD533a949740bb3306d119CC777fa900bA034cd52",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "UNI": {
        "symbol": "UNI",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    }
}


