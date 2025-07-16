import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err.message);
});

app.get("/payment-service", (req, res) => {
  res.send("Payment received");
});

app.listen(8000, () => {
  console.log("Payment Service is running on PORT 8000.");
});
