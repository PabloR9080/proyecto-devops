import { db } from "../../../lib/db";
import NextCors from "nextjs-cors";
import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await NextCors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200,
  });
  try {
    const user = await db.user.create({
      data: {
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 12),
        name: req.body.name,
      },
    });

    res.status(200).json({
      user: {
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
