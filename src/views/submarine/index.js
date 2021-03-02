import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import React, { useContext, useEffect } from "react";
import Wrapper from "../../components/Wrapper";
import CardComponent from "../../components/Card";
import StepperComponent from "../../components/Stepper";
import { StepsContext } from "../../context/StepsContext";
import { SubmarineSteps } from "../../constants/submarine";
import * as submarineActionCreators from "../../services/submarine/submarineDuck";
import { Grid } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
  createStyles({
    card: {
      flex: 1,
    }
  })
);

const Submarine = () => {
  const classes = useStyles();
  const stepsContext = useContext(StepsContext);
  const { submarineActiveStep, setSubmarineActiveStep } = stepsContext;

  const dispatch = useDispatch();
  const showRefundLink = submarineActiveStep === 0;
  const refundLabel = "I want to check status or get refund";

  useEffect(() => {
    submarineActionCreators.getPairs(dispatch);
  }, [dispatch]);

  return (
    <Grid
      container
      justify="center"
      direction="column"
      alignItems="center"
      className={classes.card}
    >
      <Wrapper>
        <Grid item>
          <div className="submarine">
            <CardComponent>
              <StepperComponent
                steps={SubmarineSteps}
                activeStep={submarineActiveStep}
                changeActiveStep={setSubmarineActiveStep}
              ></StepperComponent>
            </CardComponent>
          </div>
        </Grid>
        <Grid item>
          {showRefundLink ? (
            <Link to="/refund" className={"modal-btn"}>
              {refundLabel}
            </Link>
          ) : (
            <span className={"modal-btn disabled"}>{refundLabel}</span>
          )}
        </Grid>
      </Wrapper>
    </Grid>
  );
};

export default Submarine;
