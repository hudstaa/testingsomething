import type { Address } from 'viem'
import {
    useContractRead,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from 'wagmi'
import { useCallback, useState } from 'react'
import { tribePassesContract } from '../lib/constants'
import { useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/functions';
import 'firebase/database';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { Firestore, doc, getDoc, getFirestore, limit, onSnapshot } from 'firebase/firestore';
import { app } from '../App';
import { getDatabase } from 'firebase/database';
export default function useBoosters(wallet: Address | string | undefined, channel: Address | string) {
    const [syncing, setSyncing] = useState<boolean | null>(null);
    const { data: balance } = useContractRead({
        ...tribePassesContract,
        functionName: 'ownerOf',
        args: [channel],
        watch: true
    });

    useEffect(() => {
        if (!balance || !wallet || !channel) {
            return;
        }
        const balanceInfo = balance as [string[], bigint[]];
        const holderBalance = balanceInfo[1][balanceInfo[0].indexOf(wallet)];
        console.log('holder balance', holderBalance)

        const database = getFirestore(app);
        const docRef = doc(database, 'channel', channel);

        const handleSnapshot = (data: any) => {
            const holderMap: Record<string, number> = data.data()?.holders || {};
            const dbBalance = holderMap[wallet];
            if (dbBalance !== Number(holderBalance)) {
                if (typeof dbBalance === 'undefined' && (holderBalance === 0n || typeof holderBalance === 'undefined')) {
                    return;
                }
                console.log(dbBalance, holderBalance);
                setSyncing(true);
                const syncHolders = httpsCallable(getFunctions(app), 'syncBoosters');
                console.log(balance, dbBalance);
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