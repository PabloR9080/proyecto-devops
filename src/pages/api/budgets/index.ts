import { db } from "../../../lib/db";
import NextCors from "nextjs-cors";
import { NextApiRequest, NextApiResponse } from "next";
import tokenManager from "../../../utils/jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (process.env.NODE_ENV !== 'test') {
    await NextCors(req, res, {
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      origin: "*",
      optionsSuccessStatus: 200,
    });
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: 'No se proporcionó un token de acceso.' });
    }
    try {
      const decode = await tokenManager.DecodeToken(token);
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido.' });
    }
  }
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
