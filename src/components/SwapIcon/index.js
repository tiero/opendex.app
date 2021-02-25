import React from 'react';
import svgIcons from '../../utils/svgIcons';
import './styles.scss';

const SwapIcon = ({ onClick, className }) => {
    return (
        <div className={`swap-icons ${className}`} onClick={onClick}>
            <img src={svgIcons.rightArrowPlain} alt="" />
            <img src={svgIcons.leftArrow} alt="" />
        </div>
    )
}

export default SwapIcon;