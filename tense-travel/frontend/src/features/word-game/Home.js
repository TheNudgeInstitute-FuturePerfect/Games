import React, { useEffect, useState } from "react";
import LandingPage from "./components/LandingPage";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { checkUserByMobile } from "../../services/userAPI";
import { removeTourGuideStep } from "./common/TourGuide/UpdateTourGuideSteps";
import {
  getStorage,
  removeStorage,
  setStorage,
} from "../../utils/manageStorage";
import { hotjar } from "../../hotjar/HotjarIntegration";
import { toast } from "react-toastify";

function Home() {
  const params = useParams();
  let mobile = params["mobileNumber"];
  const [storageData, setStorageData] = useState();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  mobile = searchParams.get("mobile");

  const checkUserByMobileRegister = async () => {
    if (mobile) {
      mobile = mobile.replace(/\D/g, "").slice(-10);
      if (mobile.length < 10) {
        toast.error("The mobile number must be equal to 10 digits.");
        navigate("/404");
      } else {
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
      }
    }else {
      toast.error("Please add your mobile number");
      navigate("/404");
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
