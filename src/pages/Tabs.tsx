import { Redirect, Route } from 'react-router-dom';
import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle } from 'ionicons/icons';
import Activity from './Activity';
import Chat from './Chat';
import Discover from './Discover';
import Member from './Member';
import Posts from './Posts';
import Room from './Room';
import Watchlist from './Watchlist';
import Transaction from './Transaction';
import Account from './Account';

const Tabs: React.FC = () => (
    <IonTabs>
        <IonRouterOutlet>
            <Route exact path="/discover" component={Discover} />
            <Route exact path="/trade/:hash" component={Transaction} />
            <Route path="/chat" component={Chat} />
            <Route exact path="/room/:address" component={Room} />
            <Route path="/watchlist" component={Watchlist} exact />
            <Route path="/activity" component={Activity} exact />
            <Route path="/account" component={Account} />
            <Route path="/" component={Posts} exact />
            <Route path="/member/:address" exact component={Member} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
            <IonTabButton tab="account" href="/account">
                Account
            </IonTabButton>
            <IonTabButton tab="tab3" href="/activity">
                <IonLabel>Activity</IonLabel>
            </IonTabButton>
        </IonTabBar>
    </IonTabs>
);

export default Tabs;