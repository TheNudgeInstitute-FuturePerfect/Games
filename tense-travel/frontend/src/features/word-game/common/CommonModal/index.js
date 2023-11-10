import { Button } from "react-bootstrap";
import "./style.scss";
import { actions, popupTypes } from "../../../../utils/commonFunction";
import { getUserCoins } from "../../../../services/coinAPI";
import { userIds } from "../../../../utils/constants";
import { useEffect, useState } from "react";
import { coins } from "../../../../utils/constants";
import questionExplanationIcon from "../../../../assets/images/question-explanation-icon.svg";

function CommonModal(props) {
  const [totalEarnGerms, setTotalEarnGerms] = useState(null);
  const [tipPopup, setTipPopup] = useState(false);
  const {
    modalParams: { modalName },
  } = props;

  useEffect(() => {
    const handleClickOutside = (event) => {
      let className = event.target.className.split(" ");
      if (
        className.includes("questionExplanationContent") ||
        className.includes("modalContainer")
      ) {
        props.handleExplanationPopupClose();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
  });

  const handleNoMoreCoin = () => {
    setTipPopup(true);
  };

  switch (modalName) {
    case "gameOverMainScreen":
      return (
        <>
          <div className="d-flex align-items-center justify-content-center modalContainer">
            <div className="modalBody">
              <div className="modalHeading">Game Over!</div>
              <div className="modalSubHeading">
                You made too many mistakes
                <span className="emojiIcon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                  >
                    <path
                      d="M11 22C17.0751 22 22 17.0751 22 11C22 4.92487 17.0751 0 11 0C4.92487 0 0 4.92487 0 11C0 17.0751 4.92487 22 11 22Z"
                      fill="#FFDD67"
                    />
                    <path
                      d="M6.78335 10.8533C7.79587 10.8533 8.61668 10.0325 8.61668 9.01999C8.61668 8.00747 7.79587 7.18666 6.78335 7.18666C5.77082 7.18666 4.95001 8.00747 4.95001 9.01999C4.95001 10.0325 5.77082 10.8533 6.78335 10.8533Z"
                      fill="#664E27"
                    />
                    <path
                      d="M15.2166 10.8533C16.2292 10.8533 17.05 10.0325 17.05 9.01999C17.05 8.00747 16.2292 7.18666 15.2166 7.18666C14.2041 7.18666 13.3833 8.00747 13.3833 9.01999C13.3833 10.0325 14.2041 10.8533 15.2166 10.8533Z"
                      fill="#664E27"
                    />
                    <path
                      d="M7.69998 16.72C9.82664 14.96 12.1733 14.96 14.3 16.72C14.5566 16.94 14.7766 16.5733 14.5933 16.2433C13.9333 14.9967 12.65 13.86 11 13.86C9.34998 13.86 8.02998 14.9967 7.40664 16.2433C7.22331 16.5733 7.44331 16.94 7.69998 16.72Z"
                      fill="#664E27"
                    />
                  </svg>
                </span>
              </div>
              <div className="descriptionText">
                To finish the level keep playing and answer 3 more questions
                correctly!
              </div>
              <div className="d-flex align-items-center justify-content-center">
                <Button
                  variant="primary"
                  className="keepPlayingBtn"
                  onClick={() => props.handleBuyCoinPopupShow(popupTypes[1])}
                >
                  <span className="emojiIcon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="26"
                      viewBox="0 0 28 26"
                      fill="none"
                    >
                      <path
                        d="M24.9131 13C24.9131 19.6274 19.5405 25 12.9131 25C6.28567 25 0.913086 19.6274 0.913086 13C0.913086 6.37258 6.28567 1 12.9131 1C19.5405 1 24.9131 6.37258 24.9131 13ZM3.26058 13C3.26058 18.3309 7.58216 22.6525 12.9131 22.6525C18.244 22.6525 22.5656 18.3309 22.5656 13C22.5656 7.66907 18.244 3.3475 12.9131 3.3475C7.58216 3.3475 3.26058 7.66907 3.26058 13Z"
                        fill="#DDAC17"
                      />
                      <path
                        d="M15 25.05C21.655 25.05 27.05 19.655 27.05 13C27.05 6.34497 21.655 0.95 15 0.95C8.34497 0.95 2.95 6.34497 2.95 13C2.95 19.655 8.34497 25.05 15 25.05Z"
                        fill="#C09525"
                        stroke="black"
                        strokeWidth="0.1"
                      />
                      <rect
                        x="11.4206"
                        y="6.59706"
                        width="1.51176"
                        height="12.8059"
                        fill="#FFDC60"
                        stroke="black"
                        strokeWidth="0.1"
                      />
                      <rect
                        x="18.4794"
                        y="6.59706"
                        width="1.51176"
                        height="12.8059"
                        fill="#FFDC60"
                        stroke="black"
                        strokeWidth="0.1"
                      />
                      <path
                        d="M25.4933 11.8602C25.2095 9.23874 23.9577 6.81749 21.983 5.0702C20.0082 3.32291 17.4525 2.37532 14.816 2.41284C12.1794 2.45035 9.65177 3.47027 7.72751 5.27304C5.80325 7.0758 4.62088 9.53169 4.41174 12.1602L5.08428 12.2941C5.24851 10.23 7.13595 8.06274 8.64704 6.64706C10.1581 5.23138 12.7779 4.71554 14.8483 4.68608C16.9188 4.65662 19.8022 5.27494 21.3529 6.64706C22.9037 8.01918 24.6261 10.1016 24.849 12.1602L25.4933 11.8602Z"
                        fill="#A98321"
                      />
                      <path
                        d="M14.9062 11.0705L14.9527 11.0473L14.9277 11.0018C14.5948 10.3948 14.1723 9.95172 13.6401 9.66096C13.1083 9.37041 12.4704 9.23387 11.7097 9.23387C10.9653 9.23387 10.063 9.45893 9.34583 10.0435C8.62682 10.6295 8.09839 11.5733 8.09839 13C8.09839 14.6215 8.72467 15.5664 9.49394 16.1039C10.2601 16.6392 11.1618 16.7661 11.7097 16.7661C13.6713 16.7661 14.653 15.4317 14.9286 14.8804L14.9505 14.8366L14.9072 14.8138L13.4362 14.0396L13.3857 14.0131L13.366 14.0666C13.2332 14.4269 13.0452 14.6788 12.8088 14.841C12.5723 15.0033 12.2829 15.079 11.9419 15.079C11.3578 15.079 10.9674 14.8448 10.7207 14.4724C10.4719 14.0969 10.3661 13.5759 10.3661 13C10.3661 12.2887 10.501 11.7694 10.7623 11.4288C11.0216 11.0908 11.4116 10.921 11.9419 10.921C12.011 10.921 12.7988 10.9566 13.2126 11.8595L13.2342 11.9066L13.2804 11.8834L14.9062 11.0705ZM21.8357 11.0703L21.8815 11.0469L21.8567 11.0018C21.5237 10.3944 21.0914 9.95155 20.5595 9.66096C20.0279 9.37056 19.3998 9.23387 18.6774 9.23387C17.933 9.23387 17.0308 9.45893 16.3136 10.0435C15.5946 10.6295 15.0661 11.5733 15.0661 13C15.0661 14.6215 15.6924 15.5664 16.4617 16.1039C17.2279 16.6392 18.1296 16.7661 18.6774 16.7661C20.6703 16.7661 21.6278 15.2923 21.851 14.9488C21.8696 14.9202 21.883 14.8995 21.8916 14.8881L21.9272 14.8406L21.8744 14.8136L20.3648 14.0394L20.3145 14.0136L20.295 14.0666C20.1623 14.4269 19.9743 14.6788 19.7378 14.841C19.5013 15.0033 19.2119 15.079 18.871 15.079C18.2868 15.079 17.8964 14.8448 17.6497 14.4724C17.401 14.0969 17.2952 13.5759 17.2952 13C17.2952 12.2887 17.43 11.7694 17.6913 11.4288C17.9506 11.0908 18.3406 10.921 18.871 10.921H18.8715C18.984 10.921 19.7674 10.9209 20.18 11.8588L20.2014 11.9074L20.2486 11.8832L21.8357 11.0703ZM14.9613 0.95C8.04189 0.95 2.95 6.54807 2.95 13C2.95 19.7248 8.46958 25.05 14.9613 25.05C21.296 25.05 27.05 20.1914 27.05 13C27.05 6.31464 21.8408 0.95 14.9613 0.95ZM15.0387 22.7823C9.64697 22.7823 5.21774 18.3143 5.21774 13C5.21774 7.91613 9.33906 3.21774 15.0387 3.21774C20.4694 3.21774 24.8209 7.49237 24.821 13C24.7823 18.8537 20.0072 22.7823 15.0387 22.7823Z"
                        fill="#FFDC60"
                        stroke="black"
                        strokeWidth="0.1"
                      />
                    </svg>
                  </span>
                  Keep Playing
                </Button>
              </div>
              <div className="d-flex align-items-center justify-content-center">
                <Button
                  variant="link"
                  className="goBackBtn"
                  onClick={() => props.handleBuyCoinPopupClose()}
                >
                  Go Back
                </Button>
              </div>
            </div>
          </div>
        </>
      );
      break;
    case "gameOverBuyLives":
      const checkUserCoins = async () => {
        let requestPayload = { userId: userIds.userId };
        const userCoins = await getUserCoins(requestPayload);
        const totalGerms = userCoins["data"]["totalEarnGerms"];
        setTotalEarnGerms(totalGerms);
      };
      checkUserCoins();
      return (
        <>
          {/* with coins */}
          {totalEarnGerms >= coins.purchaseLives.coins && (
            <div className="d-flex align-items-center justify-content-center modalContainer">
              <div className="modalBody">
                <div className="modalHeading">Game Over!</div>
                <div className="modalSubHeading">Buy More Hearts</div>
                <div className="d-flex justify-content-center">
                  <Button
                    variant="primary"
                    className="heartsBtn"
                    onClick={() => props.handleBuyCoinPopupShow(actions[0])}
                  >
                    <div className="emojiIcon">
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="44"
                          height="39"
                          viewBox="0 0 44 39"
                          fill="none"
                        >
                          <path
                            d="M22.038 38.9085C21.4301 38.9085 20.8221 38.6805 20.3661 38.3005C18.6183 36.7807 16.8705 35.3368 15.3506 34.0449C10.943 30.3212 7.06735 27.0535 4.4076 23.8618C1.36788 20.2142 0 16.8705 0 13.1468C0 9.57514 1.21589 6.23144 3.49568 3.79966C5.77547 1.36788 8.8912 7.86846e-06 12.3109 7.86846e-06C14.8187 7.86846e-06 17.1744 0.835932 19.2263 2.35579C20.0622 2.96374 20.7461 3.72367 21.4301 4.55959C21.734 4.93956 22.266 4.93956 22.57 4.55959C23.2539 3.72367 24.0138 3.03973 24.7737 2.35579C26.8256 0.759939 29.1814 7.86846e-06 31.6891 7.86846e-06C35.1088 7.86846e-06 38.2245 1.36788 40.5043 3.79966C42.7841 6.23144 44 9.57514 44 13.1468C44 16.8705 42.6321 20.2142 39.5924 23.7858C36.9326 26.9776 33.057 30.2453 28.6494 33.9689C27.1295 35.2608 25.3817 36.7047 23.6339 38.2245C23.2539 38.6805 22.6459 38.9085 22.038 38.9085Z"
                            fill="#C3073F"
                          />
                        </svg>
                      </div>
                      <div className="buy-coin-1x">1x</div>
                    </div>
                    <span className="buy-coin-10">10 coins</span>
                  </Button>
                </div>
                <div className="d-flex justify-content-center">
                  <Button
                    variant="outline-primary"
                    className="balanceBtn"
                    disabled
                  >
                    <span className="emojiIcon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="23"
                        height="23"
                        viewBox="0 0 28 26"
                        fill="none"
                      >
                        <path
                          d="M24.9131 13C24.9131 19.6274 19.5405 25 12.9131 25C6.28567 25 0.913086 19.6274 0.913086 13C0.913086 6.37258 6.28567 1 12.9131 1C19.5405 1 24.9131 6.37258 24.9131 13ZM3.26058 13C3.26058 18.3309 7.58216 22.6525 12.9131 22.6525C18.244 22.6525 22.5656 18.3309 22.5656 13C22.5656 7.66907 18.244 3.3475 12.9131 3.3475C7.58216 3.3475 3.26058 7.66907 3.26058 13Z"
                          fill="#DDAC17"
                        />
                        <path
                          d="M15 25.05C21.655 25.05 27.05 19.655 27.05 13C27.05 6.34497 21.655 0.95 15 0.95C8.34497 0.95 2.95 6.34497 2.95 13C2.95 19.655 8.34497 25.05 15 25.05Z"
                          fill="#C09525"
                          stroke="black"
                          strokeWidth="0.1"
                        />
                        <rect
                          x="11.4206"
                          y="6.59706"
                          width="1.51176"
                          height="12.8059"
                          fill="#FFDC60"
                          stroke="black"
                          strokeWidth="0.1"
                        />
                        <rect
                          x="18.4794"
                          y="6.59706"
                          width="1.51176"
                          height="12.8059"
                          fill="#FFDC60"
                          stroke="black"
                          strokeWidth="0.1"
                        />
                        <path
                          d="M25.4933 11.8602C25.2095 9.23874 23.9577 6.81749 21.983 5.0702C20.0082 3.32291 17.4525 2.37532 14.816 2.41284C12.1794 2.45035 9.65177 3.47027 7.72751 5.27304C5.80325 7.0758 4.62088 9.53169 4.41174 12.1602L5.08428 12.2941C5.24851 10.23 7.13595 8.06274 8.64704 6.64706C10.1581 5.23138 12.7779 4.71554 14.8483 4.68608C16.9188 4.65662 19.8022 5.27494 21.3529 6.64706C22.9037 8.01918 24.6261 10.1016 24.849 12.1602L25.4933 11.8602Z"
                          fill="#A98321"
                        />
                        <path
                          d="M14.9062 11.0705L14.9527 11.0473L14.9277 11.0018C14.5948 10.3948 14.1723 9.95172 13.6401 9.66096C13.1083 9.37041 12.4704 9.23387 11.7097 9.23387C10.9653 9.23387 10.063 9.45893 9.34583 10.0435C8.62682 10.6295 8.09839 11.5733 8.09839 13C8.09839 14.6215 8.72467 15.5664 9.49394 16.1039C10.2601 16.6392 11.1618 16.7661 11.7097 16.7661C13.6713 16.7661 14.653 15.4317 14.9286 14.8804L14.9505 14.8366L14.9072 14.8138L13.4362 14.0396L13.3857 14.0131L13.366 14.0666C13.2332 14.4269 13.0452 14.6788 12.8088 14.841C12.5723 15.0033 12.2829 15.079 11.9419 15.079C11.3578 15.079 10.9674 14.8448 10.7207 14.4724C10.4719 14.0969 10.3661 13.5759 10.3661 13C10.3661 12.2887 10.501 11.7694 10.7623 11.4288C11.0216 11.0908 11.4116 10.921 11.9419 10.921C12.011 10.921 12.7988 10.9566 13.2126 11.8595L13.2342 11.9066L13.2804 11.8834L14.9062 11.0705ZM21.8357 11.0703L21.8815 11.0469L21.8567 11.0018C21.5237 10.3944 21.0914 9.95155 20.5595 9.66096C20.0279 9.37056 19.3998 9.23387 18.6774 9.23387C17.933 9.23387 17.0308 9.45893 16.3136 10.0435C15.5946 10.6295 15.0661 11.5733 15.0661 13C15.0661 14.6215 15.6924 15.5664 16.4617 16.1039C17.2279 16.6392 18.1296 16.7661 18.6774 16.7661C20.6703 16.7661 21.6278 15.2923 21.851 14.9488C21.8696 14.9202 21.883 14.8995 21.8916 14.8881L21.9272 14.8406L21.8744 14.8136L20.3648 14.0394L20.3145 14.0136L20.295 14.0666C20.1623 14.4269 19.9743 14.6788 19.7378 14.841C19.5013 15.0033 19.2119 15.079 18.871 15.079C18.2868 15.079 17.8964 14.8448 17.6497 14.4724C17.401 14.0969 17.2952 13.5759 17.2952 13C17.2952 12.2887 17.43 11.7694 17.6913 11.4288C17.9506 11.0908 18.3406 10.921 18.871 10.921H18.8715C18.984 10.921 19.7674 10.9209 20.18 11.8588L20.2014 11.9074L20.2486 11.8832L21.8357 11.0703ZM14.9613 0.95C8.04189 0.95 2.95 6.54807 2.95 13C2.95 19.7248 8.46958 25.05 14.9613 25.05C21.296 25.05 27.05 20.1914 27.05 13C27.05 6.31464 21.8408 0.95 14.9613 0.95ZM15.0387 22.7823C9.64697 22.7823 5.21774 18.3143 5.21774 13C5.21774 7.91613 9.33906 3.21774 15.0387 3.21774C20.4694 3.21774 24.8209 7.49237 24.821 13C24.7823 18.8537 20.0072 22.7823 15.0387 22.7823Z"
                          fill="#FFDC60"
                          stroke="black"
                          strokeWidth="0.1"
                        />
                      </svg>
                    </span>
                    {totalEarnGerms && (
                      <span>
                        You have{" "}
                        <span className="coinsCount">{totalEarnGerms}</span>{" "}
                        coins
                      </span>
                    )}
                  </Button>
                </div>
                <div className="d-flex align-items-center justify-content-center">
                  <Button
                    variant="link"
                    className="goBackBtn"
                    onClick={() => props.handleBuyCoinPopupClose()}
                  >
                    Go Back
                  </Button>
                </div>
              </div>
            </div>
          )}
          {/* without coins */}
          {totalEarnGerms < coins.purchaseLives.coins && (
            <div className="d-flex align-items-center justify-content-center modalContainer">
              <div className="modalBody">
                <div className="modalHeading">Game Over!</div>
                <div className="noCoinsmodalSubHeading">
                  No Coins &nbsp;
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                    >
                      <path
                        d="M11 22C17.0751 22 22 17.0751 22 11C22 4.92487 17.0751 0 11 0C4.92487 0 0 4.92487 0 11C0 17.0751 4.92487 22 11 22Z"
                        fill="#FFDD67"
                      />
                      <path
                        d="M6.78328 10.8533C7.79581 10.8533 8.61662 10.0325 8.61662 9.01998C8.61662 8.00746 7.79581 7.18665 6.78328 7.18665C5.77076 7.18665 4.94995 8.00746 4.94995 9.01998C4.94995 10.0325 5.77076 10.8533 6.78328 10.8533Z"
                        fill="#664E27"
                      />
                      <path
                        d="M15.2166 10.8533C16.2292 10.8533 17.05 10.0325 17.05 9.01998C17.05 8.00746 16.2292 7.18665 15.2166 7.18665C14.2041 7.18665 13.3833 8.00746 13.3833 9.01998C13.3833 10.0325 14.2041 10.8533 15.2166 10.8533Z"
                        fill="#664E27"
                      />
                      <path
                        d="M7.69986 16.72C9.82652 14.96 12.1732 14.96 14.2999 16.72C14.5565 16.94 14.7765 16.5733 14.5932 16.2433C13.9332 14.9967 12.6499 13.86 10.9999 13.86C9.34986 13.86 8.02986 14.9967 7.40652 16.2433C7.22319 16.5733 7.44319 16.94 7.69986 16.72Z"
                        fill="#664E27"
                      />
                    </svg>
                  </span>
                  <div className="noCoinMessage">
                    You don’t have enough coins to buy hearts
                  </div>
                </div>
                <div className="d-flex justify-content-center">
                  <Button
                    variant="primary"
                    className="noCoinMoreBtn"
                    onClick={handleNoMoreCoin}
                  >
                    <div className="emojiIcon">
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="23"
                          height="23"
                          viewBox="0 0 28 26"
                          fill="none"
                        >
                          <path
                            d="M24.9131 13C24.9131 19.6274 19.5405 25 12.9131 25C6.28567 25 0.913086 19.6274 0.913086 13C0.913086 6.37258 6.28567 1 12.9131 1C19.5405 1 24.9131 6.37258 24.9131 13ZM3.26058 13C3.26058 18.3309 7.58216 22.6525 12.9131 22.6525C18.244 22.6525 22.5656 18.3309 22.5656 13C22.5656 7.66907 18.244 3.3475 12.9131 3.3475C7.58216 3.3475 3.26058 7.66907 3.26058 13Z"
                            fill="#DDAC17"
                          />
                          <path
                            d="M15 25.05C21.655 25.05 27.05 19.655 27.05 13C27.05 6.34497 21.655 0.95 15 0.95C8.34497 0.95 2.95 6.34497 2.95 13C2.95 19.655 8.34497 25.05 15 25.05Z"
                            fill="#C09525"
                            stroke="black"
                            strokeWidth="0.1"
                          />
                          <rect
                            x="11.4206"
                            y="6.59706"
                            width="1.51176"
                            height="12.8059"
                            fill="#FFDC60"
                            stroke="black"
                            strokeWidth="0.1"
                          />
                          <rect
                            x="18.4794"
                            y="6.59706"
                            width="1.51176"
                            height="12.8059"
                            fill="#FFDC60"
                            stroke="black"
                            strokeWidth="0.1"
                          />
                          <path
                            d="M25.4933 11.8602C25.2095 9.23874 23.9577 6.81749 21.983 5.0702C20.0082 3.32291 17.4525 2.37532 14.816 2.41284C12.1794 2.45035 9.65177 3.47027 7.72751 5.27304C5.80325 7.0758 4.62088 9.53169 4.41174 12.1602L5.08428 12.2941C5.24851 10.23 7.13595 8.06274 8.64704 6.64706C10.1581 5.23138 12.7779 4.71554 14.8483 4.68608C16.9188 4.65662 19.8022 5.27494 21.3529 6.64706C22.9037 8.01918 24.6261 10.1016 24.849 12.1602L25.4933 11.8602Z"
                            fill="#A98321"
                          />
                          <path
                            d="M14.9062 11.0705L14.9527 11.0473L14.9277 11.0018C14.5948 10.3948 14.1723 9.95172 13.6401 9.66096C13.1083 9.37041 12.4704 9.23387 11.7097 9.23387C10.9653 9.23387 10.063 9.45893 9.34583 10.0435C8.62682 10.6295 8.09839 11.5733 8.09839 13C8.09839 14.6215 8.72467 15.5664 9.49394 16.1039C10.2601 16.6392 11.1618 16.7661 11.7097 16.7661C13.6713 16.7661 14.653 15.4317 14.9286 14.8804L14.9505 14.8366L14.9072 14.8138L13.4362 14.0396L13.3857 14.0131L13.366 14.0666C13.2332 14.4269 13.0452 14.6788 12.8088 14.841C12.5723 15.0033 12.2829 15.079 11.9419 15.079C11.3578 15.079 10.9674 14.8448 10.7207 14.4724C10.4719 14.0969 10.3661 13.5759 10.3661 13C10.3661 12.2887 10.501 11.7694 10.7623 11.4288C11.0216 11.0908 11.4116 10.921 11.9419 10.921C12.011 10.921 12.7988 10.9566 13.2126 11.8595L13.2342 11.9066L13.2804 11.8834L14.9062 11.0705ZM21.8357 11.0703L21.8815 11.0469L21.8567 11.0018C21.5237 10.3944 21.0914 9.95155 20.5595 9.66096C20.0279 9.37056 19.3998 9.23387 18.6774 9.23387C17.933 9.23387 17.0308 9.45893 16.3136 10.0435C15.5946 10.6295 15.0661 11.5733 15.0661 13C15.0661 14.6215 15.6924 15.5664 16.4617 16.1039C17.2279 16.6392 18.1296 16.7661 18.6774 16.7661C20.6703 16.7661 21.6278 15.2923 21.851 14.9488C21.8696 14.9202 21.883 14.8995 21.8916 14.8881L21.9272 14.8406L21.8744 14.8136L20.3648 14.0394L20.3145 14.0136L20.295 14.0666C20.1623 14.4269 19.9743 14.6788 19.7378 14.841C19.5013 15.0033 19.2119 15.079 18.871 15.079C18.2868 15.079 17.8964 14.8448 17.6497 14.4724C17.401 14.0969 17.2952 13.5759 17.2952 13C17.2952 12.2887 17.43 11.7694 17.6913 11.4288C17.9506 11.0908 18.3406 10.921 18.871 10.921H18.8715C18.984 10.921 19.7674 10.9209 20.18 11.8588L20.2014 11.9074L20.2486 11.8832L21.8357 11.0703ZM14.9613 0.95C8.04189 0.95 2.95 6.54807 2.95 13C2.95 19.7248 8.46958 25.05 14.9613 25.05C21.296 25.05 27.05 20.1914 27.05 13C27.05 6.31464 21.8408 0.95 14.9613 0.95ZM15.0387 22.7823C9.64697 22.7823 5.21774 18.3143 5.21774 13C5.21774 7.91613 9.33906 3.21774 15.0387 3.21774C20.4694 3.21774 24.8209 7.49237 24.821 13C24.7823 18.8537 20.0072 22.7823 15.0387 22.7823Z"
                            fill="#FFDC60"
                            stroke="black"
                            strokeWidth="0.1"
                          />
                        </svg>
                      </div>
                      <div className="moreCoins">More Coins</div>
                    </div>
                  </Button>
                </div>
                <div className="d-flex justify-content-center">
                  <Button
                    variant="outline-primary"
                    className="balanceBtn"
                    disabled
                  >
                    <span className="emojiIcon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="23"
                        height="23"
                        viewBox="0 0 28 26"
                        fill="none"
                      >
                        <path
                          d="M24.9131 13C24.9131 19.6274 19.5405 25 12.9131 25C6.28567 25 0.913086 19.6274 0.913086 13C0.913086 6.37258 6.28567 1 12.9131 1C19.5405 1 24.9131 6.37258 24.9131 13ZM3.26058 13C3.26058 18.3309 7.58216 22.6525 12.9131 22.6525C18.244 22.6525 22.5656 18.3309 22.5656 13C22.5656 7.66907 18.244 3.3475 12.9131 3.3475C7.58216 3.3475 3.26058 7.66907 3.26058 13Z"
                          fill="#DDAC17"
                        />
                        <path
                          d="M15 25.05C21.655 25.05 27.05 19.655 27.05 13C27.05 6.34497 21.655 0.95 15 0.95C8.34497 0.95 2.95 6.34497 2.95 13C2.95 19.655 8.34497 25.05 15 25.05Z"
                          fill="#C09525"
                          stroke="black"
                          strokeWidth="0.1"
                        />
                        <rect
                          x="11.4206"
                          y="6.59706"
                          width="1.51176"
                          height="12.8059"
                          fill="#FFDC60"
                          stroke="black"
                          strokeWidth="0.1"
                        />
                        <rect
                          x="18.4794"
                          y="6.59706"
                          width="1.51176"
                          height="12.8059"
                          fill="#FFDC60"
                          stroke="black"
                          strokeWidth="0.1"
                        />
                        <path
                          d="M25.4933 11.8602C25.2095 9.23874 23.9577 6.81749 21.983 5.0702C20.0082 3.32291 17.4525 2.37532 14.816 2.41284C12.1794 2.45035 9.65177 3.47027 7.72751 5.27304C5.80325 7.0758 4.62088 9.53169 4.41174 12.1602L5.08428 12.2941C5.24851 10.23 7.13595 8.06274 8.64704 6.64706C10.1581 5.23138 12.7779 4.71554 14.8483 4.68608C16.9188 4.65662 19.8022 5.27494 21.3529 6.64706C22.9037 8.01918 24.6261 10.1016 24.849 12.1602L25.4933 11.8602Z"
                          fill="#A98321"
                        />
                        <path
                          d="M14.9062 11.0705L14.9527 11.0473L14.9277 11.0018C14.5948 10.3948 14.1723 9.95172 13.6401 9.66096C13.1083 9.37041 12.4704 9.23387 11.7097 9.23387C10.9653 9.23387 10.063 9.45893 9.34583 10.0435C8.62682 10.6295 8.09839 11.5733 8.09839 13C8.09839 14.6215 8.72467 15.5664 9.49394 16.1039C10.2601 16.6392 11.1618 16.7661 11.7097 16.7661C13.6713 16.7661 14.653 15.4317 14.9286 14.8804L14.9505 14.8366L14.9072 14.8138L13.4362 14.0396L13.3857 14.0131L13.366 14.0666C13.2332 14.4269 13.0452 14.6788 12.8088 14.841C12.5723 15.0033 12.2829 15.079 11.9419 15.079C11.3578 15.079 10.9674 14.8448 10.7207 14.4724C10.4719 14.0969 10.3661 13.5759 10.3661 13C10.3661 12.2887 10.501 11.7694 10.7623 11.4288C11.0216 11.0908 11.4116 10.921 11.9419 10.921C12.011 10.921 12.7988 10.9566 13.2126 11.8595L13.2342 11.9066L13.2804 11.8834L14.9062 11.0705ZM21.8357 11.0703L21.8815 11.0469L21.8567 11.0018C21.5237 10.3944 21.0914 9.95155 20.5595 9.66096C20.0279 9.37056 19.3998 9.23387 18.6774 9.23387C17.933 9.23387 17.0308 9.45893 16.3136 10.0435C15.5946 10.6295 15.0661 11.5733 15.0661 13C15.0661 14.6215 15.6924 15.5664 16.4617 16.1039C17.2279 16.6392 18.1296 16.7661 18.6774 16.7661C20.6703 16.7661 21.6278 15.2923 21.851 14.9488C21.8696 14.9202 21.883 14.8995 21.8916 14.8881L21.9272 14.8406L21.8744 14.8136L20.3648 14.0394L20.3145 14.0136L20.295 14.0666C20.1623 14.4269 19.9743 14.6788 19.7378 14.841C19.5013 15.0033 19.2119 15.079 18.871 15.079C18.2868 15.079 17.8964 14.8448 17.6497 14.4724C17.401 14.0969 17.2952 13.5759 17.2952 13C17.2952 12.2887 17.43 11.7694 17.6913 11.4288C17.9506 11.0908 18.3406 10.921 18.871 10.921H18.8715C18.984 10.921 19.7674 10.9209 20.18 11.8588L20.2014 11.9074L20.2486 11.8832L21.8357 11.0703ZM14.9613 0.95C8.04189 0.95 2.95 6.54807 2.95 13C2.95 19.7248 8.46958 25.05 14.9613 25.05C21.296 25.05 27.05 20.1914 27.05 13C27.05 6.31464 21.8408 0.95 14.9613 0.95ZM15.0387 22.7823C9.64697 22.7823 5.21774 18.3143 5.21774 13C5.21774 7.91613 9.33906 3.21774 15.0387 3.21774C20.4694 3.21774 24.8209 7.49237 24.821 13C24.7823 18.8537 20.0072 22.7823 15.0387 22.7823Z"
                          fill="#FFDC60"
                          stroke="black"
                          strokeWidth="0.1"
                        />
                      </svg>
                    </span>
                    <span>
                      You have
                      <span className="coinsCount">
                        {" "}
                        {totalEarnGerms}/{coins.purchaseLives.coins}{" "}
                      </span>{" "}
                      coins
                    </span>
                  </Button>
                </div>
                <div className="d-flex align-items-center justify-content-center">
                  <Button
                    variant="link"
                    className="goBackBtn"
                    onClick={() => props.handleBuyCoinPopupClose()}
                  >
                    Go Back
                  </Button>
                </div>
              </div>
            </div>
          )}
          {tipPopup === true && (
            <div className="d-flex align-items-center justify-content-center modalContainer">
              <div className="noContentModalBody">
                <div className="noCoinTipPopup">
                  TIP: Play already completed levels to get more coins!
                </div>
                <div className="d-flex align-items-center justify-content-center">
                  <Button
                    variant="outline-primary"
                    className="takeMeThereBtn"
                    onClick={() => props.handleBuyCoinPopupClose()}
                  >
                    Take Me there
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      );
      break;
    case "gameOverFinalScreen":
      return (
        <>
          <div className="d-flex align-items-center justify-content-center modalContainer">
            <div className="modalBody">
              <div className="modalHeading">Game Over!</div>
              <div className="modalSubHeading">
                You made too many mistakes
                <span className="emojiIcon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                  >
                    <path
                      d="M11 22C17.0751 22 22 17.0751 22 11C22 4.92487 17.0751 0 11 0C4.92487 0 0 4.92487 0 11C0 17.0751 4.92487 22 11 22Z"
                      fill="#FFDD67"
                    />
                    <path
                      d="M6.78335 10.8533C7.79587 10.8533 8.61668 10.0325 8.61668 9.01999C8.61668 8.00747 7.79587 7.18666 6.78335 7.18666C5.77082 7.18666 4.95001 8.00747 4.95001 9.01999C4.95001 10.0325 5.77082 10.8533 6.78335 10.8533Z"
                      fill="#664E27"
                    />
                    <path
                      d="M15.2166 10.8533C16.2292 10.8533 17.05 10.0325 17.05 9.01999C17.05 8.00747 16.2292 7.18666 15.2166 7.18666C14.2041 7.18666 13.3833 8.00747 13.3833 9.01999C13.3833 10.0325 14.2041 10.8533 15.2166 10.8533Z"
                      fill="#664E27"
                    />
                    <path
                      d="M7.69998 16.72C9.82664 14.96 12.1733 14.96 14.3 16.72C14.5566 16.94 14.7766 16.5733 14.5933 16.2433C13.9333 14.9967 12.65 13.86 11 13.86C9.34998 13.86 8.02998 14.9967 7.40664 16.2433C7.22331 16.5733 7.44331 16.94 7.69998 16.72Z"
                      fill="#664E27"
                    />
                  </svg>
                </span>
              </div>
              <div className="d-flex justify-content-center">
                <Button
                  variant="primary"
                  className="goBackBtnLarge"
                  onClick={() => props.handleBuyCoinPopupClose()}
                >
                  <span className="emojiIcon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="23"
                      height="23"
                      viewBox="0 0 23 23"
                      fill="none"
                    >
                      <path
                        d="M20.5125 22.7062H15.6C14.4 22.7062 13.3875 21.7313 13.3875 20.4938V16.5187C13.3875 16.2188 13.1625 15.9938 12.8625 15.9938H9.8625C9.5625 15.9938 9.3375 16.2188 9.3375 16.5187V20.4938C9.3375 21.7313 8.3625 22.7062 7.125 22.7062H2.2125C1.0125 22.7062 0 21.7313 0 20.4938V7.85625C0 7.21875 0.3 6.65625 0.825 6.31875L10.3875 0.28125C10.9875 -0.09375 11.7375 -0.09375 12.3 0.28125L21.8625 6.35625C22.3875 6.69375 22.6875 7.25625 22.6875 7.89375V20.4938C22.725 21.6938 21.7125 22.7062 20.5125 22.7062ZM9.8625 14.3063H12.8625C14.1 14.3063 15.075 15.2812 15.075 16.5187V20.4938C15.075 20.7938 15.3 21.0187 15.6 21.0187H20.5125C20.8125 21.0187 21.0375 20.7938 21.0375 20.4938V7.85625C21.0375 7.81875 21 7.78125 21 7.74375L11.4 1.70625C11.3625 1.66875 11.325 1.66875 11.2875 1.70625L1.7625 7.74375C1.725 7.78125 1.6875 7.81875 1.6875 7.85625V20.4938C1.6875 20.7938 1.9125 21.0187 2.2125 21.0187H7.125C7.425 21.0187 7.65 20.7938 7.65 20.4938V16.5187C7.65 15.3187 8.625 14.3063 9.8625 14.3063Z"
                        fill="white"
                      />
                    </svg>
                  </span>
                  Go Back
                </Button>
                <Button
                  variant="primary"
                  className="goBackBtnLarge"
                  onClick={() =>
                    props.handleBuyCoinPopupShow(popupTypes[3], "retryGame")
                  }
                >
                  <span className="emojiIcon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="23"
                      height="23"
                      viewBox="0 0 23 23"
                      fill="none"
                    >
                      <path
                        d="M20.5125 22.7062H15.6C14.4 22.7062 13.3875 21.7313 13.3875 20.4938V16.5187C13.3875 16.2188 13.1625 15.9938 12.8625 15.9938H9.8625C9.5625 15.9938 9.3375 16.2188 9.3375 16.5187V20.4938C9.3375 21.7313 8.3625 22.7062 7.125 22.7062H2.2125C1.0125 22.7062 0 21.7313 0 20.4938V7.85625C0 7.21875 0.3 6.65625 0.825 6.31875L10.3875 0.28125C10.9875 -0.09375 11.7375 -0.09375 12.3 0.28125L21.8625 6.35625C22.3875 6.69375 22.6875 7.25625 22.6875 7.89375V20.4938C22.725 21.6938 21.7125 22.7062 20.5125 22.7062ZM9.8625 14.3063H12.8625C14.1 14.3063 15.075 15.2812 15.075 16.5187V20.4938C15.075 20.7938 15.3 21.0187 15.6 21.0187H20.5125C20.8125 21.0187 21.0375 20.7938 21.0375 20.4938V7.85625C21.0375 7.81875 21 7.78125 21 7.74375L11.4 1.70625C11.3625 1.66875 11.325 1.66875 11.2875 1.70625L1.7625 7.74375C1.725 7.78125 1.6875 7.81875 1.6875 7.85625V20.4938C1.6875 20.7938 1.9125 21.0187 2.2125 21.0187H7.125C7.425 21.0187 7.65 20.7938 7.65 20.4938V16.5187C7.65 15.3187 8.625 14.3063 9.8625 14.3063Z"
                        fill="white"
                      />
                    </svg>
                  </span>
                  Try Again
                </Button>
              </div>
              {/* <div className="d-flex align-items-center justify-content-center">
                <Button
                  variant="link"
                  className="goBackBtn"
                  onClick={() => props.handleClose()}
                >
                  Go Back
                </Button>
              </div> */}
              <div className="d-flex align-items-center justify-content-center">
                <div className="descriptionText finalScreenDesc">
                  Remember the explanations and try again!
                </div>
              </div>
            </div>
          </div>
        </>
      );
      break;
    case "questionExplanationPopup":
      return (
        <>
          <div className="d-flex align-items-center justify-content-center modalContainer">
            <div
              className="modalBody"
              style={{ height: "70%", width: "330px" }}
            >
              <div className="modalHeading" style={{ marginBottom: "8px" }}>
                <div>
                  <img
                    src={questionExplanationIcon}
                    alt="questionExplanationIcon"
                  />
                </div>
              </div>
              <div className="questionExplanationModalSubHeading">
                <p>Simple Present Tense</p>
                <div className="questionExplanationTenseLine"></div>
              </div>
              <div className="questionExplanationContent">
                <p
                  dangerouslySetInnerHTML={{
                    __html: props?.questionExplanation,
                  }}
                />
                <div>
                  <Button
                    variant="primary"
                    className="explanationNextBtn"
                    onClick={() =>
                      props.handleNextQuestion("hideExplanationPopup")
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      );
      break;
    default:
      return (
        <>
          <div className="d-flex align-items-center justify-content-center modalContainer">
            <div className="modalBody">
              <div className="modalHeading">No supported Modal</div>
            </div>
          </div>
        </>
      );
  }
}

export default CommonModal;
