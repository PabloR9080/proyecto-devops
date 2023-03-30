import { db } from "../../../lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    // Get all budgets
    case "GET":
      const budgets = await db.budget.findMany();
      res.json(budgets);
      break;
    default:
      res.status(405).json({ message: "Method not allowed" });
  }
}