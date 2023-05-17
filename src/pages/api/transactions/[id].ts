import { db } from "../../../lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { log } from "../../../utils/logger";
import NextCors from "nextjs-cors";

const ENDPOINT = "transaction";
// Get Transaction by Id, Edit Transaction, Delete Transaction
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
  const { id } = req.query;

  if (!id) {
    log.warn(`ID required in resource ${ENDPOINT}`);
    return res.status(400).json({ message: "ID required" });
  }

  switch (method) {
    // Get transaction by id
    case "GET":
      try {
        const transaction = await db.transaction.findUnique({
          where: { id: id as string },
        });

        if (!transaction) {
          log.warn(`[${method}] ${ENDPOINT} resource with id ${id} not found`);
          res.status(404).json({ message: "Transaction not found" });
        }
        log.debug(`[${method}] ${ENDPOINT} resource with id ${id} found`);
        res.status(200).json(transaction);
      } catch (error) {
        log.error(`[${method}] an error ocurred in resource ${ENDPOINT}`);
        res.status(500).json({ message: "Error retrieving transaction" });
      }
      break;
    // Edit transaction
    case "PUT":
      const { type, amount, description, cardOrigin, transactionDate } =
        req.body;

      const updatedTransaction = await db.transaction.update({
        where: { id: id as string },
        data: {
          type,
          amount,
          description,
          cardOrigin,
          transactionDate,
        },
      });
      log.debug(`[${method}] ${ENDPOINT} resource with id ${id} updated`);
      log.debug(req.body);
      res.json(updatedTransaction);
      break;
    // Delete transaction
    case "DELETE":
      if (id) {
        const transaction = await db.transaction.delete({
          where: { id: id as string },
        });

        if (transaction) {
          log.debug(`[${method}] ${ENDPOINT} resource with id ${id} deleted`);
          res.status(204).end();
        } else {
          log.warn(`[${method}] ${ENDPOINT} resource with id ${id} NOT found`);
          res.status(404).json({ message: "Transaction not found" });
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
