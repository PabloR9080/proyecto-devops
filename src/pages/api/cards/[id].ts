import { db } from "../../../lib/db";
import { NextApiRequest, NextApiResponse } from "next";

// Get Card by id, Edit Card, Delete Card
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "ID required" });
  }

  switch (method) {
    // Get card by id
    case "GET":
      try {
        const card = await db.card.findUnique({ where: { id: id as string } });

        if (!card) {
          res.status(404).json({ message: "Card not found" });
        }

        res.status(200).json(card);
      } catch (error) {
        res.status(500).json({ message: "Error retrieving card" });
      }
      break;
    // Edit card
    case "PUT":
      const { type, bankName, number, expiryDate } = req.body;

      const updatedCard = await db.card.update({
        where: { id: id as string },
        data: { type, bankName, number, expiryDate },
      });
      res.json(updatedCard);
      break;
    // Delete card
    case "DELETE":
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
      break;
    default:
      res.status(405).json({ message: "Method not allowed" });
  }
}
