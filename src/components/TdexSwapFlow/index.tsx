import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { RootState } from '../../store';

import TdexSteps from './components/steps';
import Connect from './components/connect';
import Review from './components/review';
import Summary from './components/summary';


import { createStyles, makeStyles } from '@material-ui/core/styles';

interface Props { }

const useStyles = makeStyles((theme) =>
  createStyles({
    wrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      marginTop: '1rem',
      marginBottom: '1rem',
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  })
);

const steps = ["Connect", "Review & Confirm", "Summary"];

const TdexSwapFlow: React.FC<Props> = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);

  const {
    baseAmount,
    baseAsset,
    quoteAmount,
    quoteAsset
  } = useAppSelector((state: RootState) => state.swaps);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const getStepContent = () => {
    switch (activeStep) {
      case 0:
        return <Connect onConnect={handleNext} />
      case 1:
        return <Review onConfirm={handleNext} onReject={handleReset} />;
      case 2:
        return <Summary success={true} />
      default:
        return null;
    }
  }

  console.log(baseAmount, baseAsset, quoteAmount, quoteAsset)
  return (
    <div className={classes.wrapper}>
      <TdexSteps steps={steps} activeStep={activeStep} />
      <div>
        {getStepContent()}
      </div>
    </div>
  );

};

export default TdexSwapFlow;
