import { db } from "../../../lib/db";
import { NextApiRequest, NextApiResponse } from "next";

// Get Budget by Id, Edit Budget, Delete Budget
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
    // Get budget by id
    case "GET":
      try {
        const budget = await db.budget.findUnique({
          where: { id: id as string },
        });

        if (!budget) {
          res.status(404).json({ message: "Budget not found" });
        }

        res.status(200).json(budget);
      } catch (error) {
        res.status(500).json({ message: "Error retrieving budget" });
      }
      break;
    default:
      res.status(405).json({ message: "Method not allowed" });
  }
}
