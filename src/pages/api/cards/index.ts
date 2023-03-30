import { db } from "../../../lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Create Card
  if (req.method === "POST") {
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
  }
  // Get all cards
  else if (req.method === "GET") {
    const cards = await db.card.findMany();

    res.json(cards);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
