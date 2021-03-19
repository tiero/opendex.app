import { TextField } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import React from 'react';
import { CurrencyOptions } from '../../constants/swap';
import SelectComponent from '../Select';

const useStyles = makeStyles(() =>
  createStyles({
    selectAsset: {
      width: '8rem',
      '& .MuiSelect-select:focus': {
        'background-color': 'inherit',
      },
      '& .MuiSelect-root': {
        display: 'flex',
        alignItems: 'center',
      },
    },
  })
);

const AssetSelector = props => {
  const classes = useStyles();
  const {
    label,
    value,
    onAmountChange,
    onKeyPress,
    onAssetChange,
    selectedAsset,
    loading,
  } = props;

  return loading ? (
    <Skeleton variant="text" height={58} animation={'wave'} />
  ) : (
    <TextField
      label={label}
      value={value}
      onChange={onAmountChange}
      type="number"
      onKeyPress={onKeyPress}
      autoFocus
      fullWidth
      InputProps={{
        endAdornment: (
          <SelectComponent
            disableUnderline
            className={classes.selectAsset}
            options={CurrencyOptions}
            onChange={onAssetChange}
            value={selectedAsset}
          />
        ),
      }}
    />
  );
};

export default AssetSelector;
