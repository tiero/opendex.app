import { combineReducers } from 'redux';
import { refundReducer } from './services/refund/refundDuck';
import { reverseReducer } from './services/reverse/reverseDuck';
import { ethereumReducer } from './services/ethereum/ethereumDuck';
import { submarineReducer } from './services/submarine/submarineDuck';

export default combineReducers({
    refundReducer,
    reverseReducer,
    ethereumReducer,
    submarineReducer,
});
