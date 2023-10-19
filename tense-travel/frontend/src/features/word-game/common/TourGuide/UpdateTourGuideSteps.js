import { tourGuideSteps } from "../../../../utils/constants";

const updateTourGuideStep = (step) => {
  sessionStorage.setItem("step", step);
};

const removeTourGuideStep = (step) => {
  sessionStorage.removeItem("step");
};

const showTourGuidePopup = (show = false) => {
  tourGuideSteps.show = show;
};

export { updateTourGuideStep, showTourGuidePopup, removeTourGuideStep };
