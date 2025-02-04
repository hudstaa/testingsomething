import { IonModal, IonBadge, IonButton, IonRow, IonGrid, IonButtons, IonCard, IonCardContent, IonCardHeader, IonIcon, IonImg, IonItem, IonItemDivider, IonLabel, IonRouterLink, IonText, IonToast, IonPopover, IonContent, useIonPopover, useIonModal, IonHeader, IonTitle, IonToolbar } from "@ionic/react"
import { Timestamp } from "firebase/firestore"

import { useMemo, useState, useRef } from "react"
import { useWriteMessage } from "../hooks/useWriteMessage"
import { CommentList } from "./CommentList"
import { MemberCardHeader, MemberPfp, TwitterNameLink } from "./MemberBadge"
import { timeAgo } from "./TradeItem"
import { WriteMessage } from "./WriteMessage"
import { paperPlane, share, shareOutline, shareSocialOutline, personOutline, arrowDown, arrowUp } from "ionicons/icons"
import { useNotifications } from "../hooks/useNotifications"
import { useHistory, useLocation } from "react-router"
import { useMember } from "../hooks/useMember"
import Linkify from "linkify-react"
import * as sugar from '../lib/sugar'
import { known_pairs } from '../lib/sugar'; // Adjust the path as necessary
import 'linkify-plugin-mention';
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets"
import { TokenGraph } from "./TokenGraph"
import { TokenInfo } from "./TokenInfo"
import { TaggableContent } from "./TaggableContent"


export const CashTag: React.FC<{ content: string }> = ({ content }) => {
    const currencyKey = content.substring(1).toLowerCase();
    const hit = known_pairs[currencyKey];
    const outputCurrency = hit?.swap.outputCurrency;
    const outputChain = hit?.swap.chain;
    const outputID = hit?.id;
    const emoji = hit?.emoji;
    const [showModal, setShowModal] = useState(false);

    const { push } = useHistory();

    return (
        <>
            <a className="medium" onClick={() => setShowModal(true)}>
                {emoji}{content}
            </a>
    
            <IonModal
                className="custom-modal"
                isOpen={showModal}
                onDidDismiss={() => setShowModal(false)}
                initialBreakpoint={0.75} 
                breakpoints={[0, 0.75, 1]}
                style={{zIndex: 999}}
            >
                <IonContent style={{padding: 10}}>
                    {outputID && (
                        <TokenInfo 
                            id={outputID}
                            contractId={outputCurrency} 
                            chainName={outputChain} 
                            content={content}
                            onGetToken={() => {
                                push('/swap?' + new URLSearchParams(hit.swap).toString());
                                setShowModal(false);
                            }}
                        />
                    )}
                </IonContent>
            </IonModal>
        </>
    );
};

