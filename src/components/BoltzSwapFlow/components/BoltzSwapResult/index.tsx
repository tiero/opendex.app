import { createStyles, Grid, makeStyles, Typography } from '@material-ui/core';
import React, { ReactElement } from 'react';
import { useHistory } from 'react-router';
import svgIcons from '../../../../utils/svgIcons';
import { Path } from '../../../App/path';
import Button from '../../../Button';

type BoltzSwapResultProps = {
  errorMessage?: string;
  swapId?: string;
  showRefundButton?: boolean;
};

const useStyles = makeStyles(() =>
  createStyles({
    imageContainer: {
      padding: '2rem',
    },
    refundButton: {
      margin: '2rem 0',
    },
  })
);

const BoltzSwapResult = (props: BoltzSwapResultProps): ReactElement => {
  const classes = useStyles();
  const history = useHistory();
  const { errorMessage, swapId, showRefundButton } = props;

  return (
    <Grid
      item
      container
      justify="center"
      alignItems="center"
      direction="column"
    >
      <Grid item className={classes.imageContainer}>
        {errorMessage ? (
          <img src={svgIcons.snap} alt="aw, snap!" />
        ) : (
          <img src={svgIcons.greenTick} alt="success!" />
        )}
      </Grid>
      <Typography align="center">
        {errorMessage || 'Swap successfully completed!'}
      </Typography>
      {showRefundButton && !!errorMessage && (
        <Button
          variant="outlined"
          size="large"
          color="primary"
          onClick={() => history.push(Path.BOLTZ_REFUND, { swapId: swapId })}
          className={classes.refundButton}
        >
          Refund
        </Button>
      )}
    </Grid>
  );
};

export default BoltzSwapResult;
