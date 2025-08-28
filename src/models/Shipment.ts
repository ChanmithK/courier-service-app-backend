import prisma from "../config/database.js";
import type { Shipment } from "../types/index.js";

// Shipment status types
export type ShipmentStatus =
  | "Pending"
  | "InTransit"
  | "Delivered"
  | "Cancelled";

export class ShipmentModel {
  // Create a new shipment
  async create(
    shipmentData: Omit<Shipment, "id" | "created_at" | "updated_at">
  ): Promise<Shipment> {
    return await prisma.shipment.create({
      data: shipmentData,
    });
  }

  // Find shipment by tracking number
  async findByTrackingNumber(
    tracking_number: string
  ): Promise<Shipment | null> {
    return await prisma.shipment.findUnique({
      where: { tracking_number },
    });
  }

  // Get shipments for a specific user with pagination
  async findByUserId(
    user_id: number,
    skip = 0,
    take = 20
  ): Promise<Shipment[]> {
    return await prisma.shipment.findMany({
      where: { user_id },
      orderBy: { created_at: "desc" },
      skip,
      take,
    });
  }

  // Get all shipments with pagination
  async findAll(skip = 0, take = 50): Promise<Shipment[]> {
    return await prisma.shipment.findMany({
      orderBy: { created_at: "desc" },
      skip,
      take,
    });
  }

  // Update shipment status by tracking number
  async updateStatus(
    tracking_number: string,
    status: ShipmentStatus
  ): Promise<Shipment | null> {
    try {
      return await prisma.shipment.update({
        where: { tracking_number },
        data: { status },
      });
    } catch (error: any) {
      // Return null if shipment not found (Prisma P2025)
      if (error.code === "P2025") {
        return null;
      }
      throw error;
    }
  }
}
