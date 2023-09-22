const reTryStage = async (requestPayload) => {
  const questionsData = await fetch(
    `${process.env.REACT_APP_API_URL}/userEra/user-retry-stage`,
    {
      method: "POST",
      body: JSON.stringify(requestPayload),
      headers: { "Content-Type": "application/json" },
    }
  );
  return questionsData;
};

module.exports = { reTryStage };
