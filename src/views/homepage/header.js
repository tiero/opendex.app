import React, { useState, useEffect, useContext } from 'react';
import ReactPlayer from "react-player";
import svgIcons from '../../utils/svgIcons';
import Modal from '../../components/Modal';
import OvalShape from '../../components/OvalShape';
import { demoVideoUrl } from '../../constants/environment';
import { UtilsContext } from '../../context/UtilsContext';

export default () => {
    const [openModal, setOpenModal] = useState(false);
    const utilsContext = useContext(UtilsContext);
    const isMobileView = !!utilsContext?.isMobileView;
    const reactPlayerSize = isMobileView ? {
        width: '100%',
        height: '100%'
    } : {};

    useEffect(() => {
        setTimeout(() => {
            document.body.style.overflow = openModal ? 'hidden' : 'auto';
        }, 0);
    }, [openModal]);

    const onDemoClick = (e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        setOpenModal(true);
    }
    const onDemoClose = () => setOpenModal(false);

    return (<div className={'homepage__header'}>
        <div className={'homepage__header-container'}>
            <div className="header-bg-container" />
            <div className={'header-top'}>
                <OvalShape top={'-2px'} left={'40%'} />
                <OvalShape bottom={'-3px'} left={'40%'} className="reverse" />
                <h2 className={'header-title max-width-margin-left'}>
                    Privacy first, account-free crypto exchange
                </h2>
                <div className={'sub-heading max-width-margin-left'}>
                    Trading shouldn't require an account. Your money remains in your control, at all times.
                </div>
            </div>
            <div className={'header-bottom'}>
                <OvalShape top={'50%'} left={'-11px'} className="vertical" />
                <section className={'features-list max-width-margin-left'}>
                    <article>
                        <p>
                            <img src={svgIcons.fast} alt="" />
                            <span className={'highlight'}>We're fast</span>
                        </p>
                        <h3>Built on Lightning</h3>
                        <p>
                            Boltz focuses on the adoption of second layer scaling technology like the lightning network.
                        </p>
                    </article>
                    <article>
                        <p>
                            <img src={svgIcons.safe} alt="" />
                            <span className={'highlight'}>We're safe</span>
                        </p>
                        <h3>We don't collect any data</h3>
                        <p>
                            Boltz does not and will never collect any data that could identify our users.
                        </p>
                    </article>
                </section>
                <div className={'demo-container max-width-margin-left'} onClick={onDemoClick}>
                </div>
                <div className={'max-width-margin-left'}>
                    <ReactPlayer
                        url={demoVideoUrl}
                        width="230px"
                        height="130px"
                        light
                    />
                    <Modal open={openModal} handleClose={onDemoClose} >
                        <ReactPlayer
                            url={demoVideoUrl}
                            {...reactPlayerSize}
                            playing
                        />
                    </Modal>
                </div>
            </div>
        </div>
    </div>);
}
