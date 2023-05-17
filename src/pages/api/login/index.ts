import { db } from "../../../lib/db";
import NextCors from "nextjs-cors";
import bcrypt, { compare } from "bcrypt";
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
    const user = await db.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (!user) return null;

    const isPasswordValid = await compare(
      req.body.password,
      user.password
    );

    if (!isPasswordValid) return null;

    console.log("3")
    await db.user.update({
        where: {
            email: req.body.email,
        },
        data: {
            lastLoginDate: new Date(),
        } as Prisma.UserUpdateInput,
    });
    console.log("4")
    const accessToken = await tokenManager.GenerateToken(
      {
        userName: user.name,
      }
    );
    console.log("5")
    res.status(200).json({
      user: {
        name: user.name,
        accessToken: accessToken
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
