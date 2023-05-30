import { db } from "../../../lib/db";
import NextCors from "nextjs-cors";
import bcrypt, { compare } from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@prisma/client";
import tokenManager from "../../../utils/jsonwebtoken";
import { useSession, signIn, signOut } from "next-auth/react";

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

    await db.user.update({
        where: {
            email: req.body.email,
        },
        data: {
            lastLoginDate: new Date(),
        } as Prisma.UserUpdateInput,
    });
    /* const response = await signIn("credentials", {
      redirect: false,
      email: req.body.email,
      password: req.body.password,
      callbackUrl: "/",
    });
    const { data: session } = useSession();
    console.log(session?.user?.id)
    console.log(response)
    if (response?.error) {
      res.status(500).json({ error: "Internal server error singin" });
    } */

    const accessToken = await tokenManager.GenerateToken(
      {
        userName: user.name,
      }
    );

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
