import React, { useEffect, useRef } from 'react';
import svgIcons from '../../utils/svgIcons';
import { hacked } from '../../constants/homepage';
import OvalShape from '../../components/OvalShape';

export default () => {
    const chartEle = useRef(null);

    useEffect(() => {
        const chart = chartEle.current;
        const middle = chart.children[Math.floor(chart.childElementCount/2)];
        const scrollLeft = middle.offsetLeft - (chart.offsetWidth - middle.offsetWidth/2)/2;
        chart.scrollTo(scrollLeft, 0);
    }, []);
    return (<div className={'homepage__footer'}>
        <div className="footer-top">
            <OvalShape top={'50%'} left={'-12px'} className="vertical" />
            <img src={svgIcons.hacked} alt="" className="hacked" />
            <h2 className={'footer-title'}>
                Don't trust exchanges with your money. Some of the biggest exchange hacks of the past:
            </h2>
            <ul className={'chart max-width'} ref={chartEle}>
                {
                    hacked.map(({ name, value, color, height, date }) => (<li key={name}>
                        <h3 style={{ color }} className={'name'}>{name}</h3>
                        <p style={{ color }} className={'date'}>{date}</p>
                        <p className={'value'} style={{ height, 'background': color}}>
                            {value}
                        </p>
                    </li>))
                }
            </ul>
        </div>
        <div className="footer-bottom">
            <OvalShape top={'50%'} right={'-11px'} className="vertical" />
            <div className={'contact'}>
                <div className={'social-media-links'}>
                    <h4>Follow us on social media</h4>
                    <div className="links-wrapper">
                        <a href="https://medium.com/boltzhq" target="_blank" rel="noopener noreferrer">
                            <img src={svgIcons.medium} alt="medium" />
                        </a>
                        <a href="https://discord.gg/QBvZGcW" target="_blank" rel="noopener noreferrer">
                            <img src={svgIcons.media} alt="discord" />
                        </a>
                        <a href="https://twitter.com/Boltzhq" target="_blank" rel="noopener noreferrer">
                            <img src={svgIcons.twitter} alt="twitter" />
                        </a>
                    </div>
                </div>
                {/* <div className="newsletter">
                    <h4>Subscribe to our newsletter</h4>
                    <Paper component="form" className={'email-wrapper'}>
                        <InputBase
                            placeholder="jhon@wick.co"
                        />
                        <Button color="primary" className={'subscribe-btn'} >
                            Subscribe
                            <img src={svgIcons.rightArrow} />
                        </Button>
                    </Paper>
                </div> */}
            </div>
        </div>
        <img src={svgIcons.logo} className={"logo"} alt="" />
    </div>);
}
