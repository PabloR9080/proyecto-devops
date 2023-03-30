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
  // Edit Card
  else if (req.method === "PUT") {
    const { type, bankName, number, expiryDate } = req.body;

    const updatedCard = await db.card.update({
      where: { id: id as string },
      data: { type, bankName, number, expiryDate },
    });

    res.json(updatedCard);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
