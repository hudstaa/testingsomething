import type { Address } from 'viem'
import {
    useContractRead,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from 'wagmi'
import { useCallback, useState } from 'react'
import { tribePassesContract } from '../lib/constants'
import { baseGoerli } from 'viem/chains';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';

export default function useBuyPass(subject: Address, shares: bigint) {

    const [error, setError] = useState<any>();
    const [status, setStatus] = useState<any>();
    const [transactionHash, setTransactionHash] = useState<any>();
    const onError = useCallback((e: unknown) => {
        setError(e);
        setStatus('error');
    }, [])

    const { wallet } = usePrivyWagmi()
    const { data: buyPrice } = useContractRead({
        ...tribePassesContract,
        account: wallet?.address as Address,
        chainId: baseGoerli.id,
        functionName: 'getBuyPriceAfterFee',
        args: [subject, shares],
        watch: true
    })

    const { config } = usePrepareContractWrite({
        ...tribePassesContract,
        functionName: 'buyBoosts',
        chainId: baseGoerli.id,
        args: [subject, shares, '0xCc879Ab4DE63FC7Be6aAca522285D6F5d816278e'],
        value: buyPrice as bigint
    })
    const { write: buyPass, data: writeData, error: testError, } = useContractWrite({
        ...config,
        onError,
        onMutate: () => {
            setStatus("transacting")
        },
    })
    useWaitForTransaction({
        hash: writeData?.hash,
        onError,
        onSuccess: (e) => {
            setTransactionHash(e.transactionHash)
            setStatus("success")
        },
    })
    return { buyPrice: (buyPrice as bigint) || 0n, buyPass, status, transactionHash }
}
