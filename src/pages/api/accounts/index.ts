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
      const accounts = await db.account.findMany();
      res.json(accounts);
      break;
    // Create account
    case "POST":
      const { name, balance, createDate, lastLoginDate, cards } =
        req.body;
      const newAccount = await db.account.create({
        data: {
          name,
          balance,
          createDate,
          lastLoginDate,
          cards: null,
        },
      });
      res.status(201).json(newAccount);
      break;
    default:
      res.status(405).json({ message: "Method not allowed" });
  }
}
