import mocked from "next/jest.js";
import { NextApiRequest, NextApiResponse } from "next";
import handler from "../../pages/api/accounts/index";
import handler2 from "../../pages/api/accounts/[id]";
import { db } from "../../lib/db";

jest.mock("../../lib/db", () => ({
  db: {
    account: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe("handler", () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;

  beforeEach(() => {
    req = {
      method: "GET",
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("GET method", () => {
    it("should return all accounts", async () => {
      const accounts = [
        { id: "01a20302-c547-4b49-9ef1-1bccf612e5b0", name: "Account 1" },
        { id: "83a90301-c117-4b49-9ef1-1bccf612e5b0", name: "Account 2" },
      ];
      db.account.findMany.mockResolvedValueOnce(accounts);

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(db.account.findMany).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(accounts);
    });

    it("should return 500 if an error occurs", async () => {
      db.account.findMany.mockRejectedValueOnce(new Error());

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(db.account.findMany).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error retrieving accounts",
      });
    });
  });

  describe("POST method", () => {
    beforeEach(() => {
      req.method = "POST";
      req.body = {
        name: "New account",
        balance: 100,
        createDate: new Date(),
        lastLoginDate: new Date(),
        cards: [],
        userId: "1",
      };
    });

    it("should create a new account", async () => {
      const newAccount = {
        id: "83a90301-c117-4b49-9ef1-1bccf612e5b0",
        name: "New account",
        balance: 100,
        userId: "1",
      };
      db.account.create.mockResolvedValueOnce(newAccount);

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(db.account.create).toHaveBeenCalledWith({
        data: {
          name: "New account",
          balance: 100,
          createDate: undefined,
          lastLoginDate: expect.any(Date),
          cards: undefined,
          userId: "1",
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newAccount);
    });

    it("should return 500 if an error occurs", async () => {
      db.account.create.mockRejectedValueOnce(new Error());

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(db.account.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error creating account",
      });
    });
  });

  describe("Method not allowed", () => {
    it("should return 405", async () => {
      req.method = "PUT";

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(res.status).toHaveBeenCalledWith(405);
      expect(res.json).toHaveBeenCalledWith({ message: "Method not allowed" });
    });
  });
});

describe("GET /api/accounts/[id]", () => {
  it("should return account data", async () => {
    const mockAccount = {
      id: "83a90301-c117-4b49-9ef1-1bccf612e5b0",
      name: "Cuenta de Ednover",
      balance: 0,
      createDate: "2023-03-30T18:46:34.644Z",
      lastLoginDate: undefined,
      cards: undefined,
      userId: "7dd93a0f-31f7-4ed6-92f3-dacdfdf9dadc",
    };
    const mockFindUnique = jest.fn().mockResolvedValueOnce(mockAccount);
    db.account.findUnique = mockFindUnique;

    const req = {
      method: "GET",
      query: { id: "83a90301-c117-4b49-9ef1-1bccf612e5b0" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as NextApiResponse;

    await handler2(req, res);

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: "83a90301-c117-4b49-9ef1-1bccf612e5b0" },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockAccount);
  });

  it("should return 404 when account is not found", async () => {
    const mockFindUnique = jest.fn().mockResolvedValueOnce(null);
    db.account.findUnique = mockFindUnique;

    const req = {
      method: "GET",
      query: { id: "83a90301-c117-4b49-9ef1-1bccf612e5b0" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as NextApiResponse;

    await handler2(req, res);

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: "83a90301-c117-4b49-9ef1-1bccf612e5b0" },
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Account not found" });
  });
});

describe("PUT /api/accounts/[id]", () => {
  it("should update account data", async () => {
    const mockUpdatedAccount = {
      id: "83a90301-c117-4b49-9ef1-1bccf612e5b0",
      name: "Cuenta de Ednover",
      balance: 0,
      createDate: "2023-03-30T18:46:34.644Z",
      lastLoginDate: undefined,
      cards: undefined,
      userId: "7dd93a0f-31f7-4ed6-92f3-dacdfdf9dadc",
    };
    const mockUpdate = jest.fn().mockResolvedValueOnce(mockUpdatedAccount);
    db.account.update = mockUpdate;

    const req = {
      method: "PUT",
      query: {
        id: "83a90301-c117-4b49-9ef1-1bccf612e5b0",
      },
      body: {
        name: "Cuenta test",
        balance: 20,
        createDate: "2023-03-30T18:46:34.644Z",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as NextApiResponse;

    await handler2(req, res);

    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "83a90301-c117-4b49-9ef1-1bccf612e5b0" },
      data: {
        name: "Cuenta test",
        balance: 20,
        createDate: "2023-03-30T18:46:34.644Z",
        lastLoginDate: undefined,
      },
    });
    expect(res.json).toHaveBeenCalledWith(mockUpdatedAccount);
  });
});