export const PostCard: React.FC<{ onPostPage?: boolean, commentCount?: number, hideComments: boolean, id: string, sent: Timestamp, score: number, voted: 1 | -1 | undefined | null, author: string, uid: string, content: string, makeComment: (id: string, content: string) => void, handleVote: (id: string, uid: string, vote: boolean) => void, media?: { src: string, type: string } }> = ({ onPostPage = false, hideComments, author, sent, uid, handleVote, id, score, voted, content, makeComment, media, commentCount }) => {
    const [showComments, setShowComments] = useState<boolean>(!hideComments);
    const { open } = useWriteMessage();
    const { localCommentCount, commentAdded } = useNotifications()
    const newComments = localCommentCount[id] || 0;
    const member = useMember(x => x.getFriend(author));
    const { localNotif, setLocalNotif } = useNotifications()
    const darkmode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const bgColor = darkmode ? 'tabblur' : 'white';
    const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
    const [isTap, setIsTap] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const toggleModal = () => setShowModal(!showModal);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const cardStyle = onPostPage ? {
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        cursor: 'pointer!important'
    } : {
        borderBottom: '1px solid var(--ion-color-medium-shade)',
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        cursor: 'pointer!important'
    };

    const gptRowStyle = onPostPage ? {
        borderBottom: '1px solid var(--ion-color-medium-shade)',
        marginBottom: 4,
        marginTop: -8,
        paddingLeft: 30, //testing TwitStyles

        display: 'flex',
        justifyContent: 'space-between'
    } : {
        marginTop: -8,
        marginBottom: -4,
        paddingLeft: 30, //testing TwitStyles
        display: 'flex',
        justifyContent: 'space-between'
    };

    const openCommentsModal = () => {
        open(
            (message) => makeComment(id, message as any),
            author,
            "Comment",
            id
        );
    };

    const shouldNavigate = (target: EventTarget | null): boolean => {
        while (target && target instanceof HTMLElement) {
            if (target.nodeName === 'ION-BUTTON' || 
                target.classList.contains('do-not-navigate') || 
                target.nodeName === "VIDEO" || 
                target.tagName === "A") {
                return false;
            }
            target = target.parentNode;
        }
        return true;
    };
    const handleNavigation = (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
        if (shouldNavigate(e.target as EventTarget)) {
            openCommentsModal();
        }
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLElement>) => {
        handleNavigation(e);
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLElement>) => {
        if (isTap) {
            // It's a tap, handle click
            handleNavigation(e);
        }
    };


    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        setTouchStart({
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        });
        setIsTap(true); // Assume it's a tap initially
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        // If the finger moves significantly, consider it a swipe
        const moveX = e.touches[0].clientX;
        const moveY = e.touches[0].clientY;
        if (Math.abs(moveX - touchStart.x) > 10 || Math.abs(moveY - touchStart.y) > 10) {
            setIsTap(false); // It's a swipe
        }
    };
    const handleCardClick = (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
        if (shouldNavigate(e.target as EventTarget)) {
            openCommentsModal();
        }
    };


    return (
    <div onClick={handleCardClick} style={cardStyle} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}><IonCard onMouseDown={(e) => {
        const classes = Array.from((e.target as any).classList);
        const isAlias = classes.includes('alias') || classes.includes('cashtag')
        if ((e.target as any)?.nodeName === "VIDEO") {
            return;
        }
        if ((e.target as any)?.tagName === "A") {
            return;
        }
        if ((e.target as any)?.nodeName != 'VIDEO' && (e.target as any)?.nodeName != 'ION-BUTTON' && (e.target as any)?.parentNode?.nodeName !== 'ION-BUTTON' && !isAlias) {
            openCommentsModal();
        }
    }} color={bgColor} key={id} style={{ marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0, cursor: 'pointer!important' }} onClick={(e) => {

    }}>
        <IonCardHeader style={{ display: 'flex', cursor: 'pointer', paddingLeft: 8, paddingBottom: 0, paddingTop: 6, marginRight: 0 }}>
            <div style={{ display: 'flex' }}>
                <div style={{ borderRadius: 10, marginTop: 4 }}>
                    <MemberPfp color='dark' size="veru-smol" address={author} />
                </div>
                <div style={{ marginLeft: 4, marginTop: -2 }}>
                    <MemberCardHeader address={author} content={<>{sent !== null && sent?.seconds && timeAgo(new Date(sent.seconds * 1000))}</>} />
                </div>

            </div>
        </IonCardHeader>
        <IonCardContent style={{ paddingLeft: 46, marginLeft: 0, paddingBottom: 1, paddingTop: 0, margin: 0, paddingRight: 16, marginTop: '-10px' }}  >
            <div>
                <IonText color='dark' className='regular' style={{ whiteSpace: 'pre-wrap', fontSize: onPostPage ? '1.05rem' : '.975rem', letterSpacing: '.0135em' }} onClick={() => { }}>
                    <TaggableContent>
                        {content}
                    </TaggableContent>
                </IonText>
            </div>
            {media && (
                <div style={{ marginTop: 8, marginBottom: -4, marginRight: 0, overflow: 'hidden', borderRadius: '12px' }}>
                    {media.type.includes("image") ?
                        <img style={{ border: '1px solid var(--ion-color-medium-shade)', minWidth: '100%', maxHeight: '100%', borderRadius: 12 }} src={media.src} /> : <video preload="metadata" autoPlay={showComments} style={{ border: '1px solid var(--ion-color-light-tint)', minHeight: '100%', width: '100%', borderRadius: 10 }} controls src={media.src + '#t=0.6'} onPlay={(e: any) => { e.target.currentTime = 0 }} />}
                </div>
            )}
        </IonCardContent>


        {<IonRow className="GPT" style={gptRowStyle}>
            {<IonButton style={{ margin: 0 }} routerDirection="root" color='dark' fill="clear" onMouseDown={() => {
                open((message) => {
                    makeComment(id, message as any)
                }, "", "Comment", id)
            }}>
                <IonIcon color={'medium'} icon={'/icons/msgo.svg'} style={{ height: 18, width: 18 }} />
                <IonText color={'medium'} className="medmum" style={{ fontSize: ".9rem", marginTop: '1px', marginLeft: 4, color: 'var(--ion-color-soft)' }}>
                    {typeof commentCount !== 'undefined' ? commentCount + newComments : newComments + 0}
                </IonText>
            </IonButton>}
            <IonButton style={{ marginLeft: 0, marginBottom: 0, marginTop: 0 }} color='dark' fill='clear' size='small' onMouseDown={() => {
                setLocalNotif("Copied to share link to clipboard")
                navigator.clipboard.writeText('https://tribe.computer/post/' + id)
            }}>
                {/* <IonIcon icon={'/icons/bookmark.svg'} style={{ height: 18, width: 18 }} /> */}
                <IonIcon icon={'/icons/share.svg'} style={{ height: 19, width: 19, marginTop: 0, marginLeft: '-7px', color: 'var(--ion-color-soft)' }} />
            </IonButton>
            {/* <IonButton style={{ marginLeft: -14, marginBottom: 0, marginTop: 0 }} color='dark' fill='clear' size='small' onMouseDown={() => {
                setLocalNotif("Copied to share link to clipboard")
                navigator.clipboard.writeText('https://tribe.computer/post/' + id)
            }}>
                <IonIcon icon={'/icons/send.svg'} style={{ marginTop: 1, height: 18, width: 18 }} />
                <IonIcon icon={'/icons/se.svg'} style={{ height: 18, width: 18, marginTop: 2, marginLeft: '-7px', color: 'var(--ion-color-soft)' }} />
            </IonButton> */}
            {/* <IonButton style={{ marginLeft: 0, marginBottom: 0, marginTop: 0 }} color='dark' fill='clear' size='small' onMouseDown={() => {
                setLocalNotif("Copied to share link to clipboard")
                navigator.clipboard.writeText('https://tribe.computer/post/' + id)
            }}>
                <IonIcon icon={'/icons/share.svg'} style={{ height: 19, width: 19 }} />
                <IonIcon icon={'/icons/se.svg'} style={{ height: 18, width: 18, marginTop: 2, marginLeft: '-7px', color: 'var(--ion-color-soft)' }} />
            </IonButton> */}
            <div style={{ marginLeft: '25%', marginRight: -2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <IonButton className="do-not-navigate" fill='clear' onPointerDown={() => handleVote(id, uid, true)} color={typeof voted === 'undefined' || voted === null || voted === -1 ? 'medium' : 'tribe'}>
    <IonIcon icon={typeof voted === 'undefined' || voted === null || voted === -1 ? '/icons/upGRE.svg' : '/icons/upOR.svg'} style={{ marginRight: -12, marginLeft: 0, height: 30, width: 30 }} />
</IonButton>

<IonLabel style={{
    fontSize: '1.05rem', width: 24, paddingBottom: 2, alignItems: "middle", textAlign: 'center', fontVariantNumeric: 'tabular-nums'
}} >
    <IonText color={typeof voted !== 'undefined' && voted !== null && voted === -1 ? 'tribe' : 'medium'} className='heavy ion-text-center'>{score} </IonText>
</IonLabel>

<IonButton className="do-not-navigate" fill='clear' onPointerDown={() => handleVote(id, uid, false)} color={typeof voted !== 'undefined' && voted !== null && voted === -1 ? 'tribe' : 'medium'} >
    <IonIcon icon={typeof voted !== 'undefined' && voted !== null && voted === -1 ? '/icons/downRE.svg' : '/icons/downGRE.svg'} style={{ marginLeft: -12, height: 30, width: 30 }} />
</IonButton>

            </div>
        </IonRow>}
        {showComments && <CommentList offset total={commentCount || 0} uid={uid} postId={id} amount={commentCount} />}

    </IonCard>
    </div>
    )
}