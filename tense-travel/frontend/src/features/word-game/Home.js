import React, { useEffect, useState } from "react";
import LandingPage from "./components/LandingPage";
import { useParams, useSearchParams } from "react-router-dom";
import { checkUserByMobile } from "../../services/userAPI";
import { removeTourGuideStep } from "./common/TourGuide/UpdateTourGuideSteps";
import {
  getStorage,
  removeStorage,
  setStorage,
} from "../../utils/manageStorage";
import { hotjar } from "../../hotjar/HotjarIntegration";

function Home() {
  const params = useParams();
  let mobile = params["mobileNumber"];
  const [storageData, setStorageData] = useState();
  const [searchParams] = useSearchParams();

  mobile = searchParams.get("mobile");
  mobile = mobile.replace(/\D/g, "").slice(-10);

  const checkUserByMobileRegister = async () => {
    const userPayload = {
      mobileNumber: mobile,
    };
    const userData = await checkUserByMobile(userPayload);

    if (userData["success"]) {
      removeStorage();
      removeTourGuideStep();
      let mobile = userData["data"]["mobile"];
      let userId = userData["data"]["_id"];
      setStorage({ mobile, userId });
      setStorageData(getStorage());
    }
  };

  useEffect(() => {
    checkUserByMobileRegister();

    hotjar.initialize();
    hotjar.initialized();
  }, []);

  return <div>{storageData && <LandingPage storageData={storageData} />}</div>;
}

export default Home;
