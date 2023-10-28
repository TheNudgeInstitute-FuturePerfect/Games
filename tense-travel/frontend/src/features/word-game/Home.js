import React from "react";
import LandingPage from "./components/LandingPage";
import { useParams } from "react-router-dom";

function Home() {
  const params = useParams();
  const mobile = params['mobileNumber'];
  return (
    <div>
      <LandingPage mobileNumber={mobile} />
    </div>
  );
}

export default Home;
