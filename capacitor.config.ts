import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  "appId": "com.tribe.computer",
  "appName": "Tribe",
  "webDir": "dist",
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
  "server": {
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
      "tribal-pass.web.app",
      "apis.google.com",
      "firestore.googleapis.com",
      "base-goerli.blastapi.io",
      "mainnet.infura.io",
      "api.studio.thegraph.com",
      "mainnet.base.org",
      "pbs.twimg.com",
      "us-central1-tribal-pass.cloudfunctions.net",
      "*"
    ]
  }

};

export default config;
