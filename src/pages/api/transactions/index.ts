import { db } from "../../../lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import tokenManager from "../../../utils/jsonwebtoken";

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

  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó un token de acceso.' });
  }

  try {
    const decode = await tokenManager.DecodeToken(token);
    if(!decode){
      return res.status(401).json({ message: 'Token inválido.' });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido.' });
  }

  switch (method) {
    // Get all transactions
    case "GET":
      try {
        const transactions = await db.transaction.findMany();
        res.json(transactions);
      } catch (error) {
        res.status(500).json({ message: "Error retrieving transactions" });
      }
      break;
    // Create transaction
    case "POST":
      try {
        const { type, amount, description, cardOrigin, transactionDate } =
          req.body;

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
      } catch (error) {
        res.status(500).json({ message: "Error creating transactions" });
      }
      break;
    default:
      res.status(405).json({ message: "Method not allowed" });
  }
}
