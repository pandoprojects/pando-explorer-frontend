import React from "react";
import './Pages.css';
import { Route, Redirect, Switch } from "react-router-dom";
import WalletPage from './pages/WalletPage'
import SettingsPage from './pages/SettingsPage'
import OnboardingPage from './pages/OnboardingPage'
import CreateWalletPage from './pages/CreateWalletPage'
import UnlockWalletPage from './pages/UnlockWalletPage'
import StakesPage from './pages/StakesPage'
import RewardsPage from './pages/RewardsPage'
import Wallet from './services/Wallet'
import OfflinePage from "./pages/OfflinePage";
import ContractPage from "./pages/ContractPage";
import ContractModes from "./constants/ContractModes";
import TransactionHistory from './pages/transaction-history'


export class Pages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };
    }
    render() {
      
        setTimeout(()=>{
            this.setState({isLoading:true});
             console.clear();
        },1000)
        return (
            
            <div>
              
                    <div className="Pages">
                        <Switch>
                            <Redirect from='/onboarding' to='/onboarding/0' exact={true} />
                            <Route path="/onboarding/:onboardingStep" component={OnboardingPage} />
                        </Switch>

                        <Route path="/create" component={CreateWalletPage} />

                        <Switch>
                            <Redirect from='/unlock' to='/unlock/keystore-file' exact={true} />
                            <Route path="/unlock/:unlockStrategy" component={UnlockWalletPage} />
                        </Switch>

                        <Route path="/offline" component={OfflinePage} />
                    </div>
                 
                 {!this.state.isLoading &&
                    <div className="spinnerss">
                        <img src="/img/Pd-loader-1.gif" />
                    </div>
                 }
            </div>
            
        );
    }
}

export class WalletPages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };
    }
    render() {
        const { t } = this.props;
        setTimeout(()=>{
            this.setState({isLoading:true});
            //  console.clear();
        },1000)
        return (
            <div>
               
                    <div className="Pages Pages--wallet">
                        <Switch>
                            {
                                Wallet.unlocked() === false && <Redirect to='/unlock' />
                                
                            }
                            <Redirect from='/wallet/contract/' to={('/wallet/contract/' + ContractModes.DEPLOY)} exact={true} />
                            <Route path="/wallet/contract/:contractMode" component={ContractPage} />

                            <Route path="/wallet/settings" component={SettingsPage} />
                            <Route path="/wallet/transaction-history" component={TransactionHistory}></Route>

                            <Route path="/wallet/stakes" component={StakesPage} ></Route>
                            <Route path="/wallet/rewards" component={RewardsPage} ></Route>

                            <Redirect from='/wallet' to='/wallet/tokens/pando' exact={true} />
                            <Redirect from='/wallet/tokens' to='/wallet/tokens/pando' exact={true} />
                            <Route path="/wallet/tokens/:tokenType" component={WalletPage} />

                            {/* <Route path="/offline" component={OfflinePage} /> */}
                        </Switch>
                     </div>
             
              {!this.state.isLoading &&
                    <div className="spinnerss">
                         <img src="/img/Pd-loader-1.gif" />
                    </div>
                      
                 }
            </div>
            
        );
    }
}
