import { Address } from "viem";
import tribePassAbi from "./abi/tribePassAbi";


export const TRIBE_PASS_CONTRACT: Address = '0xFEfb18f20C7548b72FDdBe4b70d07ee2ab63F60E'

export const tribePassesContract = {
    address: TRIBE_PASS_CONTRACT,
    abi: tribePassAbi,
}
