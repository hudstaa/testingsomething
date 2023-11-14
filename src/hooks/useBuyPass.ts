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

export default function useBuyPass(subject: Address, shares: bigint) {
    const [error, setError] = useState<any>();
    const [status, setStatus] = useState<any>();
    const [transactionHash, setTransactionHash] = useState<any>();

    const onError = useCallback((e: unknown) => {
        setError(e);
        setStatus('error');
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

    const { data: buyPrice } = useContractRead({
        ...tribePassesContract,
        account: me.address as Address,
        chainId: baseGoerli.id,
        functionName: 'getBuyPriceAfterFee',
        args: [subjectAddress, shares],
        watch: true
    })

    const { config } = usePrepareContractWrite({
        ...tribePassesContract,
        functionName: 'buyBoosts',
        chainId: baseGoerli.id,
        args: [subjectAddress, shares, '0xCc879Ab4DE63FC7Be6aAca522285D6F5d816278e'],
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
    return { buyPrice: (buyPrice as bigint) || 0n, buyPass, status, transactionHash, error }
}
