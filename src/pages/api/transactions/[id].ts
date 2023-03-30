import { db } from "../../../lib/db";
import { NextApiRequest, NextApiResponse } from "next";

// Get Transaction by Id, Edit Transaction, Delete Transaction
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
    // Get transaction by id
    case "GET":
      try {
        const transaction = await db.transaction.findUnique({ where: { id: id as string } });

        if (!transaction) {
          res.status(404).json({ message: "Transaction not found" });
        }

        res.status(200).json(transaction);
      } catch (error) {
        res.status(500).json({ message: "Error retrieving card" });
      }
      break;
    // Edit transaction
    case "PUT":
        const { type, amount, description, cardOrigin, transactionDate } = req.body;

      const updatedTransaction = await db.transaction.update({
        where: { id: id as string },
        data: {
            type,
            amount,
            description,
            cardOrigin,
            transactionDate,
          },
      });
      res.json(updatedTransaction);
      break;
    // Delete transaction
    case "DELETE":
      if (id) {
        const transaction = await db.transaction.delete({ where: { id: id as string } });

        if (transaction) {
          res.status(204).end();
        } else {
          res.status(404).json({ message: "Transaction not found" });
        }
      } else {
        res.status(400).json({ message: "ID required" });
      }
      break;
    default:
      res.status(405).json({ message: "Method not allowed" });
  }
}
