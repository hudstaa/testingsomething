import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { useCallback, useState } from 'react';
import type { Address } from 'viem';
import { baseGoerli } from 'viem/chains';
import {
    useContractRead,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from 'wagmi';
import { tribePassesContract } from '../lib/constants';

export default function useSellPass(subject: Address, shares: bigint) {
    const [error, setError] = useState<any>();
    const [status, setStatus] = useState<string>("init");
    const onError = useCallback((e: unknown) => {
        setStatus('error')
        setError(e);
    }, [])

    const { wallet } = usePrivyWagmi()

    const { data: sellPrice } = useContractRead({
        ...tribePassesContract,
        chainId: baseGoerli.id,
        account: wallet?.address as Address,
        functionName: 'getSellPriceAfterFee',
        args: [subject, shares],
        watch: true
    })

    const { config } = usePrepareContractWrite({
        ...tribePassesContract,
        functionName: 'sellBoosts',
        chainId: baseGoerli.id,
        args: [subject, shares, '0xCc879Ab4DE63FC7Be6aAca522285D6F5d816278e'],
        value: sellPrice as bigint
    })
    const { write: sellPass, data: writeData, error: testError, } = useContractWrite({
        ...config,
        onError,

        onMutate: () => {
            console.log('mutated')
            setStatus("transacting")
        },
    })
    useWaitForTransaction({
        hash: writeData?.hash,
        onError,
        onSuccess: () => {
            console.log('success')
            setStatus("success")

        },
    })

    return { sellPass, sellPrice, status }
}
