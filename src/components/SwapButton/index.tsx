import React, { ReactElement } from 'react';
import svgIcons from '../../utils/svgIcons';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

export type SwapButtonProps = {
  onClick: () => void;
};

const useStyles = makeStyles(() =>
  createStyles({
    wrapper: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '1rem',
      marginBottom: '1rem',
    },
    button: {
      width: 48,
      minWidth: 48,
      height: 48,
      padding: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: 0,
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.07)',
      },
    },
    icon: {
      transform: 'rotate(270deg)',
      margin: -3,
    },
    upIcon: {
      opacity: 0.4,
    },
  })
);

const SwapButton = ({ onClick }: SwapButtonProps): ReactElement => {
  const classes = useStyles();

  const upIconClass = `${classes.icon} ${classes.upIcon}`;

  return (
    <div className={classes.wrapper} onClick={onClick}>
      <Button variant="contained" disableElevation className={classes.button}>
        <img
          src={svgIcons.rightArrowPlain}
          alt="Icon Up"
          className={upIconClass}
        />
        <img
          src={svgIcons.leftArrow}
          alt="Icon Down"
          className={classes.icon}
        />
      </Button>
    </div>
  );
};

export default SwapButton;
