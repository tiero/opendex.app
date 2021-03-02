import React from 'react';
import svgIcons from '../../utils/svgIcons';

const SwapIcon = ({ onClick }) => {
    return (
        <div onClick={onClick}>
            <img src={svgIcons.rightArrowPlain} alt="Icon Right" />
            <img src={svgIcons.leftArrow} alt="Icon Left" />
        </div>
    )
}

export default SwapIcon;
