import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactHashRouter } from '@ionic/react-router';
import { PrivyWagmiConnector } from '@privy-io/wagmi-connector';
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
import { PrivyProvider, usePrivy } from '@privy-io/react-auth';
import { base, baseGoerli } from 'viem/chains';
import { configureChains, createConfig, createStorage } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { publicProvider } from 'wagmi/providers/public';
import Activity from './pages/Activity';
import Chat from './pages/Chat';
import Discover from './pages/Discover';
import Member from './pages/Member';
import Room from './pages/Room';
import Transaction from './pages/Transaction';
import Watchlist from './pages/Watchlist';
import './theme/variables.css';
import { App as CapacitorApp } from '@capacitor/app';



setupIonicReact({
  rippleEffect: true,
  mode: 'ios',
  animated: false
});
const { chains, publicClient } = configureChains(
  [baseGoerli, base],
  [
    publicProvider()
  ],
)
export const noopStorage = {
  getItem: (_key: any) => '',
  setItem: (_key: any, _value: any) => null,
  removeItem: (_key: any) => null,
}

import Posts from './pages/Posts';

const storage = createStorage({
  storage: noopStorage,
})


const config = createConfig({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  publicClient: publicClient as any,
  storage
})

export const graphQLclient = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/44847/tribe-testnet/version/latest',
  cache: new InMemoryCache({ resultCaching: false })
});

import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { albumsOutline, bodyOutline, chatbubbleOutline, compass, home, homeOutline, paperPlane, peopleOutline, person, pulseOutline } from 'ionicons/icons';
import Account from './pages/Account';
import { MobileAuth } from './pages/MobileAuth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { useEffect } from 'react';
import axios from 'axios';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { Browser } from '@capacitor/browser';
import Post from './pages/Post';
import { nativeAuth } from './lib/sugar';
import NewPost from './pages/NewPost';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDxF1oqe-dYKjslxJhs49qf8QFl2DhPZW8",
  authDomain: "tribal-pass.firebaseapp.com",
  projectId: "tribal-pass",
  storageBucket: "tribal-pass.appspot.com",
  messagingSenderId: "1053855163428",
  appId: "1:1053855163428:web:e27fdb0e300166ac0b24b1",
  measurementId: "G-CZQ06R7KZ2"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
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
  useEffect(() => {
    CapacitorApp.addListener('appUrlOpen', (event) => {
      Browser.close();
      console.log("GOT IT!")
      const auth = nativeAuth()
      const params = parseTribeURL(event.url);
      const privyToken = params.jwt;
      localStorage.setItem('privy:token', params.token);
      localStorage.setItem('privy:refresh_token', params.refresh);

      axios.post('https://us-central1-tribal-pass.cloudfunctions.net/privyAuth', { token: privyToken }, { headers: { Authorization: 'Bearer ' + privyToken } }).then((res) => {
        signInWithCustomToken(auth, res.data.authToken).then((e) => {
          console.log(e, "SIGNED IN");
          window.location.reload();
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

const App: React.FC = () => {

  return <IonApp>
    <PrivyProvider appId={'clndg2dmf003vjr0f8diqym7h'} config={{ appearance: { theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light' }, additionalChains: [base], loginMethods: ['twitter', 'email'] }} >
      <PrivyWagmiConnector wagmiChainsConfig={config as any}>
        <ApolloProvider client={graphQLclient}>
          <DeepLinkProvider />
          <IonReactHashRouter >
            <IonTabs>
              <IonRouterOutlet>
                <Redirect exact path="/" to='/posts' />
                <Route exact path="/trade/:hash">
                  <Transaction />
                </Route>
                <Route exact path="/chat">
                  <Chat />
                </Route>
                <Route exact path="/chat/:address">
                  <Room />
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
                <Route path="/posts/" exact>
                  <Posts />
                </Route>
                <Route path="/posts/:id" exact>
                  <Post />
                </Route>
                <Route path="/auth" exact>
                  <MobileAuth />
                </Route>
                <Route path="/member/:address" exact>
                  <Member />
                </Route>
                <Route path="/member/" exact>
                  <Discover />
                </Route>
              </IonRouterOutlet>

              <IonTabBar color='tribe' slot="bottom">

                <IonTabButton tab="posts" href="/posts" >
                  <IonIcon icon={home} />
                </IonTabButton>
                <IonTabButton tab="member" href="/member">
                  <IonIcon icon={compass} />
                </IonTabButton>
                <IonTabButton tab="chat" href="/chat">
                  <IonIcon icon={paperPlane} />
                </IonTabButton>
                <IonTabButton tab="account" href="/account">
                  <IonIcon icon={person} />
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
