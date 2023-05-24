import { db } from "../../../lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
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
    // Get all cards
    case "GET":
      try {
        const cards = await db.card.findMany();
        res.json(cards);
      } catch (error) {
        res.status(500).json({ message: "Error retrieving cards" });
      }
      break;
    // Create card
    case "POST":
      try {
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
      } catch (error) {
        res.status(500).json({ message: "Error creating card" });
      }
      break;
    default:
      res.status(405).json({ message: "Method not allowed" });
  }
}
