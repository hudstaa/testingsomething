import type { Address } from 'viem'
import {
    useContractRead,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from 'wagmi'
import { useCallback, useState } from 'react'
import { tribePassesContract } from '../lib/constants'

export default function usePassBalance(wallet: Address, subjects: Address[]) {

    const { data: balance } = useContractRead({
        ...tribePassesContract,
        functionName: 'ownerOf',
        args: [Array(subjects.length).fill(wallet), subjects],
        watch: true
    })

    return balance
}
