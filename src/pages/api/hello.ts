import { NextApiRequest, NextApiResponse } from "next";
import { log } from '../../utils/logger';

type Data = {
  message: string;
};

export const config = {
  runtime: "edge",
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if(req.url == undefined){
    return ;
  }
  log.debug("hello called");
  const { searchParams } = new URL(req.url);
  log.warn(`parametros: ${searchParams}`);
  const name = searchParams.get("name") || "Pablo";
  return new Response(JSON.stringify({ message: `Hello ${name}` }), {
    status: 200,
  });
}
