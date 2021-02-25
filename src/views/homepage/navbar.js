/* eslint-disable jsx-a11y/anchor-is-valid */
import { useSelector } from 'react-redux';
import Grow from '@material-ui/core/Grow';
import React, { useCallback, useContext, useRef, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Popper from '@material-ui/core/Popper';
import { useHistory } from 'react-router-dom';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import svgIcons from '../../utils/svgIcons';
import confirmAlert from '../../utils/confirmAlert';
import { StepsContext } from '../../context/StepsContext';
import { UtilsContext } from '../../context/UtilsContext';
import { LocalStorageState } from '../../constants/environment';
import { boltzOnion, network, faqUrl } from "../../constants/environment";
import { selectSendCurrency} from '../../services/submarine/submarineSelectors';

export default () => {
    const history = useHistory();
    const isRefund = history?.location?.pathname === '/refund';

    const [open, setOpen] = useState(false);

    const anchorRef = useRef(null);

    const {
        setReverseActiveStep,
        setSubmarineActiveStep,
        setRefundActiveStep
    } = useContext(StepsContext);
    const utilsContext = useContext(UtilsContext);
    const isMobileView = !!utilsContext?.isMobileView;

    const sendCurrency = useSelector(selectSendCurrency);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    const onLogoClick = () => {
        if ((sendCurrency && confirmAlert()) || !sendCurrency) {
            history.push('/');
            setReverseActiveStep(1);
            setSubmarineActiveStep(0);
            setRefundActiveStep(0);
            localStorage.removeItem(LocalStorageState.ActiveSwap);
            localStorage.removeItem(LocalStorageState.ExtraDetails);
            localStorage.removeItem(LocalStorageState.CurrentSubmarineState);
            localStorage.removeItem(LocalStorageState.CurrentReverseState);
        }
    }

    const onMenuItemClick = useCallback((path) => () => {
        history.push(path);
    }, [history])

    const getNavBarLinks = () => ([
        <a href="https://docs.boltz.exchange/en/latest" target="_blank" rel="noopener noreferrer">Developers</a>,
        <a href={boltzOnion} target="_blank" rel="noopener noreferrer">Onion</a>,
        <a href="https://github.com/BoltzExchange/" target="_blank" rel="noopener noreferrer">Github</a>,
        <a href={faqUrl} target="_blank" rel="noopener noreferrer">F.A.Q.</a>,
    ])

    return (
        <div className={'homepage__nav-bar'}>
            <div className={'logo-wrapper'} onClick={onLogoClick}>
                <img src={svgIcons.logo} alt="" />
                <img src={svgIcons.boltz} alt="" />
                <span className={'network'} style={{ visibility: network === 'mainnet' ? 'hidden' : 'visible' }}>{network.toUpperCase()}</span>
            </div>
            { !isMobileView ? (
                <ul className={'nav-bar-links'}>
                    {getNavBarLinks().map((link) => (<li> {link} </li>))}
                </ul>
            ) : null}
            { isMobileView && (
                <div className="mobile-view-menu">
                    <Button
                        ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        onClick={handleToggle}
                    >
                        {open && <img src={svgIcons.close} alt="" />}
                        {!open && <img src={svgIcons.hamburger} alt="" />}
                    </Button>
                    <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal className="menu-popup">
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                            >
                            <Paper>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                        {isRefund ? <MenuItem onClick={handleClose}><a onClick={onMenuItemClick('/')}>Swap</a></MenuItem> : <MenuItem onClick={handleClose}><a onClick={onMenuItemClick('/refund')}>Refund</a></MenuItem>}
                                        {getNavBarLinks().map((link) => (<MenuItem key={link} onClick={handleClose}> {link} </MenuItem>))}
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                            </Grow>
                        )}
                    </Popper>
                </div>
            )}
        </div>
    );
}
