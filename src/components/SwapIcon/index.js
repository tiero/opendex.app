import React from "react";
import svgIcons from "../../utils/svgIcons";
import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
  createStyles({
    wrapper: {
      display: 'flex',
      height: '2rem',
      "justify-content": "center",
      "flex-direction": "column",
      marginTop: "1rem",
      marginBottom: "0.5rem",
    },
  })
);

const SwapIcon = ({ onClick }) => {
  const classes = useStyles();
  return (
    <div className={classes.wrapper} onClick={onClick}>
      <img src={svgIcons.rightArrowPlain} alt="Icon Right" />
      <img src={svgIcons.leftArrow} alt="Icon Left" />
    </div>
  );
};

export default SwapIcon;
