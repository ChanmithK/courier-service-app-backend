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

// Protect all shipment routes
router.use(authenticateToken);

// Create a new shipment
router.post("/", createShipment);

// Track shipment by tracking number
router.get("/track/:tracking_number", trackShipment);

// Get shipments for logged-in user
router.get("/my-shipments", getUserShipments);

// Get all shipments (admin only)
router.get("/all", getAllShipments);

// Update shipment status (admin only)
router.patch("/:tracking_number/status", updateShipmentStatus);

export default router;
