import { db } from "../../../lib/db";
import NextCors from "nextjs-cors";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await NextCors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200,
  });
  const { method } = req;

  switch (method) {
    // Get all budgets
    case "GET":
      try {
        const budgets = await db.budget.findMany();
        res.json(budgets);
      } catch (error) {
        res.status(500).json({ message: "Error retrieving budgets" });
      }
      break;
    // Create budget
    case "POST":
      try {
        const { name, description, amount, amountLeft, startDate, endDate } =
          req.body;
        const newBudget = await db.budget.create({
          data: {
            name,
            description,
            amount,
            amountLeft,
            startDate,
            endDate,
          },
        });
        res.status(201).json(newBudget);
      } catch (error) {
        res.status(500).json({ message: "Error creating budget" });
      }
      break;
    default:
      res.status(405).json({ message: "Method not allowed" });
  }
}
