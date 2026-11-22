import express from "express";
import { JerseyController } from "../controllers/jerseyController.js";

const router = express.Router();

router.get("/", JerseyController.getAll);
router.get("/:id", JerseyController.getById);
router.post("/", JerseyController.create);
router.put("/:id", JerseyController.update);
router.delete("/:id", JerseyController.remove);

export default router;