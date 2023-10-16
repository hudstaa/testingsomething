import type { Address } from 'viem'
import {
    useContractRead,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from 'wagmi'
import { useCallback, useState } from 'react'
import { tribePassesContract } from '../lib/constants'

export default function usePassBalance(wallet: Address, subject: Address) {

    const { data: balance } = useContractRead({
        ...tribePassesContract,
        functionName: 'balanceOf',
        args: [wallet, subject],
        watch: true
    })

    return balance as bigint | undefined
}
