import {
  AppBar,
  Grid,
  Grow,
  isWidthUp,
  Link,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Toolbar,
  WithWidth,
  withWidth,
} from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import svgIcons from '../../utils/svgIcons';
import Button from '../Button';
import Divider from '../Divider';
import Logo from '../Logo/';

const useStyles = makeStyles(theme =>
  createStyles({
    navLink: {
      color: theme.palette.text.primary,
      fontSize: '1rem',
      letterSpacing: '0.67px',
    },
    root: {},
    menuButton: {},
    title: {},
    toolbar: {
      flexWrap: 'wrap',
    },
  })
);

export type NavBarProps = WithWidth & {};

const NavBar = (props: NavBarProps) => {
  const classes = useStyles();
  const { width } = props;
  const [open, setOpen] = useState(false);
  const handleToggle = () => setOpen(!open);
  const handleClose = () => setOpen(false);

  const Menu = () => {
    // large screens
    if (isWidthUp('sm', width)) {
      return (
        <Grid
          container
          spacing={1}
          justify="flex-end"
          direction="row"
          alignItems="center"
        >
          <Grid item>
            <Link
              className={classes.navLink}
              href="https://discord.gg/aS5RMchDrU"
              target="_blank"
              rel="noopener noreferrer"
            >
              Community
            </Link>
          </Grid>
          <Grid item>
            <Link
              className={classes.navLink}
              href="https://github.com/opendexnetwork/opendex.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Github
            </Link>
          </Grid>
        </Grid>
      );
    } else {
      // small screens
      return (
        <div>
          <Button aria-haspopup="true" onClick={handleToggle}>
            {open && <img src={svgIcons.close} alt="" />}
            {!open && <img src={svgIcons.hamburger} alt="" />}
          </Button>
          <Popper open={open} transition disablePortal>
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === 'bottom' ? 'center top' : 'center bottom',
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList autoFocusItem={open}>
                      <MenuItem onClick={handleClose}>
                        <Link
                          className={classes.navLink}
                          href="https://discord.gg/aS5RMchDrU"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Community
                        </Link>
                      </MenuItem>
                      <MenuItem onClick={handleClose}>
                        <Link
                          className={classes.navLink}
                          href="https://github.com/opendexnetwork/opendex.app"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Github
                        </Link>
                      </MenuItem>
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
  return (
    <div>
      <AppBar
        elevation={0}
        color="transparent"
        className={classes.root}
        position="static"
      >
        <Toolbar classes={{ root: classes.toolbar }}>
          <Grid
            container
            justify="space-between"
            direction="row"
            alignItems="center"
            className={classes.root}
          >
            <Logo />
            <Grid item>
              <Menu />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Divider />
    </div>
  );
};

export default withWidth()(NavBar);
