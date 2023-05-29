import { db } from "../../../lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import { log } from "../../../utils/logger";
import tokenManager from "../../../utils/jsonwebtoken";

const ENDPOINT = "accounts";

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
    // Get all accounts
    case "GET":
      try {
        const accounts = await db.account.findMany();
        log.debug(`[GET] All accounts on ${ENDPOINT}`);
        res.json(accounts);
      } catch (error) {
        log.error("[GET ALL ACCOUNTS] An error ocurred");
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
        log.debug(`[POST] create a new account`);
        log.debug(newAccount);
        res.status(201).json(newAccount);
      } catch (error) {
        res.status(500).json({ message: "Error creating account" });
      }
      break;
    default:
      log.warn(`Method not allowd on endpoint: ${ENDPOINT}`);
      res.status(405).json({ message: "Method not allowed" });
  }
}
