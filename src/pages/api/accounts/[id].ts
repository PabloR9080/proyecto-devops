import { db } from "../../../lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { log } from '../../../utils/logger';

const ENDPOINT = "accounts"
// Get Account by Id, Edit Account, Delete Account
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { id } = req.query;

  if (!id) {
    log.error("No id specified in endpoint"+ENDPOINT+" call")
    return res.status(400).json({ message: "ID required" });
  }

  switch (method) {
    // Get account by id
    case "GET":
      try {
        const account = await db.account.findUnique({ where: { id: id as string } });

        if (!account) {
          log.warn(`[${method}] ${ENDPOINT} resource with id ${id} not found`)
          res.status(404).json({ message: "Account not found" });
        }
        log.debug(`[${method}] ${ENDPOINT} resource with id ${id} found`)
        res.status(200).json(account);
      } catch (error) {
        log.error(`[${method}] an error ocurred in resource ${ENDPOINT}`)
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
      log.debug(`[${method}] ${ENDPOINT} resource with id ${id} updated`);
      log.debug(req.body)
      res.json(updatedAccount);
      break;
    // Delete account
    case "DELETE":
      if (id) {
        const account = await db.account.delete({ where: { id: id as string } });
        if (account) {
          log.debug(`[${method}] ${ENDPOINT} resource with id ${id} deleted`);
          res.status(204).end();
        } else {
          log.warn(`[${method}] ${ENDPOINT} resource with id ${id} NOT found`);
          res.status(404).json({ message: "Account not found" });
        }
      } else {
        log.warn(`[${method}] no id in ${ENDPOINT} resource defined`);
        res.status(400).json({ message: "ID required" });
      }
      break;
    default:
      log.warn(`method not allowed in ${ENDPOINT} resource`);
      res.status(405).json({ message: "Method not allowed" });
  }
}