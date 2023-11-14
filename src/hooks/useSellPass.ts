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
import { useMember } from './useMember';

export default function useSellPass(subject: Address, shares: bigint) {
    const [error, setError] = useState<any>();
    const [status, setStatus] = useState<string>("init");
    const onError = useCallback((e: unknown) => {
        setStatus('error')
        setError(e);
        setTimeout(() => {
            setError(undefined);
            setStatus("init");
        }, 3000)
    }, [])

    let me: any = useMember(x => x.getCurrentUser())
    let subjectAddress = subject;
    if (!subject || subject === null) {
        subjectAddress = '0x0x000000000000000000000000000000000000dead';
    }
    if (!me || subject === null) {
        me = { address: '0x0x000000000000000000000000000000000000dead' } as any
    }


    const { data: sellPrice } = useContractRead({
        ...tribePassesContract,
        chainId: baseGoerli.id,
        account: me.address as Address,
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

    return { sellPass, sellPrice, status, error }
}
