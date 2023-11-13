import 'firebase/database';
import { doc, getDoc, getFirestore, onSnapshot } from 'firebase/firestore';
import 'firebase/functions';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useEffect, useState } from 'react';
import type { Address } from 'viem';
import {
    useContractRead
} from 'wagmi';
import { app } from '../App';
import { tribePassesContract } from '../lib/constants';
export default function useBoosters(wallet: Address | string | undefined, channel: Address | string) {
    const [syncing, setSyncing] = useState<boolean | null>(null);
    const { data: balance } = useContractRead({
        ...tribePassesContract,
        functionName: 'ownerOf',
        args: [channel],
        watch: true
    });

    useEffect(() => {
        if (!balance || !wallet || !channel || channel === '0x0000000000000000000000000000000000000000') {
            return;
        }
        const balanceInfo = balance as [string[], bigint[]];
        const holderBalance = balanceInfo[1][balanceInfo[0].indexOf(wallet)];

        const database = getFirestore(app);
        const docRef = doc(database, 'channel', channel);

        const handleSnapshot = (data: any) => {
            const holderMap: Record<string, number> = data.data()?.holders || {};
            const dbBalance = holderMap[wallet];
            if (dbBalance !== Number(holderBalance)) {
                if (typeof dbBalance === 'undefined' && (holderBalance === 0n || typeof holderBalance === 'undefined')) {
                    return;
                }
                setSyncing(true);
                const syncHolders = httpsCallable(getFunctions(app), 'syncBoosters');
                syncHolders({ address: channel }).then(response => {
                    setSyncing(false);
                }).catch(error => {
                    setSyncing(false);
                    console.error("Error calling syncBoosters:", error);
                });
            } else {
                setSyncing(false);
            }
        };

        if (holderBalance == 0n || typeof holderBalance === 'undefined') {
            console.log('no balance')
        } else {
            getDoc(docRef).then(handleSnapshot);
        }

        // Subscribe to snapshot updates
        const unsubscribe = onSnapshot(docRef, handleSnapshot);

        // Cleanup the listener on component unmount
        return () => unsubscribe();
    }, [wallet, channel, balance]);

    return { balance, syncing };
}