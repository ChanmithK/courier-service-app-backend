import type { Response } from "express";
import { ShipmentModel } from "../models/Shipment.js";
import { UserModel } from "../models/User.js";
import type { AuthRequest } from "../types/index.js";

const shipmentModel = new ShipmentModel();
const userModel = new UserModel();

export const createShipment = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await userModel.findById(req.user!.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const {
      recipient_name,
      recipient_address,
      package_description,
      package_weight,
      package_dimensions,
    } = req.body;

    // Generate tracking number
    const tracking_number =
      "TRK" +
      Date.now() +
      Math.random().toString(36).substr(2, 5).toUpperCase();

    const shipment = await shipmentModel.create({
      tracking_number,
      user_id: req.user!.id,
      sender_name: user.contact_name,
      sender_address: user.address,
      recipient_name,
      recipient_address,
      package_description,
      package_weight,
      package_dimensions,
      status: "Pending",
    });

    res.status(201).json({
      message: "Shipment created successfully",
      shipment,
    });
  } catch (error) {
    console.error("Create shipment error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const trackShipment = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { tracking_number } = req.params;

    const shipment = await shipmentModel.findByTrackingNumber(tracking_number);
    if (!shipment) {
      res.status(404).json({ message: "Shipment not found" });
      return;
    }

    // Check if user owns the shipment or is admin
    if (shipment.user_id !== req.user!.id && !req.user!.is_admin) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    res.json({ shipment });
  } catch (error) {
    console.error("Track shipment error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserShipments = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const shipments = await shipmentModel.findByUserId(req.user!.id);
    res.json({ shipments });
  } catch (error) {
    console.error("Get shipments error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllShipments = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user!.is_admin) {
      res.status(403).json({ message: "Admin access required" });
      return;
    }

    const shipments = await shipmentModel.findAll();
    res.json({ shipments });
  } catch (error) {
    console.error("Get all shipments error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateShipmentStatus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user!.is_admin) {
      res.status(403).json({ message: "Admin access required" });
      return;
    }

    const { tracking_number } = req.params;
    const { status } = req.body;

    const shipment = await shipmentModel.updateStatus(tracking_number, status);
    if (!shipment) {
      res.status(404).json({ message: "Shipment not found" });
      return;
    }

    res.json({ message: "Status updated successfully", shipment });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
