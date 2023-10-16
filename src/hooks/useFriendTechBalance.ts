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
    //  useContractRead({

    // ...friendTechCcontract,
    // functionName: 'sharesBalance',
    // args: [friendTechChannel, friendTechWallet],
    // watch: true,
    // chainId: 8453
    // });
    // console.log("getting balance", wallet, channel, balance);
    // Fetch data from Firebase on component mount
    useEffect(() => {
        (async () => {

            const client = createPublicClient({
                chain: base,
                transport: http()
            })
            const blockChainBalance = await client.readContract({
                ...friendTechCcontract,
                functionName: 'sharesBalance',
                args: [friendTechChannel, friendTechWallet],
            })
            const database = getFirestore(app);
            if (!friendTechWallet || !channel) {
                console.log(friendTechWallet, channel);
                return;
            }
            setBalance((blockChainBalance as any))
            const docRef = doc(database, 'channel', channel);
            getDoc(docRef).then((data) => {
                const property = 'friendTech:' + friendTechWallet;
                const docData = data.data();
                const dbBalance = docData && docData[property]
                console.log(dbBalance, blockChainBalance, "FT BALANCES")
                if (!data.exists() || dbBalance !== Number(blockChainBalance)) {
                    setSyncing(true);
                    const syncHolders = httpsCallable(getFunctions(app), 'syncFriendTech');
                    syncHolders({ friendTechWallet, channel, friendTechChannel }).then(response => {
                        setSyncing(false);
                        console.log(response.data);
                    }).catch(error => {
                        console.error("Error calling syncFriendTechHolders:", error);
                    });
                }
            }).catch((e) => {
                console.log(e);
            })
            onSnapshot(docRef, (data) => {
                const property = "friendTech:" + friendTechWallet;
                const docData = data.data() || { [property]: 0 };
                const dbBalance = docData[property];
                if (dbBalance !== Number(balance) || !data.exists()) {
                    setSyncing(true);
                    const syncHolders = httpsCallable(getFunctions(app), 'syncFriendTech');
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
        })()

    }, [friendTechChannel, friendTechWallet, channel, balance]);

    return { balance, syncing };
}