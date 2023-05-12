import { db } from "../../../lib/db";
import { NextApiRequest, NextApiResponse } from "next";

// Get Account by Id, Edit Account, Delete Account
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
    // Get account by id
    case "GET":
      try {
        const account = await db.account.findUnique({ where: { id: id as string } });

        if (!account) {
          res.status(404).json({ message: "Account not found" });
        }

        res.status(200).json(account);
      } catch (error) {
        res.status(500).json({ message: "Error retrieving card" });
      }
      break;
    // Edit account
    case "PUT":
      const { name, balance, createDate, lastLoginDate } =
        req.body;
      const updatedAccount = await db.account.update({
        where: { id: id as string },
        data: { name, balance, createDate, lastLoginDate },
      });
      res.json(updatedAccount);
      break;
    // Delete account
    case "DELETE":
      if (id) {
        const account = await db.account.delete({ where: { id: id as string } });

        if (account) {
          res.status(204).end();
        } else {
          res.status(404).json({ message: "Account not found" });
        }
      } else {
        res.status(400).json({ message: "ID required" });
      }
      break;
    default:
      res.status(405).json({ message: "Method not allowed" });
  }
}