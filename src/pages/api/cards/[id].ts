import { db } from "../../../lib/db";
import { NextApiRequest, NextApiResponse } from "next";

// Get cards by id
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "ID required" });
  }

  try {
    const card = await db.card.findUnique({ where: { id: id as string } });

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    return res.status(200).json(card);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving card" });
  }
}
