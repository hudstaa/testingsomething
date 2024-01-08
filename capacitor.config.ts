import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  "appId": "com.tribe.computer",
  "appName": "Tribe",
  "webDir": "dist",
  plugins: {
    CapacitorHttp: {
      enabled: false,
    },
    Keyboard: {
      resizeOnFullScreen: true,
      keyboardResize: 'none'
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  },

  "server": {
    "url": 'https://tribe.computer',
    "hostname": "tribe.computer",
    "androidScheme": "https",
    "iosScheme": 'tribe.computer',
    "allowNavigation": [
      "auth.privy.io",
      'twitter.com',
      "*.privy.io",
      "developers.google.com",
      "developers.google.com",
      "verify.walletconnect.org",
      "https://auth.privy.io/apps/clndg2dmf003vjr0f8diqym7h/embedded-wallets",
      "tribal-pass.web.app",
      "apis.google.com",
      "firestore.googleapis.com",
      "base-goerli.blastapi.io",
      "https://base-goerli.publicnode.com",
      "base-goerli.publicnode.com",
      "mainnet.infura.io",
      "api.studio.thegraph.com",
      "mainnet.base.org",
      "pbs.twimg.com",
      "goerli.base.org",
      "https://goerli.base.org",
      "https://base-goerli.blastapi.io/fe9c30fc-3bc5-4064-91e2-6ab5887f8f4d",
      "us-central1-tribal-pass.cloudfunctions.net",
      "us-central1-remillio-tribe.cloudfunctions.net",
      "*"
    ]
  }

};

export default config;
