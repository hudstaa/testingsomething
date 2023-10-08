import type { Address } from 'viem'
import {
    useContractRead,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from 'wagmi'
import { useCallback, useState } from 'react'
import { tribePassesContract } from '../lib/constants'

export default function usePassSupply(subject: Address) {
    const [error, setError] = useState<any>();
    const [status, setStatus] = useState<any>();
    const [transactionHash, setTransactionHash] = useState<any>();
    const onError = useCallback((e: unknown) => {
        setError(e);
    }, [])


    const { data: balance } = useContractRead({
        ...tribePassesContract,
        functionName: 'totalSupply',
        args: [subject],
        watch: true
    })

    return balance
}
