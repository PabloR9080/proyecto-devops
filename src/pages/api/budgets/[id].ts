import { db } from "../../../lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import { log } from "../../../utils/logger";
import tokenManager from "../../../utils/jsonwebtoken";

const ENDPOINT = "budget";
// Get Budget by Id, Edit Budget, Delete Budget
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
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "ID required" });
  }

  switch (method) {
    // Get budget by id
    case "GET":
      try {
        const budget = await db.budget.findUnique({
          where: { id: id as string },
        });

        if (!budget) {
          log.warn(`[${method}] ${ENDPOINT} resource with id ${id} not found`);
          res.status(404).json({ message: "Budget not found" });
        }
        log.debug(`[${method}] ${ENDPOINT} resource with id ${id} found`);
        res.status(200).json(budget);
      } catch (error) {
        log.error(`[${method}] an error ocurred in resource ${ENDPOINT}`);
        res.status(500).json({ message: "Error retrieving budget" });
      }
      break;
    // Edit budget
    case "PUT":
      const { name, description, amountLeft, endDate } = req.body;

      const updatedBudget = await db.budget.update({
        where: { id: id as string },
        data: { name, description, amountLeft, endDate },
      });
      log.debug(`[${method}] ${ENDPOINT} resource with id ${id} updated`);
      log.debug(updatedBudget);
      res.json(updatedBudget);
      break;
    // Delete budget
    case "DELETE":
      if (id) {
        const budget = await db.budget.delete({ where: { id: id as string } });

        if (budget) {
          log.debug(`[${method}] ${ENDPOINT} resource with id ${id} deleted`);
          res.status(204).end();
        } else {
          log.warn(`[${method}] ${ENDPOINT} resource with id ${id} NOT found`);
          res.status(404).json({ message: "Budget not found" });
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
