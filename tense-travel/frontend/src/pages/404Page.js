import React from "react";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();

  const navigateHome = () => {
    navigate("/");
  };

  return (
    <div>
      <div>404Page</div>
      <div>
        <button onClick={navigateHome}>Go To Home</button>
      </div>
    </div>
  );
}

export default NotFoundPage;
