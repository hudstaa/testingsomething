import { Address } from "viem";
import tribePassAbi from "./abi/tribePassAbi";


export const TRIBE_PASS_CONTRACT: Address = '0xcb74873cb302b99f128ceadabf737625c22d0149'

export const tribePassesContract = {
    address: TRIBE_PASS_CONTRACT,
    abi: tribePassAbi,
}
