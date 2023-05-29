import * as jwt from "jsonwebtoken";

class DecoderJwt {
  public async DecodeToken<I>(
    token: string
  ): Promise<I | null> {
    try {
      const privatekey = (process.env.NEXT_PUBLIC_TOKEN_SECRET) ? process.env.NEXT_PUBLIC_TOKEN_SECRET : "c09f26e402f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611"

      const decode = jwt.verify(token, privatekey) as I;
      return decode;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public async GenerateToken(
    payload: object,
    time: string = "1h"
  ): Promise<string> {
    const privatekey = (process.env.NEXT_PUBLIC_TOKEN_SECRET) ? process.env.NEXT_PUBLIC_TOKEN_SECRET : "c09f26e402f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611"

    return jwt.sign(payload, privatekey, {expiresIn: `${time}`});
  }
}

const tokenManager = new DecoderJwt();

export default tokenManager;
