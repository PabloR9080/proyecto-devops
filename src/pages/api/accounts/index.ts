import { db } from "../../../lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    // Get all accounts
    case "GET":
      try {
        const accounts = await db.account.findMany();
        res.json(accounts);
      } catch (error) {
        res.status(500).json({ message: "Error retrieving accounts" });
      }
      break;
    // Create account
    case "POST":
      try {
        const { name, balance, createDate, lastLoginDate, cards, userId } =
          req.body;
        const newAccount = await db.account.create({
          data: {
            name,
            balance,
            createDate: undefined,
            lastLoginDate,
            cards: undefined,
            userId,
          },
        });
        res.status(201).json(newAccount);
      } catch (error){
          res.status(500).json({ message: "Error creating account" });
      }
      break;
    default:
      res.status(405).json({ message: "Method not allowed" });
  }
}
