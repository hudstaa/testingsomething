import { Route } from 'react-router-dom';
import {
  IonApp,
  IonPage,
  IonRouterOutlet,
  setupIonicReact
} from '@ionic/react';
import { IonReactHashRouter } from '@ionic/react-router';
import { PrivyWagmiConnector } from '@privy-io/wagmi-connector';


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
// import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Discover from './pages/Discover';
import Watchlist from './pages/Watchlist';
import Chat from './pages/Chat';
import Activity from './pages/Activity';
import { PrivyProvider } from '@privy-io/react-auth';
import Room from './pages/Room';
import Transaction from './pages/Transaction';
import { configureChains, createConfig, createStorage } from 'wagmi';
import { baseGoerli } from 'viem/chains';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { InjectedConnector } from 'wagmi/connectors/injected';
import Member from './pages/Member';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

setupIonicReact({
  rippleEffect: true,
  mode: 'ios',
  swipeBackEnabled: false,
  navAnimation: undefined,
  animated: false
});
const { chains, publicClient } = configureChains(
  [baseGoerli],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: 'https://base-goerli.publicnode.com',
      }),
    }),
  ],
)
export const noopStorage = {
  getItem: (_key: any) => '',
  setItem: (_key: any, _value: any) => null,
  removeItem: (_key: any) => null,
}

import Splash from './pages/Splash';

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

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { OnBoarding } from './pages/OnBoarding';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { useEffect } from 'react';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
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
const analytics = getAnalytics(app);
export const messaging = getMessaging(app);
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

const App: React.FC = () => {
  useEffect(() => {
    onMessage(messaging, (payload) => {
      new Notification(payload.notification?.title || payload.from, payload.notification)
    });
  }, [])
  return <IonApp >
    <PrivyProvider appId={'clndg2dmf003vjr0f8diqym7h'} config={{ appearance: { theme: "dark" }, additionalChains: [baseGoerli], loginMethods: ['twitter', 'email'] }} >
      <PrivyWagmiConnector wagmiChainsConfig={config as any}>
        <ApolloProvider client={graphQLclient}>

          <IonReactHashRouter >
            <IonRouterOutlet>
              <Route exact path="/discover">
                <Discover />
              </Route>
              <Route exact path="/trade/:hash">
                <Transaction />
              </Route>
              <Route exact path="/chat">
                <Chat />
              </Route>
              <Route exact path="/room/:address">
                <Room />
              </Route>
              <Route path="/watchlist">
                <Watchlist />
              </Route>
              <Route path="/activity">
                <Activity />
              </Route>
              <Route path="/" exact>
                <Splash />
              </Route>
              <Route path="/member/:address" exact>
                <Member />
              </Route>
            </IonRouterOutlet>
          </IonReactHashRouter>
        </ApolloProvider>
      </PrivyWagmiConnector>
    </PrivyProvider>
  </IonApp >
};

export default App;
