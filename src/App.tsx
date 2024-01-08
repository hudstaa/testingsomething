import {
  IonApp,
  IonBadge,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactHashRouter } from '@ionic/react-router';
import { PrivyWagmiConnector, usePrivyWagmi } from '@privy-io/wagmi-connector';
import { Redirect, Route } from 'react-router-dom';


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/text-alignment.css';
// import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/flex-utils.css';

/* Theme variables */
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { App as CapacitorApp } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { ActionPerformed, PushNotificationSchema, PushNotifications, Token } from '@capacitor/push-notifications';
import { PrivyProvider, useWallets } from '@privy-io/react-auth';
import axios from 'axios';
import { initializeApp } from "firebase/app";
import { signInWithCustomToken } from 'firebase/auth';
import { useEffect } from 'react';
import { base, baseGoerli } from 'viem/chains';
import { configureChains, createConfig, createStorage, useChainId } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { useNotifications } from './hooks/useNotifications';
import useTabs from './hooks/useTabVisibility';
import { nativeAuth } from './lib/sugar';
import Account from './pages/Account';
import Activity from './pages/Activity';
import Chat from './pages/Chat';
import Discover from './pages/Discover';
import Member from './pages/Member';
import { MobileAuth } from './pages/MobileAuth';
import Post from './pages/Post';
import Room from './pages/Room';
import Swap from './pages/Swap';
import Trade from './pages/Trade';
import Transaction from './pages/Transaction';
import Watchlist from './pages/Watchlist';
import './theme/variables.css';


setupIonicReact({
  rippleEffect: false,
  swipeBackEnabled: false,
  mode: 'ios',
});
const { chains, publicClient } = configureChains(
  [baseGoerli],
  [alchemyProvider({ apiKey: 'Tl5Ee2UY1CrR7ZIatURvZiwtrOaCiB7p' }),
  jsonRpcProvider({
    rpc: (chain) => ({
      http: `https://base-goerli.publicnode.com`,
      webSocket: 'wss://base-goerli.publicnode.com'
    }),
  }),
  ],
)
export const noopStorage = {
  getItem: (_key: any) => '',
  setItem: (_key: any, _value: any) => null,
  removeItem: (_key: any) => null,
}

import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { NotificationsProvider } from './components/NotificationsProvider';
import { ShowMemberModalProvider } from './components/ShowMemberModalProvider';
import { TradeMobile } from './components/Trade';
import { WriteMessageModalProvider } from './components/WriteMessageModalProvider';
import Posts from './pages/Posts';
import { swapHorizontal } from 'ionicons/icons';

const storage = createStorage({
  storage: noopStorage,
})


const config = createConfig({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  publicClient,
  storage
})

export const graphQLclient = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/44847/tribe-testnet/version/latest',
  cache: new InMemoryCache({ resultCaching: false })
});

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4tUN_elLxbAvXcp8z3E0yCXbs-3icr7c",
  authDomain: "remilio-tribe.firebaseapp.com",
  projectId: "remilio-tribe",
  storageBucket: "remilio-tribe.appspot.com",
  messagingSenderId: "856843528994",
  appId: "1:856843528994:web:fe09ef102a85b5fc0e937b",
  measurementId: "G-PN4YGPMWK5"
};
const registerNotifications = async () => {
  if (!Capacitor.isPluginAvailable('PushNotifications')) {
    return;
  };

  let permStatus = await PushNotifications.checkPermissions();

  if (permStatus.receive === 'prompt') {
    permStatus = await PushNotifications.requestPermissions();
  }

  if (permStatus.receive === 'granted') {
    listenForNotifications();
    return;
  } else {
    await PushNotifications.register();
    listenForNotifications();
  }
}
const listenForNotifications = async () => {
  PushNotifications.removeAllDeliveredNotifications();
  PushNotifications.addListener('registration',
    (token: Token) => {
      useNotifications.getState().setToken(token.value);
    }
  );

  // Show us the notification payload if the app is open on our device
  PushNotifications.addListener('pushNotificationReceived',
    (notification: PushNotificationSchema) => {
      alert('Push received: ' + JSON.stringify(notification));
    }
  );

  // Method called when tapping on a notification
  PushNotifications.addListener('pushNotificationActionPerformed',
    (notification: ActionPerformed) => {
      alert('Push action performed: ' + JSON.stringify(notification));
    }
  );
}
registerNotifications();

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
initializeFirestore(app,
  {
    localCache:
      persistentLocalCache({ tabManager: persistentMultipleTabManager() })
  });
// getToken(messaging, { vapidKey: 'BBRZkbpicNkmzSp3m0eSVw2mavWY47hDhEFnq7A0H2xCU7oLxBFcVTV0Ratuwq7MBJEZbA_FdeaVh0SnX_Mdtq0' }).then((currentToken) => {
//   if (currentToken) {
//     // Send the token to your server and update the UI if necessary
//     // ...
//   } else {
//     // Show permission request UI
//     Notification.requestPermission().then(() => {

//     })

//     console.log('No registration token available. Request permission to generate one.');
//     // ...
//   }
// }).catch((err) => {
//   console.log('An error occurred while retrieving token. ', err);
//   // ...
// });


function parseTribeURL(url: string): { token: string, refresh: string, jwt: string } {
  const params = new URL(url).searchParams;

  return {
    token: params.get('token')!,
    refresh: params.get('refresh')!,
    jwt: params.get('jwt')!
  };
}

