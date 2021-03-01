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

const Submarine = () => {
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
      spacing={1}
      justify="center"
      direction="row"
      alignItems="center"
    >
      <Wrapper>
        <div className="submarine">
          <CardComponent>
            <StepperComponent
              steps={SubmarineSteps}
              activeStep={submarineActiveStep}
              changeActiveStep={setSubmarineActiveStep}
            ></StepperComponent>
          </CardComponent>
        </div>
        {showRefundLink ? (
          <Link to="/refund" className={"modal-btn"}>
            {refundLabel}
          </Link>
        ) : (
          <span className={"modal-btn disabled"}>{refundLabel}</span>
        )}
      </Wrapper>
    </Grid>
  );
};

export default Submarine;
