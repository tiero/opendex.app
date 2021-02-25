import Submarine from '../../views/submarine';
import Refund from '../../views/refund';
import Reverse from '../../views/reverse';

const routes = [
    {
        path: '/',
        exact: true,
        strict: true,
        name: 'Submarine',
        component: Submarine
    },
    {
        path: '/refund',
        exact: true,
        strict: true,
        name: 'Refund',
        component: Refund
    },
    {
        path: '/reverse',
        exact: true,
        strict: true,
        name: 'Reverse',
        component: Reverse
    },
    {
        path: '/swapbox',
        exact: true,
        strict: true,
        name: 'Submarine',
        component: Submarine
    },
];

export default routes;