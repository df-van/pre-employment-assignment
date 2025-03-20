module.exports = (req, res, next) => {
  if (req.method === "GET" && req.url === "/users") {
    setTimeout(() => {
      next();
    }, 2000); // Delay of 2000ms (2 seconds)
  } else if (req.method === "POST" && req.url === "/transfer") {
    console.log("111");
    // Validate input parameters
    const { bank_code, account_number, amount } = req.body;
    if (!bank_code || !account_number || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Randomly return different error cases
    const randomError = Math.random();
    setTimeout(() => {
      if (randomError < 0.25) {
        // 25% chance of returning a 500 error
        return res.status(500).json({
          error_code: "ERROR_FAILED_TO_TRANSFER",
        });
      } else if (randomError < 0.5) {
        // 25% chance of returning a 503 error
        return res.status(503).json({
          error_code: "ERROR_FAILED_TO_CONFIRM_TRANSFER",
        });
      } else {
        next();
      }
    }, 2000); // Delay of 2000ms (2 seconds)
  } else if (req.method === "GET" && req.url === "/transfer") {
    // send는 post만 지원되도록 함
    res.status(404).json({ error: "Not Found" });
  } else {
    next();
  }
};
