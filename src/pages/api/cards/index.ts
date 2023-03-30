import { db } from "../../../lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    // Get all cards
    case "GET":
      const cards = await db.card.findMany();
      res.json(cards);
      break;
    // Create card
    case "POST":
      const { type, bankName, number, expiryDate, accountId } = req.body;
      const newCard = await db.card.create({
        data: {
          type,
          bankName,
          number,
          expiryDate,
          accountId: null,
        },
      });
      res.status(201).json(newCard);
      break;
    default:
      res.status(405).json({ message: "Method not allowed" });
  }
}
