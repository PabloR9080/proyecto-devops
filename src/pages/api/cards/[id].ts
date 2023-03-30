import { db } from "../../../lib/db";
import { NextApiRequest, NextApiResponse } from "next";

// Get Card by id, Edit Card, Delete Card
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "ID required" });
  }

  if (req.method === "GET") {
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

  // Edit Card
  else if (req.method === "PUT") {
    const { type, bankName, number, expiryDate } = req.body;

    const updatedCard = await db.card.update({
      where: { id: id as string },
      data: { type, bankName, number, expiryDate },
    });

    res.json(updatedCard);
  }
  // Delete card
  else if (req.method === "DELETE") {
    if (id) {
      const card = await db.card.delete({ where: { id: id as string } });

      if (card) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: "Card not found" });
      }
    } else {
      res.status(400).json({ message: "ID required" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
