import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Button, Divider } from '@material-ui/core';
import svgIcons from '../../utils/svgIcons';
import { clearRefundState } from "../../services/refund/refundDuck";
import { selectSwapId, selectError } from '../../services/refund/refundSelectors';

const Status = ({ handleNextStep }) => {
    const dispatch = useDispatch();
    const swapId = useSelector(selectSwapId);
    const error = useSelector(selectError);

    const nextStepHandler = () => {
        dispatch(clearRefundState());
        handleNextStep();
    }

    return (<div className="refund__success">
            <img src={error ? svgIcons.snap : svgIcons.greenTick} alt="" />
            <Typography
                variant="div"
                component="h2"
                align="center"
                className="refund__success-header"
            >
                {!error && `Successfully refunded Swap ${swapId}`}
                {!!error && `${error}`}
            </Typography>
            <div className="refund__success-footer">
                <Divider />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={nextStepHandler}
                    className="next-step-button"
                >Refund again</Button>
            </div>
        </div>
    );
}

export default Status;
