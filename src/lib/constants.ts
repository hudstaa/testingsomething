import { Address } from "viem";
import tribePassAbi from "./abi/tribePassAbi";
import friendTechAbi from "./abi/friendTechAbi";


export const TRIBE_PASS_CONTRACT: Address = '0xcb74873cb302b99f128ceadabf737625c22d0149'
export const FRIEND_TECH_CONTRACT: Address = '0xCF205808Ed36593aa40a44F10c7f7C2F67d4A4d4'
export const tribePassesContract = {
    address: TRIBE_PASS_CONTRACT,
    abi: tribePassAbi,
}
export const friendTechCcontract = {
    address: FRIEND_TECH_CONTRACT,
    abi: friendTechAbi,
}
