import React from 'react';
import currencyIcons from '../assets/images/currencies';

const getCurrencyLabel = (text, icon) => {
    return (
        <>
            <span className="label-icon"><img src={currencyIcons[icon]} alt={text} /></span>
            <span>{text}</span>
        </>
    )
}

export default getCurrencyLabel;