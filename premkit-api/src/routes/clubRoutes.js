import express from "express";
import { ClubController } from "../controllers/clubController.js";

const router = express.Router();

router.get("/", ClubController.getAll);
router.get("/:id", ClubController.getById);
router.post("/", ClubController.create);
router.put("/:id", ClubController.update);
router.delete("/:id", ClubController.remove);

export default router;