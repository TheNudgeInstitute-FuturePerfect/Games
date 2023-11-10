import React from "react";
import { useNavigate } from "react-router-dom";
import "../sass/styles.scss";

function NotFoundPage() {
  const navigate = useNavigate();

  const navigateHome = () => {
    navigate("/");
  };

  return (
    <>
      <div
        style={{
          height: "100%",
          position: "absolute",
          width: "100%",
          textAlign: "center",
        }}
      >
        <div style={{ marginTop: "calc(100% - 30%)" }}>
          {" "}
          <h1>Not found</h1>
        </div>
        <div>
          <button className="give-explanation-btn">
            Go To Home
          </button>
        </div>
      </div>
    </>
  );
}

export default NotFoundPage;
