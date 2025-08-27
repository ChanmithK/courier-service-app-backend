import prisma from "../config/database.js";
import type { Shipment } from "../types/index.js";

export class ShipmentModel {
  async create(
    shipmentData: Omit<Shipment, "id" | "created_at" | "updated_at">
  ): Promise<Shipment> {
    return await prisma.shipment.create({
      data: shipmentData,
    });
  }

  async findByTrackingNumber(
    tracking_number: string
  ): Promise<Shipment | null> {
    return await prisma.shipment.findUnique({
      where: { tracking_number },
    });
  }

  async findByUserId(user_id: number): Promise<Shipment[]> {
    return await prisma.shipment.findMany({
      where: { user_id },
      orderBy: { created_at: "desc" },
    });
  }

  async findAll(): Promise<Shipment[]> {
    return await prisma.shipment.findMany({
      orderBy: { created_at: "desc" },
    });
  }

  async updateStatus(
    tracking_number: string,
    status: string
  ): Promise<Shipment | null> {
    return await prisma.shipment.update({
      where: { tracking_number },
      data: { status },
    });
  }
}
