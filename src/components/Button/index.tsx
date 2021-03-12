import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  makeStyles,
} from '@material-ui/core';
import React, { ReactElement } from 'react';

export type ButtonProps = MuiButtonProps;

const isDefaultColor = (props: ButtonProps): boolean =>
  !props.color || props.color === 'default';

const useStyles = makeStyles(theme => ({
  button: (props: ButtonProps) => ({
    borderRadius: 0,
    backgroundColor:
      isDefaultColor(props) && props.variant === 'contained'
        ? 'rgba(255, 255, 255, 0.05)'
        : undefined,
    '&:hover': {
      backgroundColor: isDefaultColor(props)
        ? 'rgba(255, 255, 255, 0.07)'
        : undefined,
    },
    color: isDefaultColor(props) ? theme.palette.text.primary : undefined,
  }),
}));

const Button = (props: ButtonProps): ReactElement => {
  const { className, ...muiButtonProps } = props;
  const classes = useStyles(props);
  const buttonClass = `${classes.button} ${className}`;

  return (
    <MuiButton disableElevation className={buttonClass} {...muiButtonProps} />
  );
};

export default Button;
