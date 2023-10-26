import type { Address } from 'viem'
import {
    useContractRead
} from 'wagmi'
import { tribePassesContract } from '../lib/constants'

export default function usePassBalance(wallet: Address, subject: Address) {

    const { data: balance } = useContractRead({
        ...tribePassesContract,
        functionName: 'balanceOf',
        args: [wallet, subject],
        watch: true,
        onError: () => { }
    })
    return balance as bigint | undefined
}
