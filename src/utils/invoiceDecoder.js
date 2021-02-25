import bolt11 from '@boltz/bolt11';

export const decodeInvoice = (invoice) => {
    const decoded = bolt11.decode(invoice);
  
    let payment_hash;
    let routing_info;
  
    for (const tag of decoded.tags) {
      switch (tag.tagName) {
        case 'payment_hash':
            payment_hash = tag.data;
            break;
    
        case 'routing_info':
            routing_info = tag.data;
            break;

        default:
            break;
      }
    }
  
    return {
      ...decoded,
      paymentHash: payment_hash,
      routingInfo: routing_info,
      satoshis: decoded.satoshis || 0,
    };
};

const getUnixTime = () => {
    return Math.round(new Date().getTime() / 1000);
};

export const timeUntilExpiry = (invoice) => {
    const decoded = bolt11.decode(invoice);

    let invoiceExpiry = decoded.timestamp || 0;

    if (decoded.timeExpireDate) {
      invoiceExpiry = decoded.timeExpireDate;
    } else {
      // Default invoice timeout
      // Reference: https://github.com/lightningnetwork/lightning-rfc/blob/master/11-payment-encoding.md#tagged-fields
      invoiceExpiry += 3600;
    }

    return invoiceExpiry - getUnixTime();
};