const DeepLinkProvider: React.FC = () => {
  const { wallet: activeWallet, setActiveWallet, ready: wagmiReady } = usePrivyWagmi();
  const { wallets } = useWallets();
  const chainId = useChainId()
  // const { switchNetwork } = useSwitchNetwork();
  // useEffect(() => {
  //   wallets.forEach((wallet) => {
  //     if (wallet.connectorType === 'embedded') {
  //       // setActiveWallet(wallet);
  //       // switchNetwork && switchNetwork(baseGoerli.id);
  //     }
  //   })
  // }, [wallets, activeWallet]);
  useEffect(() => {
    CapacitorApp.addListener('appUrlOpen', (event) => {
      Browser.close();
      const auth = nativeAuth()
      const params = parseTribeURL(event.url);
      const privyToken = params.jwt;
      localStorage.setItem('privy:token', params.token);
      localStorage.setItem('privy:refresh_token', params.refresh);

      axios.post('https://us-central1-remilio-tribe.cloudfunctions.net/privyAuth', { token: privyToken }, { headers: { Authorization: 'Bearer ' + privyToken } }).then((res) => {
        signInWithCustomToken(auth, res.data.authToken).then((e) => {
        }).catch((e) => {
          console.log('error', e);
        })
      }).catch((err) => {
        console.log('error', err);
      });
    })

  }, [])
  return null;
}

const NotifBadge: React.FC = () => {
  const { notifications } = useNotifications();
  return notifications.length !== 0 ? <IonBadge color='tribe'>
    {notifications.length}
  </IonBadge> : <></>
}

const App: React.FC = () => {
  const { tab } = useTabs();
  const darkmode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return <IonApp>
    <PrivyProvider appId={'clndg2dmf003vjr0f8diqym7h'} config={{ defaultChain: baseGoerli, appearance: { theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light' }, additionalChains: [base], loginMethods: ['twitter', 'email'] }} >
      <PrivyWagmiConnector wagmiChainsConfig={config as any}>
        <ApolloProvider client={graphQLclient}>
          <DeepLinkProvider />
          <WriteMessageModalProvider />
          <IonReactHashRouter  >
            <ShowMemberModalProvider />
            <NotificationsProvider />
            <IonTabs>
              <IonRouterOutlet animated={true} >
                <Route exact path="/channel">
                  <Chat />
                </Route>
                <Route path="/channel/:address">
                  <Room />
                </Route>
                <Route path="/channel/undefined">
                  <Redirect to="/channel" />
                </Route>
                <Route path="/post/:id" exact>
                  <Post />
                </Route>
                <Redirect exact path="/" to='/post' />
                <Route exact path="/trade/:hash">
                  <Transaction />
                </Route>
                <Route path="/watchlist">
                  <Watchlist />
                </Route>
                <Route path="/activity">
                  <Activity />
                </Route>
                <Route path="/account" exact>
                  <Account />
                </Route>
                <Route path="/buy/:address">
                  <TradeMobile />
                </Route>
                <Route path="/post/" exact>
                  <Posts />
                </Route>
                <Route path="/swap" exact>
                  <Swap />
                </Route>
                <Route path="/member/:address/trade" exact>
                  <Trade />
                </Route>

                <Route path="/member/:address" exact>
                  <Member profile={false} />
                </Route>

                <Route path="/auth" exact>
                  <MobileAuth />
                </Route>
                <Route path="/member" exact>
                  <Discover />
                </Route>
              </IonRouterOutlet>

              <IonTabBar style={{ border: '0' }} slot="bottom">
                <IonTabButton tab="post" href="/post">
                  {tab === 'post' ?
                    <IonIcon style={{ filter: darkmode ? 'invert(100%)' : 'invert(100%)' }} icon={'/icons/hme.svg'} />
                    : <IonIcon style={{ filter: darkmode ? 'invert(100%)' : 'invert(100%)' }} icon={'/icons/hme2.svg'} />
                  }
                </IonTabButton>
                <IonTabButton tab="member" href="/member">
                  <IonIcon style={{ filter: darkmode ? 'invert(100%)' : 'invert(100%)' }} icon={tab === 'member' ? '/icons/disco.svg' : '/icons/disco2.svg'} />
                </IonTabButton>
                {/* <IonTabButton tab="swap" href="/swap">
                  <IonIcon style={{ filter: darkmode ? 'invert(100%)' : 'invert(100%)' }} icon={tab === 'channel' ? '/icons/wallet.svg' : '/icons/wallet2.svg'} />
                </IonTabButton> */}
                <IonTabButton tab="channel" href="/channel">
                  <IonIcon style={{ filter: darkmode ? 'invert(100%)' : 'invert(100%)' }} icon={tab === 'channel' ? '/icons/msg.svg' : '/icons/msg2.svg'} />
                </IonTabButton>
                <IonTabButton tab="account" href="/account">
                  <NotifBadge />
                  <IonIcon style={{ filter: darkmode ? 'invert(100%)' : 'invert(100%)' }} icon={tab === 'account' ? '/icons/usr.svg' : '/icons/usr2.svg'} />
                </IonTabButton>
              </IonTabBar>
            </IonTabs>

          </IonReactHashRouter>
        </ApolloProvider>
      </PrivyWagmiConnector>
    </PrivyProvider>
  </IonApp >
};

export default App;