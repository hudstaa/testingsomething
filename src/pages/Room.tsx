import { IonAvatar, IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonFooter, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonList, IonListHeader, IonPage, IonProgressBar, IonSpinner, IonText, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { useChat } from '../hooks/useChat';
import { useMember } from '../hooks/useMember';
import { useParams } from 'react-router';
import { usePrivy } from '@privy-io/react-auth';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { getEnv, loadKeys, storeKeys } from '../lib/xmtp';
import { useQuery } from '@apollo/client';
import { TribeContent } from '../components/TribeContent';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { paperPlane } from 'ionicons/icons';
import { MemberBadge } from '../components/MemberBadge';
import { Client, Conversation, ConversationV2, DecodedMessage, MessageV2 } from '@xmtp/xmtp-js';
import { useTitle } from '../hooks/useTitle';
import { CachedConversation, CachedMessage, Signer, useClient, useConversations, useMessages, useStreamAllMessages, useStreamMessages } from '@xmtp/react-sdk';
import { useGroupMessages } from '../hooks/useGroupMessages';
import { timeAgo } from '../components/TradeItem';
import { TribeHeader } from '../components/TribeHeader';

const MESSAGE_BOT = "0xBABE8825fd3Db02F2d432936d058e7315d2E801c"

export const WriteMessage: React.FC<{ address: string, sendMessage: (content: string) => void }> = ({ address, sendMessage }) => {
    const [newNote, setNewNote] = useState<string>("")
    useEffect(() => {
    }, [address])
    const makeComment = () => {
        sendMessage(newNote);
        setNewNote("");
    }
    return <IonToolbar>

        <IonInput value={newNote} type='text' placeholder="   send a message" onKeyDown={(e) => {
            if (e.key === 'Enter') {
                makeComment();
            }
        }} onIonInput={(e) => {
            setNewNote(e.detail.value!)
        }} />
        <IonButtons slot='end'>
            <IonButton onClick={async () => {
                makeComment();
            }}>
                <IonIcon color={newNote.length > 0 ? 'primary' : 'light'} icon={paperPlane} />
            </IonButton>
        </IonButtons>
    </IonToolbar>
}

const Test: React.FC = () => {
    const { client } = useClient();
    console.log(client);
    return <>

    </>
}
// }
// const Room: React.FC = () => {
//     const { address } = useParams<{ address: string }>();
//     const { getFriend } = useMember();
//     const { wallet } = usePrivyWagmi()
//     const { client } = useClient()
//     const [xmtp, setXmtp] = useState<Client>()
//     const [conversations, setConversations] = useState<Conversation<any>[]>([])
//     const [listeningConversations, setListeningConversations] = useState<Conversation<any>[]>([])
//     const [messages, setMessages] = useState<DecodedMessage[]>([])
//     const members = useMember(x => Object.keys(x.friendCache));
//     const conversationId = "@tribe:" + address;
//     useEffect(() => {
//         const initXmtp = async () => {
//             if (!wallet) {
//                 console.log("no wallet")
//                 return;
//             }
//             if (typeof xmtp !== 'undefined') {
//                 return;
//             }
//             if (wallet.connectorType !== 'embedded') {
//                 console.log("not embeded")
//                 return;
//             }
//             // create a client using keys returned from WgetKeys
//             const options: any = {
//                 persistConversations: false,
//                 env: "dev",
//             };

//             const signer = (await wallet!.getEthersProvider()).getSigner()
//             console.log(signer)
//             // const existingKeys = loadKeys(wallet.address);
//             // if (existingKeys) {
//             //     console.log("EXISTING")
//             //     const client = await Client.create(null, { privateKeyOverride: existingKeys, ...options, signer });
//             //     console.log(client, "LOAD FROM CACHE");
//             //     setXmtp(client);
//             //     return;
//             // }
//             console.log("SIGN ME")
//             try {
//                 Client.create(signer, { env: 'dev' }).then((e) => {
//                     console.log(e);
//                 }).catch((e) => {
//                     console.log(e);
//                 });
//             } catch (e) {
//                 console.log(e);
//             }
//             setXmtp(client);
//         };
//         wallet && wallet.address && wallet.connectorType === 'embedded' && initXmtp();
//     }, [wallet, wallet?.address])
//     // useEffect(() => {
//     //     if (!xmtp || !wallet) {
//     //         console.log("not ready")
//     //         return;
//     //     } else {
//     //         console.log("fetching")
//     //     }
//     //     const fetchConversations = async () => {
//     //         const existing = await xmtp!.conversations.list()
//     //         console.log(existing);
//     //         setConversations(existing.filter(x => x.context!.conversationId.startsWith("@tribe:")));
//     //         for await (const conversation of await xmtp!.conversations.stream()) {
//     //             setConversations(x => [...x, conversation]);
//     //         }
//     //     }
//     //     xmtp && wallet && fetchConversations()
//     // }, [xmtp, wallet])
//     useEffect(() => {
//         if (!wallet) {
//             console.log("no walelt")
//             return;
//         }
//         conversations.length > 0 && (() => {
//             setListeningConversations(x => [...x, ...conversations])
//             conversations.forEach(async (conversation) => {
//                 const messages = await conversation.messages()
//                 if (conversation.context!.metadata.from === conversation.context!.metadata.to) {
//                     setMessages(x => [...x, ...messages]);
//                 } else {
//                     setMessages(x => [...x, ...messages.filter(x => x.senderAddress !== wallet!.address)]);
//                 }
//                 for await (const message of await conversation.streamMessages()) {
//                     if (conversation.context!.metadata.from === conversation.context!.metadata.to) {
//                         setMessages(x => [...x, message]);
//                     } else if (message.senderAddress !== wallet.address) {
//                         setMessages(x => [...x, message]);
//                     }
//                 }
//             })
//             setConversations([])

//         })()
//     }, [conversations, wallet])

//     // const sendMessage = useCallback((content: string) => {

//     //     (async () => {
//     //         if (!wallet || !xmtp) {
//     //             return;
//     //         }
//     //         const broadcasts_array = [wallet!.address, members];

//     //         //Querying the activation status of the wallets
//     //         const broadcasts_canMessage = await xmtp.canMessage(members);
//     //         for (let i = 0; i < broadcasts_array.length; i++) {
//     //             //Checking the activation status of each wallet
//     //             const recipient = broadcasts_array[i] as string;
//     //             const canMessage = broadcasts_canMessage[i];
//     //             console.log(wallet, canMessage);
//     //             if (broadcasts_canMessage[i]) {
//     //                 //If activated, start
//     //                 const existing = conversations.find(x => x.context?.metadata.to.toLowerCase() === recipient.toLowerCase() && x.context.conversationId === conversationId)
//     //                 if (existing) {
//     //                     const sent = await existing.send(content);
//     //                 }
//     //                 // const conversation = await xmtp.conversations.newConversation(recipient, { conversationId, metadata: { to: recipient, from: wallet.address } });
//     //                 // Send a message
//     //                 // const sent = await conversation.send(content);
//     //             }
//     //         }
//     //     })()

//     // }, [members, xmtp])
//     return (
//         <TribeContent fullscreen>
//             <IonGrid>{wallet?.address}
//                 {wallet?.connectorType}
//                 {typeof xmtp}
//                 {messages.map((message) => <IonList>
//                     <MemberBadge address={message.senderAddress} />
//                     {message.content}
//                 </IonList>)}
//             </IonGrid>
//             <IonFooter>
//                 {/* {wallet && <WriteMessage address={wallet.address} sendMessage={sendMessage} />} */}
//             </IonFooter>
//         </TribeContent >
//     );
// };


export const CreateClient: React.FC<{ signer: Signer }> = ({ signer }) => {
    const { error, isLoading, initialize } = useClient();
    const { wallet: embedded } = usePrivyWagmi();
    const handleConnect = useCallback(async () => {
        if (!embedded || embedded.connectorType !== 'embedded' || typeof signer === 'undefined') {
            return;
        }
        const address = embedded!.address
        const options: any = {
            persistConversations: false,
            env: "dev",
        };
        let keys = loadKeys(address);
        if (!keys) {
            keys = await Client.getKeys(signer, {
                // we don't need to publish the contact here since it
                // will happen when we create the client later
                skipContactPublishing: true,
                // we can skip persistence on the keystore for this short-lived
                // instance
                persistConversations: true,
            });
            storeKeys(address, keys);
        }
        await initialize({ keys, options, signer });
    }, [initialize, embedded, signer]);
    useEffect(() => {
        signer && handleConnect();
    }, [signer])

    if (error) {
        return "An error occurred while initializing the client";
    }

    if (isLoading) {
        return <IonSpinner />;
    }
    return <></>
};

// export const CreateClient: React.FC<{ signer: Signer }> = ({ signer }) => {
//     const { client, error, isLoading, initialize } = useClient();

//     const handleConnect = useCallback(async () => {
//         const keys = await Client.getKeys(signer);
//         const options: any = {
//             persistConversations: false,
//             env: "dev",
//         };
//         await initialize({ keys, options, signer });
//     }, [initialize]);

//     if (error) {
//         return "An error occurred while initializing the client";
//     }

//     if (isLoading) {
//         return "Awaiting signatures...";
//     }

//     if (!client) {
//         return (
//             <button type="button" onClick={handleConnect}>
//                 Connect to XMTP
//             </button>
//         );
//     }

//     return "Connected to XMTP";
// };
const Room: React.FC = () => {
    const { address } = useParams<{ address: string }>()
    const { wallet, ready } = usePrivyWagmi();
    const { user } = usePrivy();
    const [signer, setSigner] = useState<any>();
    const messages = useGroupMessages(x => x.groupMessages[address.toLowerCase()] || [])
    const { pushMessages } = useGroupMessages()
    const { client } = useClient();
    const members = useMember(x => Object.keys(x.friendCache))
    const conversationId = "@tribe/dev/" + address;
    useEffect(() => {
        if (wallet?.connectorType === 'embedded') {
            wallet.getEthersProvider().then((ethers) => {
                setSigner(ethers.getSigner())
            })
        } else {
            console.log("Wrong wallet", ready);
        }
    }, [wallet, user, ready])
    useEffect(() => {
        client && wallet && address && (async () => {

            client.conversations.list().then((convos) => {
                console.log(convos);
                const tribeConvos = convos.filter(x => x.context && x.context.conversationId === conversationId)

                tribeConvos.forEach(async (tribeConvo) => {
                    tribeConvo.messages().then((msgs: any[]) => {
                        console.log(msgs);
                        pushMessages(address, msgs as any);
                    })
                })
                tribeConvos.forEach(async (tribeConvo) => {
                    for await (const message of await tribeConvo.streamMessages()) {
                        pushMessages(address, [message] as any);
                    }
                })
            })
            for await (const streamedConvo of await client.conversations.stream()) {
                for await (const message of await streamedConvo.streamMessages()) {
                    if (streamedConvo.peerAddress === MESSAGE_BOT || message.senderAddress !== wallet!.address) {
                        pushMessages(address, [message] as any);
                    }
                }
            }

        })()
    }, [client, address, wallet])


    const broadCast = useCallback((content: string) => {


        const broadCastAsync = (async () => {
            const otherMembers = [MESSAGE_BOT, ...members.filter(x => x !== wallet!.address)]
            const broadcasts_array = [wallet!.address, otherMembers];

            //Querying the activation status of the wallets
            const broadcasts_canMessage = await client!.canMessage(otherMembers);
            const conversations = (await client!.conversations.list())
            for (let i = 0; i < broadcasts_array.length; i++) {
                //Checking the activation status of each wallet
                const recipient = otherMembers[i] as string;
                const canMessage = broadcasts_canMessage[i];
                if (canMessage && recipient !== wallet!.address) {
                    const existingConvo = conversations.find(x => x.context && x.context.conversationId === conversationId && x.peerAddress === recipient);
                    if (existingConvo) {
                        const receipt = await existingConvo.send(content);
                        console.log(receipt);
                    } else {
                        console.log(recipient);
                        const conversation = await client!.conversations.newConversation(recipient, { conversationId, metadata: {} });
                        const sent = await conversation.send(content);
                        console.log(sent);
                    }
                } else {
                    console.log(wallet);
                }
            }
        })
        broadCastAsync();
    }, [wallet, client])

    const messageList = useMemo(() => messages.map((msg: any) => <IonItem lines={'none'} key={msg.id}>
        <MemberBadge address={msg.senderAddress} />
        <IonText>{msg.content}</IonText>
        <IonButtons slot='end'>
            {timeAgo(msg.sent)}
        </IonButtons>
    </IonItem>), [messages])
    return <IonPage>
        <TribeHeader />
        <TribeContent>
            <CreateClient signer={signer} />
            <IonList>
                {messageList}
            </IonList>
        </TribeContent>
        <IonFooter>
            < WriteMessage address={''} sendMessage={broadCast} />
        </IonFooter>
    </IonPage>
}

export default Room;
