import type { Address } from 'viem'
import {
    useContractRead,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from 'wagmi'
import { useCallback, useState } from 'react'
import { tribePassesContract } from '../lib/constants'

export default function useBoosters(channel: Address|string) {

    const { data: balance } = useContractRead({
        ...tribePassesContract,
        functionName: 'ownerOf',
        args: [channel],
        watch: true
    })

    return balance
}
