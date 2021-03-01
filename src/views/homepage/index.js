import React, { useContext } from 'react';
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import NavBar from './navbar';
import { connectWeb3Modal } from '../../utils/web3modal';
import { UtilsContext } from '../../context/UtilsContext';
import { StepsContext } from '../../context/StepsContext';
import { LocalStorageState } from '../../constants/environment';
import { isEthereumCurrencyType } from '../../constants/submarine';
import { selectContracts } from '../../services/submarine/submarineSelectors';
import * as submarineActionCreators from '../../services/submarine/submarineDuck';
import * as reverseSubmarineActionCreators from '../../services/reverse/reverseDuck';


export default (props) => {
    const history = useHistory();
    const dispatch = useDispatch();

    const utilsContext = useContext(UtilsContext);
    const isMobileView = !!utilsContext?.isMobileView;

    const contractAddresses = useSelector(selectContracts);

    if (history?.location?.pathname === '/swapbox' && !isMobileView) {
        history.push('/');
    }

    const stepsContext = useContext(StepsContext);
    const { setSubmarineActiveStep, setReverseActiveStep } = stepsContext;
    const activeSwap = localStorage.getItem(LocalStorageState.ActiveSwap);

    const currentSubmarineState = JSON.parse(localStorage.getItem(LocalStorageState.CurrentSubmarineState));

    if (activeSwap === 'submarine') {
        submarineActionCreators.checkCurrentSwap(currentSubmarineState.swapDetails.data, dispatch, () => {setSubmarineActiveStep(3)});
        setSubmarineActiveStep(2);

    } else if (activeSwap === 'reverse') {
        const currentReverseState = JSON.parse(localStorage.getItem(LocalStorageState.CurrentReverseState));
        const extraDetails = JSON.parse(localStorage.getItem(LocalStorageState.ExtraDetails));

        // Get a signer again if it is needed for the claim transaction
        if (isEthereumCurrencyType(currentSubmarineState.receiveCurrency.type)) {
            connectWeb3Modal(contractAddresses.ethereum.network).then((signer) => {
                submarineActionCreators.checkCurrentSwap(currentReverseState.swapDetails, dispatch, () => { setReverseActiveStep(3) }, reverseSubmarineActionCreators.handleReverseSwapStatus(extraDetails, signer));
            });
        } else {
            submarineActionCreators.checkCurrentSwap(currentReverseState.swapDetails, dispatch, () => { setReverseActiveStep(3) }, reverseSubmarineActionCreators.handleReverseSwapStatus(extraDetails, undefined));
        }

        history.push({
            pathname: '/reverse',
            state: isMobileView ? { isDrawerOpen: true } : {}
        });
        setReverseActiveStep(2);
    }

    return (
        <div className={`homepage ${isMobileView ? 'mobile-view' : ''}`}>
            <NavBar />
            <hr className={'separator'} />
            {props.children}
        </div>
    );
}
