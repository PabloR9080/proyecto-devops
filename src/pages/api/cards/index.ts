import { db } from "../../../lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  // Create Card
  if (req.method === "POST") {
    const { type, bankName, number, expiryDate, accountId } = req.body;

    const newCard = await db.card.create({
      data: {
        type,
        bankName,
        number,
        expiryDate,
        accountId,
      },
    });

    res.status(201).json(newCard);
  }
  // Get all cards or by id
  else if (req.method === "GET") {
    if (id) {
      const card = await db.card.findUnique({ where: { id: id as string } });

      if (card) {
        res.json(card);
      } else {
        res.status(404).json({ message: "Card not found" });
      }
    } else {
      const cards = await db.card.findMany();

      res.json(cards);
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
