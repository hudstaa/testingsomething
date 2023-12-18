import { Capacitor } from "@capacitor/core"
import { getAuth, indexedDBLocalPersistence, initializeAuth } from "firebase/auth"
import { formatEther } from "viem"
import { app } from "../App"
import * as linkifyjs from 'linkifyjs';
import { IonRouterLink } from "@ionic/react";

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
            return known_pairs[this.toString().slice(1).toLowerCase()]?.swap;
      }
  });
  
  /**
   * @type {import('linkifyjs').Plugin}
   */
  function cashtag(_ref:any) {
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
  export const known_pairs:Record<string,{swap:string,emoji:string}>={
    nola:{
        emoji:'🐈‍⬛',
        swap:'https://swap.tribe.computer/#/?outputCurrency=0xF8388c2B6Edf00E2E27eEF5200B1beFB24cE141d&chain=arbitrum&inputCurrency=ETH'
    },
    tribe:{
        emoji:'🏕️',
        swap:'https://swap.tribe.computer'
    },
    pepe:{emoji:'🐸',swap:'https://swap.tribe.computer/#/?outputCurrency=0x6982508145454Ce325dDbE47a25d4ec3d2311933&chain=ethereum&inputCurrency=ETH'},
    wif:{emoji:'👒',swap:'https://swap.tribe.computer/#/?outputCurrency=0x6982508145454Ce325dDbE47a25d4ec3d2311933&chain=ethereum&inputCurrency=ETH'},
    bitcoin:{emoji:'🦔',swap:'https://swap.tribe.computer/#/?outputCurrency=0x6982508145454Ce325dDbE47a25d4ec3d2311933&chain=ethereum&inputCurrency=ETH'}
}
