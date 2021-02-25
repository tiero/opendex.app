import ChooseSwap from '../views/refund/chooseSwap';
import CheckStatus from '../views/refund/checkStatus';
import Refund from '../views/refund/refund';

export const refundSteps = [
    {
        key: 0,
        label: 'Choose Swap',
        component: ChooseSwap
    },
    {
        key: 1,
        label: 'Check Status',
        component: CheckStatus
    },
    {
        key: 2,
        label: 'Refund',
        component: Refund
    },
];
