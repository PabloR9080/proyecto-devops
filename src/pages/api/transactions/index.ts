import { db } from "../../../lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    // Get all transactions
    case "GET":
      const transactions = await db.transaction.findMany();
      res.json(transactions);
      break;
    // Create transaction
    case "POST":
      const { type, amount, description, cardOrigin, transactionDate } = req.body;

      const newTransaction = await db.transaction.create({
        data: {
          type,
          amount,
          description,
          cardOrigin,
          transactionDate,
        },
      });
      res.status(201).json(newTransaction);
      break;
    default:
      res.status(405).json({ message: "Method not allowed" });
  }
}
