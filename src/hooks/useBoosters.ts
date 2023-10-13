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
import { Firestore, doc, getDoc, getFirestore, onSnapshot } from 'firebase/firestore';
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

    // Fetch data from Firebase on component mount
    useEffect(() => {
        const database = getFirestore(app);
        if (!wallet || !channel) {
            console.log(wallet, channel);
            return;
        }
        const docRef = doc(database, 'channel', channel);
        getDoc(docRef).then((data) => {
            console.log("GOT CHANNEL DOC")
            if (!data.exists()) {
                setSyncing(true);
                const syncHolders = httpsCallable(getFunctions(app), 'syncBoosters');
                syncHolders({ address: channel }).then(response => {
                    setSyncing(false);
                    console.log(response.data);
                }).catch(error => {
                    console.error("Error calling syncBoosters:", error);
                });
            }
        }).catch((e) => {
            console.log(e);
        })
        onSnapshot(docRef, (data) => {
            const holderMap: Record<string, number> = data.data()?.holders || {};
            const balanceInfo = balance as [string[], number[]];
            const holderBalance = balanceInfo[1][balanceInfo[0].indexOf(wallet)]
            if (holderMap[wallet] !== holderBalance) {
                setSyncing(true);
                const syncHolders = httpsCallable(getFunctions(app), 'syncBoosters');
                syncHolders({ address: channel }).then(response => {
                    console.log(response.data);
                    setSyncing(false);
                }).catch(error => {
                    setSyncing(null);
                    console.error("Error calling syncBoosters:", error);
                });
            } else {
                setSyncing(false);
            }
        });
    }, [wallet, channel, balance]);

    return { balance, syncing };
}