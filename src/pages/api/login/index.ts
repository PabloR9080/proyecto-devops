import { db } from "../../../lib/db";
import NextCors from "nextjs-cors";
import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@prisma/client";
import tokenManager from "../../../utils/jsonwebtoken";

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
    const user = await db.user.findFirst({
      where: {
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 12),
      },
      select: {
        email: true,
        id: true,
        name: true,
      },
    });

    if (!user) throw new Error("User not exist");

    await db.user.update({
        where: {
            email: req.body.email,
        },
        data: {
            lastLoginDate: new Date(),
        } as Prisma.UserUpdateInput,
    });

    const accessToken = await tokenManager.GenerateToken(
      {
        userName: user.name,
      }
    );

    res.status(200).json({
      user: {
        email: user.name,
        accessToken: accessToken
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
