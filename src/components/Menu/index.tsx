import {
  createStyles,
  Grid,
  Grow,
  isWidthUp,
  makeStyles,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  WithWidth,
  withWidth,
} from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import React, { ReactElement, useState } from 'react';
import svgIcons from '../../utils/svgIcons';
import Button from '../Button';
import NavLink from '../NavLink';

export type MenuProps = WithWidth;

const useStyles = makeStyles(() =>
  createStyles({
    menuOpener: {
      minWidth: 36,
      height: 36,
    },
    popper: {
      marginTop: 5,
    },
  })
);

const Menu = (props: MenuProps): ReactElement => {
  const { width } = props;
  const [open, setOpen] = useState(false);
  const menuOpener = 'menuOpener';
  const classes = useStyles();

  const handleToggle = () => setOpen(oldValue => !oldValue);
  const handleClose = () => setOpen(false);

  const communityLink = (
    <NavLink href="https://discord.gg/aS5RMchDrU">Community</NavLink>
  );
  const repoLink = (
    <NavLink href="https://github.com/opendexnetwork/opendex.app">
      GitHub
    </NavLink>
  );

  if (isWidthUp('sm', width)) {
    return (
      <Grid
        container
        spacing={1}
        justify="flex-end"
        direction="row"
        alignItems="center"
      >
        <Grid item>{communityLink}</Grid>
        <Grid item>{repoLink}</Grid>
      </Grid>
    );
  } else {
    // small screens
    return (
      <div>
        <Button
          className={classes.menuOpener}
          aria-haspopup="true"
          variant="contained"
          onClick={handleToggle}
          id={menuOpener}
        >
          {open && <img src={svgIcons.close} alt="" />}
          {!open && <img src={svgIcons.hamburger} alt="" />}
        </Button>
        <Popper
          open={open}
          transition
          placement="bottom-start"
          className={classes.popper}
          anchorEl={document.getElementById(menuOpener)}
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps}>
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open}>
                    <MenuItem onClick={handleClose}>{communityLink}</MenuItem>
                    <MenuItem onClick={handleClose}>{repoLink}</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    );
  }
};

export default withWidth()(Menu);
