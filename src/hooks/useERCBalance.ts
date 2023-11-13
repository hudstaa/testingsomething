import 'firebase/database';
import { doc, getDoc, getFirestore, onSnapshot } from 'firebase/firestore';
import 'firebase/functions';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useEffect, useState } from 'react';
import type { Address } from 'viem';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { app } from '../App';
import { balanceOfContract, chainRPC, chains, friendTechCcontract } from '../lib/constants';
import { usePrivy } from '@privy-io/react-auth';

export default function useERCBalance(contractAddress: Address | string | undefined, chainId: number) {
    const [syncing, setSyncing] = useState<boolean | null>(null);
    const [balance, setBalance] = useState<bigint | undefined>();
    const { user, ready } = usePrivy();
    const accountAddress = (user?.linkedAccounts.find((x: any) => x.connectorType == 'injected') as any)?.address;
    useEffect(() => {
        if (!chainId || !contractAddress) {
            return;
        }

        const fetchData = async () => {
            if (syncing || !ready || !accountAddress) {
                return;
            }
            const client = createPublicClient({
                chain: chains[chainId],
                transport: chainRPC[chainId]
            });
            console.log("FETCHING ERC20 BALANCE DAYA", { client, chainId, contractAddress, accountAddress })

            const blockChainBalance = await client.readContract({
                ...balanceOfContract,
                address: contractAddress as Address,
                functionName: 'balanceOf',
                args: [accountAddress],
            })
            console.log(blockChainBalance, "BALANCE")

            setBalance(blockChainBalance as bigint);

            const database = getFirestore(app);
            const docRef = doc(database, 'channel', contractAddress);

            const data = await getDoc(docRef);
            const property = accountAddress;
            if (!property) {
                return;
            }
            const docData = data.data();
            const dbBalance = docData ? docData[property] : undefined;

            if (0n !== (blockChainBalance)) {
                if (dbBalance == Number(blockChainBalance)) {
                    return;
                }
                setSyncing(true);
                const syncHolders = httpsCallable(getFunctions(app), 'syncBalanceOf');
                try {
                    const response = await syncHolders({ contractAddress, accountAddress, chainId });
                    console.log(response.data);
                } catch (error) {
                    console.error("Error calling syncBalance:", error);
                }
                setSyncing(false);
            }

            const unsubscribe = onSnapshot(docRef, snapshotData => {
                const docSnapshotData = snapshotData.data();
                const dbSnapshotBalance = docSnapshotData ? docSnapshotData[property] : undefined;

                if (dbSnapshotBalance !== Number(blockChainBalance) && blockChainBalance != 0n) {
                    setSyncing(true);
                    const syncHolders = httpsCallable(getFunctions(app), 'syncBalanceOf');
                    console.log(balance, dbBalance, 'ercsync')
                    syncHolders({ contractAddress, accountAddress, chainId }).then(response => {
                        console.log(response.data);
                        setSyncing(false);
                    }).catch(error => {
                        setSyncing(false);
                        console.error("Error calling syncBalance:", error);
                    });
                } else {
                    setSyncing(false);
                }
            });

            return () => {
                unsubscribe();
            };
        };
        ready && contractAddress && accountAddress && chainId && fetchData();
    }, [contractAddress, accountAddress, balance, chainId, ready]);

    return { balance, syncing };
}