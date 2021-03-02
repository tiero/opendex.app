import React from 'react';
import svgIcons from '../../utils/svgIcons';

const TextInfo = (props) => {
    const { label, value, explanation = false, onMouseEnterHandler, onMouseLeaveHandler } = props;
    return (
       <div className="textinfo">
            <div className="textinfo-label">
                {label}
                {explanation && <img className='question-icon' src={svgIcons.questionIcon} alt='question-icon' onMouseEnter={onMouseEnterHandler} onMouseLeave={onMouseLeaveHandler} />}
            </div>
            <div className="textinfo-value">{value}</div>
       </div>
    )
}

export default TextInfo;
