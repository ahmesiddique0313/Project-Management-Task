import connectDatabase from "./config/db.js";
import app from "./app.js";

const port = process.env.PORT || 5000;
connectDatabase()
  .then(() =>
    app.listen(port, "0.0.0.0", () =>
      console.log(`API listening on port ${port}`),
    ),
  )
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
