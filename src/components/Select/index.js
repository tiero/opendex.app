import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, MenuItem } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

const SelectComponent = ({ options, variant, defaultValue, className, onChange, value, disabled }) => {
    const classes = useStyles();
    const [option, setOption] = React.useState(value.id || defaultValue.id || options[0].id);

    React.useEffect(() => {
        if (value.id !== option) {
            setOption(value.id);
        }
    }, [option, value]);

    const handleChange = (event) => {
        const value = event.target.value;
        const selectedOption = options.filter((option) => option.id === value)[0];
        setOption(value);
        onChange(selectedOption);
    };

    return (
        <div className={`${classes.root} ${className}`}>
            <TextField
                select
                value={option}
                onChange={handleChange}
                variant={variant}
                disabled={disabled}
                SelectProps={{ MenuProps: { disableScrollLock: true } }}
            >
            {options.map(option => (
                <MenuItem key={option.id} value={option.id}>
                    {option.label || option.id}
                </MenuItem>
            ))}
            </TextField>
        </div>
    )
}

export default SelectComponent;
