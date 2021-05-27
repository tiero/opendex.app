import { Grid } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import svgIcons from '../../utils/svgIcons';

const useStyles = makeStyles(() =>
  createStyles({
    logo: {
      height: '2rem',
    },
    logoWrapper: {
      display: 'flex',
      alignItems: 'center',
    },
  })
);

export type OpendexLogoProps = {
  onClick?: () => {};
};

const OpendexLogo = (props: OpendexLogoProps) => {
  const classes = useStyles();
  const { onClick } = props;

  return (
    <Grid item onClick={onClick} className={classes.logoWrapper}>
      {/* <img className={classes.logo} src={svgIcons.opendex} alt="OpenDEX Logo" /> */}
    </Grid>
  );
};

export default OpendexLogo;
