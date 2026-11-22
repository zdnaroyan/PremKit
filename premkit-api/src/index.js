import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import clubRoutes from "./routes/clubRoutes.js";
import jerseyRoutes from "./routes/jerseyRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        app: "PremKit API",
        description: "REST API Katalog Jersey Klasik Klub Premier League",
        endpoints: ["/api/clubs", "/api/jerseys"],
    });
});

app.use("/api/clubs", clubRoutes);
app.use("/api/jerseys", jerseyRoutes);

const port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "production") {
    app.listen(port, () => {
        console.log(`PremKit API running on port ${port}`);
    });
}

export default app;