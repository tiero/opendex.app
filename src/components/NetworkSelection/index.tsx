import { createStyles, makeStyles } from '@material-ui/core/styles';
import { FormControl, InputLabel, Select } from '@material-ui/core';
import { Network, useNetwork } from '../../context/NetworkContext';

const useStyles = makeStyles(() =>
  createStyles({
    formControl: {
      width: 120,
      margin: '0 auto',
      marginTop: '25px',
      marginBottom: '25px',
    },
    option: {
      margin: '10px',
    },
  }),
);

const NetworkSelection = () => {
  const classes = useStyles();

  const { network, setNetwork } = useNetwork();
  
  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel htmlFor="network-selection">Network</InputLabel>
      <Select
        name="Network"
        inputProps={{
          name: 'network',
          id: 'network-selection',
        }}

        defaultValue={network}
        onChange={(event) => {
          setNetwork(event.target.value! as Network);
        }}
      >
        {
          Object.entries(Network).map(([key, value]) => { 
            return <option className={classes.option} key={value} value={value}>{key}</option>
          })
        }
      </Select>
    </FormControl>
  );
};

export default NetworkSelection;
