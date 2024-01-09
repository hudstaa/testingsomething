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
export const known_pairs: Record<string, { swap: currencySwapInfo, emoji: string, logo?: string, symbol: string }> = {
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
    "weth": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
        "symbol": "WETH",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "0xbtc": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xB6eD7644C69416d67B522e20bC294A9a9B405B31/logo.png",
        "symbol": "0xBTC",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xB6eD7644C69416d67B522e20bC294A9a9B405B31",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "adai": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xfC1E690f61EFd961294b3e1Ce3313fBD8aa4f85d/logo.png",
        "symbol": "aDAI",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xfC1E690f61EFd961294b3e1Ce3313fBD8aa4f85d",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "amn": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x737F98AC8cA59f2C68aD658E3C3d8C8963E40a4c/logo.png",
        "symbol": "AMN",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x737F98AC8cA59f2C68aD658E3C3d8C8963E40a4c",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "ampl": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xD46bA6D942050d489DBd938a2C909A5d5039A161/logo.png",
        "symbol": "AMPL",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xD46bA6D942050d489DBd938a2C909A5d5039A161",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "anj": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xcD62b1C403fa761BAadFC74C525ce2B51780b184/logo.png",
        "symbol": "ANJ",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xcD62b1C403fa761BAadFC74C525ce2B51780b184",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "ant": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x960b236A07cf122663c4303350609A66A7B288C0/logo.png",
        "symbol": "ANT",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x960b236A07cf122663c4303350609A66A7B288C0",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "ast": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x27054b13b1B798B345b591a4d22e6562d47eA75a/logo.png",
        "symbol": "AST",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x27054b13b1B798B345b591a4d22e6562d47eA75a",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "band": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xBA11D00c5f74255f56a5E366F4F77f5A186d7f55/logo.png",
        "symbol": "BAND",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xBA11D00c5f74255f56a5E366F4F77f5A186d7f55",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "bat": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0D8775F648430679A709E98d2b0Cb6250d2887EF/logo.png",
        "symbol": "BAT",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x0D8775F648430679A709E98d2b0Cb6250d2887EF",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "bal": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xba100000625a3754423978a60c9317c58a424e3D/logo.png",
        "symbol": "BAL",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xba100000625a3754423978a60c9317c58a424e3D",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "blt": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x107c4504cd79C5d2696Ea0030a8dD4e92601B82e/logo.png",
        "symbol": "BLT",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x107c4504cd79C5d2696Ea0030a8dD4e92601B82e",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "bnt": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C/logo.png",
        "symbol": "BNT",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "btc++": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0327112423F3A68efdF1fcF402F6c5CB9f7C33fd/logo.png",
        "symbol": "BTC++",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x0327112423F3A68efdF1fcF402F6c5CB9f7C33fd",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "bzrx": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x56d811088235F11C8920698a204A5010a788f4b3/logo.png",
        "symbol": "BZRX",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x56d811088235F11C8920698a204A5010a788f4b3",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "celr": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x4F9254C83EB525f9FCf346490bbb3ed28a81C667/logo.png",
        "symbol": "CELR",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x4F9254C83EB525f9FCf346490bbb3ed28a81C667",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "csai": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xF5DCe57282A584D2746FaF1593d3121Fcac444dC/logo.png",
        "symbol": "cSAI",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xF5DCe57282A584D2746FaF1593d3121Fcac444dC",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "cdai": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643/logo.png",
        "symbol": "cDAI",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "cusdc": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x39AA39c021dfbaE8faC545936693aC917d5E7563/logo.png",
        "symbol": "cUSDC",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x39AA39c021dfbaE8faC545936693aC917d5E7563",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "cel": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xaaAEBE6Fe48E54f431b0C390CfaF0b017d09D42d/logo.png",
        "symbol": "CEL",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xaaAEBE6Fe48E54f431b0C390CfaF0b017d09D42d",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "chai": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x06AF07097C9Eeb7fD685c692751D5C66dB49c215/logo.png",
        "symbol": "CHAI",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x06AF07097C9Eeb7fD685c692751D5C66dB49c215",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "comp": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xc00e94Cb662C3520282E6f5717214004A7f26888/logo.png",
        "symbol": "COMP",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xc00e94Cb662C3520282E6f5717214004A7f26888",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "sai": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359/logo.png",
        "symbol": "SAI",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "dai": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
        "symbol": "DAI",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "data": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0Cf0Ee63788A0849fE5297F3407f701E122cC023/logo.png",
        "symbol": "DATA",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x0Cf0Ee63788A0849fE5297F3407f701E122cC023",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "dgd": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xE0B7927c4aF23765Cb51314A0E0521A9645F0E2A/logo.png",
        "symbol": "DGD",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xE0B7927c4aF23765Cb51314A0E0521A9645F0E2A",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "dgx": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x4f3AfEC4E5a3F2A6a1A411DEF7D7dFe50eE057bF/logo.png",
        "symbol": "DGX",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x4f3AfEC4E5a3F2A6a1A411DEF7D7dFe50eE057bF",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "dip": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xc719d010B63E5bbF2C0551872CD5316ED26AcD83/logo.png",
        "symbol": "DIP",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xc719d010B63E5bbF2C0551872CD5316ED26AcD83",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "donut": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC0F9bD5Fa5698B6505F643900FFA515Ea5dF54A9/logo.png",
        "symbol": "DONUT",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xC0F9bD5Fa5698B6505F643900FFA515Ea5dF54A9",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "ebase": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x86FADb80d8D2cff3C3680819E4da99C10232Ba0F/logo.png",
        "symbol": "EBASE",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x86FADb80d8D2cff3C3680819E4da99C10232Ba0F",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "enj": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c/logo.png",
        "symbol": "ENJ",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "fame": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x06f65b8CfCb13a9FE37d836fE9708dA38Ecb29B2/logo.png",
        "symbol": "FAME",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x06f65b8CfCb13a9FE37d836fE9708dA38Ecb29B2",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "foam": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x4946Fcea7C692606e8908002e55A582af44AC121/logo.png",
        "symbol": "FOAM",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x4946Fcea7C692606e8908002e55A582af44AC121",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "fun": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x419D0d8BdD9aF5e606Ae2232ed285Aff190E711b/logo.png",
        "symbol": "FUN",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x419D0d8BdD9aF5e606Ae2232ed285Aff190E711b",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "fxc": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x4a57E687b9126435a9B19E4A802113e266AdeBde/logo.png",
        "symbol": "FXC",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x4a57E687b9126435a9B19E4A802113e266AdeBde",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "gen": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x543Ff227F64Aa17eA132Bf9886cAb5DB55DCAddf/logo.png",
        "symbol": "GEN",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x543Ff227F64Aa17eA132Bf9886cAb5DB55DCAddf",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "gno": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6810e776880C02933D47DB1b9fc05908e5386b96/logo.png",
        "symbol": "GNO",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x6810e776880C02933D47DB1b9fc05908e5386b96",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "grid": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x12B19D3e2ccc14Da04FAe33e63652ce469b3F2FD/logo.png",
        "symbol": "GRID",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x12B19D3e2ccc14Da04FAe33e63652ce469b3F2FD",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "gst2": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0000000000b3F879cb30FE243b4Dfee438691c04/logo.png",
        "symbol": "GST2",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x0000000000b3F879cb30FE243b4Dfee438691c04",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "hedg": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xF1290473E210b2108A85237fbCd7b6eb42Cc654F/logo.png",
        "symbol": "HEDG",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xF1290473E210b2108A85237fbCd7b6eb42Cc654F",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "hot": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6c6EE5e31d828De241282B9606C8e98Ea48526E2/logo.png",
        "symbol": "HOT",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x6c6EE5e31d828De241282B9606C8e98Ea48526E2",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "husd": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdF574c24545E5FfEcb9a659c229253D4111d87e1/logo.png",
        "symbol": "HUSD",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xdF574c24545E5FfEcb9a659c229253D4111d87e1",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "idai": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x493C57C4763932315A328269E1ADaD09653B9081/logo.png",
        "symbol": "iDAI",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x493C57C4763932315A328269E1ADaD09653B9081",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "isai": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x14094949152EDDBFcd073717200DA82fEd8dC960/logo.png",
        "symbol": "iSAI",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x14094949152EDDBFcd073717200DA82fEd8dC960",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "iotx": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6fB3e0A217407EFFf7Ca062D46c26E5d60a14d69/logo.png",
        "symbol": "IOTX",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x6fB3e0A217407EFFf7Ca062D46c26E5d60a14d69",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "key": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x4Cd988AfBad37289BAAf53C13e98E2BD46aAEa8c/logo.png",
        "symbol": "KEY",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x4Cd988AfBad37289BAAf53C13e98E2BD46aAEa8c",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "knc": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdd974D5C2e2928deA5F71b9825b8b646686BD200/logo.png",
        "symbol": "KNC",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xdd974D5C2e2928deA5F71b9825b8b646686BD200",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "link": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png",
        "symbol": "LINK",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x514910771AF9Ca656af840dff83E8264EcF986CA",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "lrc": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD/logo.png",
        "symbol": "LRC",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "lend": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x80fB784B7eD66730e8b1DBd9820aFD29931aab03/logo.png",
        "symbol": "LEND",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x80fB784B7eD66730e8b1DBd9820aFD29931aab03",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "loom": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA4e8C3Ec456107eA67d3075bF9e3DF3A75823DB0/logo.png",
        "symbol": "LOOM",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xA4e8C3Ec456107eA67d3075bF9e3DF3A75823DB0",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "lpt": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x58b6A8A3302369DAEc383334672404Ee733aB239/logo.png",
        "symbol": "LPT",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x58b6A8A3302369DAEc383334672404Ee733aB239",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "lqd": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xD29F0b5b3F50b07Fe9a9511F7d86F4f4bAc3f8c4/logo.png",
        "symbol": "LQD",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xD29F0b5b3F50b07Fe9a9511F7d86F4f4bAc3f8c4",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "mana": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0F5D2fB29fb7d3CFeE444a200298f468908cC942/logo.png",
        "symbol": "MANA",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x0F5D2fB29fb7d3CFeE444a200298f468908cC942",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "matic": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0/logo.png",
        "symbol": "MATIC",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "mbc": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x8888889213DD4dA823EbDD1e235b09590633C150/logo.png",
        "symbol": "MBC",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x8888889213DD4dA823EbDD1e235b09590633C150",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "mcx": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xd15eCDCF5Ea68e3995b2D0527A0aE0a3258302F8/logo.png",
        "symbol": "MCX",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xd15eCDCF5Ea68e3995b2D0527A0aE0a3258302F8",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "met": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xa3d58c4E56fedCae3a7c43A725aeE9A71F0ece4e/logo.png",
        "symbol": "MET",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xa3d58c4E56fedCae3a7c43A725aeE9A71F0ece4e",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "mgn": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x80f222a749a2e18Eb7f676D371F19ad7EFEEe3b7/logo.png",
        "symbol": "MGN",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x80f222a749a2e18Eb7f676D371F19ad7EFEEe3b7",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "mkr": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2/logo.png",
        "symbol": "MKR",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "mln": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xec67005c4E498Ec7f55E092bd1d35cbC47C91892/logo.png",
        "symbol": "MLN",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xec67005c4E498Ec7f55E092bd1d35cbC47C91892",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "mod": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x957c30aB0426e0C93CD8241E2c60392d08c6aC8e/logo.png",
        "symbol": "MOD",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x957c30aB0426e0C93CD8241E2c60392d08c6aC8e",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "musd": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xe2f2a5C287993345a840Db3B0845fbC70f5935a5/logo.png",
        "symbol": "mUSD",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xe2f2a5C287993345a840Db3B0845fbC70f5935a5",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "nexo": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xB62132e35a6c13ee1EE0f84dC5d40bad8d815206/logo.png",
        "symbol": "NEXO",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xB62132e35a6c13ee1EE0f84dC5d40bad8d815206",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "nmr": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671/logo.png",
        "symbol": "NMR",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "ocean": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7AFeBBB46fDb47ed17b22ed075Cde2447694fB9e/logo.png",
        "symbol": "OCEAN",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x7AFeBBB46fDb47ed17b22ed075Cde2447694fB9e",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "oxt": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x4575f41308EC1483f3d399aa9a2826d74Da13Deb/logo.png",
        "symbol": "OXT",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x4575f41308EC1483f3d399aa9a2826d74Da13Deb",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "pan": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xD56daC73A4d6766464b38ec6D91eB45Ce7457c44/logo.png",
        "symbol": "PAN",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xD56daC73A4d6766464b38ec6D91eB45Ce7457c44",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "pax": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x8E870D67F660D95d5be530380D0eC0bd388289E1/logo.png",
        "symbol": "PAX",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x8E870D67F660D95d5be530380D0eC0bd388289E1",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "paxg": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x45804880De22913dAFE09f4980848ECE6EcbAf78/logo.png",
        "symbol": "PAXG",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x45804880De22913dAFE09f4980848ECE6EcbAf78",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "pnk": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x93ED3FBe21207Ec2E8f2d3c3de6e058Cb73Bc04d/logo.png",
        "symbol": "PNK",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x93ED3FBe21207Ec2E8f2d3c3de6e058Cb73Bc04d",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "poa20": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6758B7d441a9739b98552B373703d8d3d14f9e62/logo.png",
        "symbol": "POA20",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x6758B7d441a9739b98552B373703d8d3d14f9e62",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "qch": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x687BfC3E73f6af55F0CccA8450114D107E781a0e/logo.png",
        "symbol": "QCH",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x687BfC3E73f6af55F0CccA8450114D107E781a0e",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "qnt": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x4a220E6096B25EADb88358cb44068A3248254675/logo.png",
        "symbol": "QNT",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x4a220E6096B25EADb88358cb44068A3248254675",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "qsp": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x99ea4dB9EE77ACD40B119BD1dC4E33e1C070b80d/logo.png",
        "symbol": "QSP",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x99ea4dB9EE77ACD40B119BD1dC4E33e1C070b80d",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "rcn": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xF970b8E36e23F7fC3FD752EeA86f8Be8D83375A6/logo.png",
        "symbol": "RCN",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xF970b8E36e23F7fC3FD752EeA86f8Be8D83375A6",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "rdn": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x255Aa6DF07540Cb5d3d297f0D0D4D84cb52bc8e6/logo.png",
        "symbol": "RDN",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x255Aa6DF07540Cb5d3d297f0D0D4D84cb52bc8e6",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "ren": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x408e41876cCCDC0F92210600ef50372656052a38/logo.png",
        "symbol": "REN",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x408e41876cCCDC0F92210600ef50372656052a38",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "renbch": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x459086F2376525BdCebA5bDDA135e4E9d3FeF5bf/logo.png",
        "symbol": "renBCH",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x459086F2376525BdCebA5bDDA135e4E9d3FeF5bf",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "renbtc": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D/logo.png",
        "symbol": "renBTC",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "renzec": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1C5db575E2Ff833E46a2E9864C22F4B22E0B37C2/logo.png",
        "symbol": "renZEC",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x1C5db575E2Ff833E46a2E9864C22F4B22E0B37C2",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "rep": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1985365e9f78359a9B6AD760e32412f4a445E862/logo.png",
        "symbol": "REP",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x1985365e9f78359a9B6AD760e32412f4a445E862",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "repv2": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x221657776846890989a759BA2973e427DfF5C9bB/logo.png",
        "symbol": "REPv2",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x221657776846890989a759BA2973e427DfF5C9bB",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "ring": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9469D013805bFfB7D3DEBe5E7839237e535ec483/logo.png",
        "symbol": "RING",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x9469D013805bFfB7D3DEBe5E7839237e535ec483",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "rlc": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x607F4C5BB672230e8672085532f7e901544a7375/logo.png",
        "symbol": "RLC",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x607F4C5BB672230e8672085532f7e901544a7375",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "rpl": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xB4EFd85c19999D84251304bDA99E90B92300Bd93/logo.png",
        "symbol": "RPL",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xB4EFd85c19999D84251304bDA99E90B92300Bd93",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "salt": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x4156D3342D5c385a87D264F90653733592000581/logo.png",
        "symbol": "SALT",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x4156D3342D5c385a87D264F90653733592000581",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "san": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7C5A0CE9267ED19B22F8cae653F198e3E8daf098/logo.png",
        "symbol": "SAN",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x7C5A0CE9267ED19B22F8cae653F198e3E8daf098",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "seth": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x5e74C9036fb86BD7eCdcb084a0673EFc32eA31cb/logo.png",
        "symbol": "sETH",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x5e74C9036fb86BD7eCdcb084a0673EFc32eA31cb",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "shuf": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x3A9FfF453d50D4Ac52A6890647b823379ba36B9E/logo.png",
        "symbol": "SHUF",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x3A9FfF453d50D4Ac52A6890647b823379ba36B9E",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "snt": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x744d70FDBE2Ba4CF95131626614a1763DF805B9E/logo.png",
        "symbol": "SNT",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x744d70FDBE2Ba4CF95131626614a1763DF805B9E",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "snx": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F/logo.png",
        "symbol": "SNX",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "socks": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x23B608675a2B2fB1890d3ABBd85c5775c51691d5/logo.png",
        "symbol": "SOCKS",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x23B608675a2B2fB1890d3ABBd85c5775c51691d5",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "spank": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x42d6622deCe394b54999Fbd73D108123806f6a18/logo.png",
        "symbol": "SPANK",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x42d6622deCe394b54999Fbd73D108123806f6a18",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "stake": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0Ae055097C6d159879521C384F1D2123D1f195e6/logo.png",
        "symbol": "STAKE",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x0Ae055097C6d159879521C384F1D2123D1f195e6",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "storj": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xB64ef51C888972c908CFacf59B47C1AfBC0Ab8aC/logo.png",
        "symbol": "STORJ",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xB64ef51C888972c908CFacf59B47C1AfBC0Ab8aC",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "susd": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x57Ab1ec28D129707052df4dF418D58a2D46d5f51/logo.png",
        "symbol": "sUSD",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x57Ab1ec28D129707052df4dF418D58a2D46d5f51",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "sxau": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x261EfCdD24CeA98652B9700800a13DfBca4103fF/logo.png",
        "symbol": "sXAU",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x261EfCdD24CeA98652B9700800a13DfBca4103fF",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "sxp": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x8CE9137d39326AD0cD6491fb5CC0CbA0e089b6A9/logo.png",
        "symbol": "SXP",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x8CE9137d39326AD0cD6491fb5CC0CbA0e089b6A9",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "taud": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x00006100F7090010005F1bd7aE6122c3C2CF0090/logo.png",
        "symbol": "TAUD",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x00006100F7090010005F1bd7aE6122c3C2CF0090",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "tcad": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x00000100F2A2bd000715001920eB70D229700085/logo.png",
        "symbol": "TCAD",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x00000100F2A2bd000715001920eB70D229700085",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "tgbp": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x00000000441378008EA67F4284A57932B1c000a5/logo.png",
        "symbol": "TGBP",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x00000000441378008EA67F4284A57932B1c000a5",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "thkd": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0000852600CEB001E08e00bC008be620d60031F2/logo.png",
        "symbol": "THKD",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x0000852600CEB001E08e00bC008be620d60031F2",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "tkn": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xaAAf91D9b90dF800Df4F55c205fd6989c977E73a/logo.png",
        "symbol": "TKN",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xaAAf91D9b90dF800Df4F55c205fd6989c977E73a",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "trb": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0Ba45A8b5d5575935B8158a88C631E9F9C95a2e5/logo.png",
        "symbol": "TRB",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x0Ba45A8b5d5575935B8158a88C631E9F9C95a2e5",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "trst": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xCb94be6f13A1182E4A4B6140cb7bf2025d28e41B/logo.png",
        "symbol": "TRST",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xCb94be6f13A1182E4A4B6140cb7bf2025d28e41B",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "tryb": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2C537E5624e4af88A7ae4060C022609376C8D0EB/logo.png",
        "symbol": "TRYB",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x2C537E5624e4af88A7ae4060C022609376C8D0EB",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "tusd": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0000000000085d4780B73119b644AE5ecd22b376/logo.png",
        "symbol": "TUSD",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x0000000000085d4780B73119b644AE5ecd22b376",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "ubt": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x8400D94A5cb0fa0D041a3788e395285d61c9ee5e/logo.png",
        "symbol": "UBT",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x8400D94A5cb0fa0D041a3788e395285d61c9ee5e",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "uma": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828/logo.png",
        "symbol": "UMA",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "usdc": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
        "symbol": "USDC",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "usds": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA4Bdb11dc0a2bEC88d24A3aa1E6Bb17201112eBe/logo.png",
        "symbol": "USDS",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xA4Bdb11dc0a2bEC88d24A3aa1E6Bb17201112eBe",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "usdt": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
        "symbol": "USDT",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "usdx": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xeb269732ab75A6fD61Ea60b06fE994cD32a83549/logo.png",
        "symbol": "USDx",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xeb269732ab75A6fD61Ea60b06fE994cD32a83549",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "usd++": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9A48BD0EC040ea4f1D3147C025cd4076A2e71e3e/logo.png",
        "symbol": "USD++",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x9A48BD0EC040ea4f1D3147C025cd4076A2e71e3e",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "veri": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x8f3470A7388c05eE4e7AF3d01D8C722b0FF52374/logo.png",
        "symbol": "VERI",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x8f3470A7388c05eE4e7AF3d01D8C722b0FF52374",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "btc": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png",
        "symbol": "BTCUSD",
        "emoji": "₿",
        "swap": {
            "outputCurrency": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "wbtc": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png",
        "symbol": "BTCUSD",
        "emoji": "₿",
        "swap": {
            "outputCurrency": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "wck": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x09fE5f0236F0Ea5D930197DCE254d77B04128075/logo.png",
        "symbol": "WCK",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x09fE5f0236F0Ea5D930197DCE254d77B04128075",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "xchf": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xB4272071eCAdd69d933AdcD19cA99fe80664fc08/logo.png",
        "symbol": "XCHF",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xB4272071eCAdd69d933AdcD19cA99fe80664fc08",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "xio": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0f7F961648aE6Db43C75663aC7E5414Eb79b5704/logo.png",
        "symbol": "XIO",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x0f7F961648aE6Db43C75663aC7E5414Eb79b5704",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "mta": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xa3BeD4E1c75D00fa6f4E5E6922DB7261B5E9AcD2/logo.png",
        "symbol": "MTA",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xa3BeD4E1c75D00fa6f4E5E6922DB7261B5E9AcD2",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "srm": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x476c5E26a75bd202a9683ffD34359C0CC15be0fF/logo.png",
        "symbol": "SRM",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x476c5E26a75bd202a9683ffD34359C0CC15be0fF",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "zrx": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xE41d2489571d322189246DaFA5ebDe1F4699F498/logo.png",
        "symbol": "ZRX",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xE41d2489571d322189246DaFA5ebDe1F4699F498",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "crv": {
        "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xD533a949740bb3306d119CC777fa900bA034cd52/logo.png",
        "symbol": "CRVUSD",
        "emoji": "",
        "swap": {
            "outputCurrency": "0xD533a949740bb3306d119CC777fa900bA034cd52",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    },
    "uni": {
        "logo": "ipfs://QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg",
        "symbol": "UNIUSD",
        "emoji": "",
        "swap": {
            "outputCurrency": "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
            "chain": "mainnet",
            "inputCurrency": "ETH"
        }
    }

}


