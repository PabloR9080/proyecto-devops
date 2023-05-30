import { db } from "../../../lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import { log } from "../../../utils/logger";
import tokenManager from "../../../utils/jsonwebtoken";

const ENDPOINT = "card";
// Get Card by Id, Edit Card, Delete Card
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
  }
  const { method } = req;
  const { id } = req.query;

  if (!id) {
    log.warn(`ID is required in ${ENDPOINT} resource`);
    return res.status(400).json({ message: "ID required" });
  }

  switch (method) {
    // Get card by id
    case "GET":
      try {
        const card = await db.card.findUnique({ where: { id: id as string } });

        if (!card) {
          log.warn(`[${method}}] ${ENDPOINT} resource with ${id} not found`);
          res.status(404).json({ message: "Card not found" });
        }
        log.debug(`[${method}}] ${ENDPOINT} resource with ${id} found`);
        res.status(200).json(card);
      } catch (error) {
        log.error(`[${method}] an error ocurred in resource ${ENDPOINT}`);
        res.status(500).json({ message: "Error retrieving card" });
      }
      break;
    // Edit card
    case "PUT":
      const { type, bankName, number, expiryDate } = req.body;

      const updatedCard = await db.card.update({
        where: { id: id as string },
        data: { type, bankName, number, expiryDate },
      });
      log.debug(`[${method}] ${ENDPOINT} resource with ${id} updated`);
      log.debug(updatedCard);
      res.json(updatedCard);
      break;
    // Delete card
    case "DELETE":
      if (id) {
        const card = await db.card.delete({ where: { id: id as string } });

        if (card) {
          log.debug(`[${method}] ${ENDPOINT} resource with ${id} deleted`);
          //añadir mensaje de delete
          res.status(204).end();
        } else {
          log.warn(`[${method}] ${ENDPOINT} resource with ${id} NOT found`),
            res.status(404).json({ message: "Card not found" });
        }
      } else {
        log.debug(`[${method}] no id in ${ENDPOINT} resource defined`);
        res.status(400).json({ message: "ID required" });
      }
      break;
    default:
      log.warn(`method not allowed in ${ENDPOINT} resource`);
      res.status(405).json({ message: "Method not allowed" });
  }
}
