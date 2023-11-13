import 'firebase/database';
import { doc, getDoc, getFirestore, onSnapshot } from 'firebase/firestore';
import 'firebase/functions';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useEffect, useState } from 'react';
import type { Address } from 'viem';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { app } from '../App';
import { friendTechCcontract } from '../lib/constants';
import { usePrivy } from '@privy-io/react-auth';

export default function useFriendTechBalance(friendTechWallet: Address | string | undefined, friendTechChannel: Address | string | undefined, channel: Address | string | undefined) {
    const [syncing, setSyncing] = useState<boolean | null>(null);
    const [balance, setBalance] = useState<bigint | undefined>();
    const { ready } = usePrivy()
    useEffect(() => {
        if (!friendTechWallet || !channel || !ready || channel === '0x0000000000000000000000000000000000000000') {
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