import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import DrawerContext from "../Wrapper/DrawerContext";
import { UtilsContext } from "../../context/UtilsContext";
import svgIcons from "../../utils/svgIcons";
import { resetState } from "../../services/reverse/reverseDuck";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    display: 'flex',
    height: "100%",
    'flex-direction': 'column',
  },
});

const StepperComponent = ({
  steps,
  activeStep,
  changeActiveStep: setActiveStep,
  context,
}) => {
  const classes = useStyles();
  const drawerContext = useContext(DrawerContext);
  const utilsContext = useContext(UtilsContext);
  const isMobileView = !!utilsContext?.isMobileView;
  const closeDrawer = drawerContext?.closeDrawer;
  const [isDrawerClosed, setDrawerClosed] = React.useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  const closeButtonHandler = () => {
    setActiveStep(0);
    dispatch(resetState());
    closeDrawer();
    setDrawerClosed(true);

    setTimeout(() => {
      setDrawerClosed(false);
    }, 0);

    if (history?.location?.pathname === "/reverse") {
      history.push("/");
    }
  };

  const handleNextStep = () => {
    setActiveStep((prevActiveStep) =>
      prevActiveStep < steps.length - 1 ? prevActiveStep + 1 : 0
    );
  };

  const handlePrevStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // const resetSteps = () => {
  //     setActiveStep(0);
  // };

  const getStepContent = () => {
    const Component = steps[activeStep].component;
    return (
      <Component
        handleNextStep={handleNextStep}
        handlePrevStep={handlePrevStep}
        context={context}
        isDrawerClosed={isDrawerClosed}
      />
    );
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step) => {
          const { key, label } = step;
          return (
            <Step key={key}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep <= steps.length ? getStepContent() : null}
    </div>
  );
};

export default StepperComponent;
