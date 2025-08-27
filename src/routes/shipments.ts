import express from "express";
import {
  createShipment,
  trackShipment,
  getUserShipments,
  getAllShipments,
  updateShipmentStatus,
} from "../controllers/shipmentController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateToken);

router.post("/", createShipment);
router.get("/track/:tracking_number", trackShipment);
router.get("/my-shipments", getUserShipments);
router.get("/all", getAllShipments);
router.patch("/:tracking_number/status", updateShipmentStatus);

export default router;
