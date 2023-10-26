import type { Address } from 'viem'
import {
    useContractRead,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from 'wagmi'
import { useCallback, useState } from 'react'
import { friendTechCcontract, tribePassesContract } from '../lib/constants'
import { useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/functions';
import 'firebase/database';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { Firestore, doc, getDoc, getFirestore, onSnapshot } from 'firebase/firestore';
import { app } from '../App';
import { getDatabase } from 'firebase/database';
import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains';

export default function useFriendTechBalance(friendTechWallet: Address | string | undefined, friendTechChannel: Address | string | undefined, channel: Address | string | undefined) {
    const [syncing, setSyncing] = useState<boolean | null>(null);
    const [balance, setBalance] = useState<bigint | undefined>();

    useEffect(() => {
        if (!friendTechWallet || !channel) {
            return;
        }

        const fetchData = async () => {
            const client = createPublicClient({
                chain: base,
                transport: http()
            });

            const blockChainBalance = await client.readContract({
                ...friendTechCcontract,
                functionName: 'sharesBalance',
                args: [friendTechChannel, friendTechWallet],
            });
            console.log(blockChainBalance, "BALANCE")

            setBalance(blockChainBalance as bigint);

            const database = getFirestore(app);
            const docRef = doc(database, 'channel', channel);

            const data = await getDoc(docRef);
            const property = 'friendTech:' + friendTechWallet;
            const docData = data.data();
            const dbBalance = docData ? docData[property] : undefined;

            if (0n !== (blockChainBalance)) {
                if (dbBalance == Number(blockChainBalance)) {
                    return;
                }
                setSyncing(true);
                const syncHolders = httpsCallable(getFunctions(app), 'syncFriendTech');
                try {
                    const response = await syncHolders({ friendTechWallet, channel, friendTechChannel });
                    console.log(response.data);
                } catch (error) {
                    console.error("Error calling syncFriendTechHolders:", error);
                }
                setSyncing(false);
            }

            const unsubscribe = onSnapshot(docRef, snapshotData => {
                const docSnapshotData = snapshotData.data();
                const dbSnapshotBalance = docSnapshotData ? docSnapshotData[property] : undefined;

                if (dbSnapshotBalance !== Number(blockChainBalance) && blockChainBalance != 0n) {
                    setSyncing(true);
                    const syncHolders = httpsCallable(getFunctions(app), 'syncFriendTech');
                    console.log(balance, dbBalance)
                    syncHolders({ friendTechWallet, friendTechChannel, channel }).then(response => {
                        console.log(response.data);
                        setSyncing(false);
                    }).catch(error => {
                        setSyncing(false);
                        console.error("Error calling syncFriendTechHolders:", error);
                    });
                } else {
                    setSyncing(false);
                }
            });

            return () => {
                unsubscribe();
            };
        };
        friendTechChannel && friendTechWallet && channel && fetchData();
    }, [friendTechChannel, friendTechWallet, channel, balance]);

    return { balance, syncing };
}