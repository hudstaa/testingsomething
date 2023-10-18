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
            console.log("CHECKING FRIEND TECH BALANCW")
            const client = createPublicClient({
                chain: base,
                transport: http()
            })
            if (!friendTechWallet || !friendTechWallet) {
                console.log(friendTechWallet, channel);
                setBalance(0n)
                console.log("zero Blockchain Balance");

                return;
            }
            const blockChainBalance = await client.readContract({
                ...friendTechCcontract,
                functionName: 'sharesBalance',
                args: [friendTechChannel, friendTechWallet],
            })
            console.log(blockChainBalance)

            const database = getFirestore(app);
            if (!friendTechWallet || !channel) {
                console.log(friendTechWallet, channel);
                setBalance(0n)
                console.log("zero Blockchain Balance");

                return;
            }
            console.log(blockChainBalance, "Blockchain Balance");
            setBalance((blockChainBalance as any))
            const docRef = doc(database, 'channel', channel);
            getDoc(docRef).then((data) => {
                const property = 'friendTech:' + friendTechWallet;
                const docData = data.data();
                console.log(property, blockChainBalance,)
                const dbBalance = docData && docData[property]
                if ((!data.exists() && Number(blockChainBalance) > 0) || dbBalance !== Number(blockChainBalance) && Number(blockChainBalance) > 0) {
                    console.log(dbBalance, balance, "SyncFriendTec!!!!h")
                    console.log(blockChainBalance, dbBalance);
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
                const docData = data.data();
                const dbBalance = docData ? docData[property] : undefined;
                console.log(dbBalance);
                if ((dbBalance !== Number(blockChainBalance)) || !data.exists()) {
                    console.log(dbBalance, balance, "SyncFriendTechEXISTING")
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