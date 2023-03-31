import mocked from "next/jest.js";
import { NextApiRequest, NextApiResponse } from "next";
import handler from "../../pages/api/transactions/index";
import handler2 from "../../pages/api/transactions/[id]";
import { db } from "../../lib/db";

jest.mock("../../lib/db", () => ({
  db: {
    transaction: {
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
    it("should return all transactions", async () => {
      const transactions = [
        { id: "1", name: "Account 1" },
        { id: "2", name: "Account 2" },
      ];
      db.transaction.findMany.mockResolvedValueOnce(transactions);

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(db.transaction.findMany).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(transactions);
    });

    it("should return 500 if an error occurs", async () => {
      db.transaction.findMany.mockRejectedValueOnce(new Error());

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(db.transaction.findMany).toHaveBeenCalled();
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
        type: "income",
        amount: 100,
        cardsOrigin: "1234",
        transactionDate: "2023-03-31T00:11:28.939Z",
      };
    });

    it("should create a new transaction", async () => {
      const newTransaction = {
        id: "3",
        type: "income",
        amount: 100,
      };
      db.transaction.create.mockResolvedValueOnce(newTransaction);

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(db.transaction.create).toHaveBeenCalledWith({
        data: {
          type: "income",
          amount: 100,
          description: undefined,
          transactionDate: "2023-03-31T00:11:28.939Z",
          cardOrigin: undefined,
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newTransaction);
    });

    it("should return 500 if an error occurs", async () => {
      db.transaction.create.mockRejectedValueOnce(new Error());

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(db.transaction.create).toHaveBeenCalled();
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

//ibsjkdjlsnd el otro

jest.mock("../../lib/db");

describe("GET /api/accounts/[id]", () => {
  it("should return account data", async () => {
    const mockTransaction = {
      id: "83a90301-c117-4b49-9ef1-1bccf612e5b0",
      type: "income",
      amount: 100,
      description: undefined,
      transactionDate: new Date(),
      cardOrigin: undefined,
    };
    const mockFindUnique = jest.fn().mockResolvedValueOnce(mockTransaction);
    db.transaction.findUnique = mockFindUnique;

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
    expect(res.json).toHaveBeenCalledWith(mockTransaction);
  });

  it("should return 404 when account is not found", async () => {
    const mockFindUnique = jest.fn().mockResolvedValueOnce(null);
    db.transaction.findUnique = mockFindUnique;

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
    expect(res.json).toHaveBeenCalledWith({ message: "Transaction not found" });
  });
});

describe("PUT /api/accounts/[id]", () => {
  it("should update transaction data", async () => {
    const mockUpdatedTransaction = {
      id: "83a90301-c117-4b49-9ef1-1bccf612e5b0",
      type: "income",
      amount: 100,
      description: undefined,
      transactionDate: new Date(),
      cardOrigin: undefined,
    };
    const mockUpdate = jest.fn().mockResolvedValueOnce(mockUpdatedTransaction);
    db.transaction.update = mockUpdate;

    const req = {
      method: "PUT",
      query: {
        id: "83a90301-c117-4b49-9ef1-1bccf612e5b0",
      },
      body: {
        type: "expense",
        amount: 200,
        transactionDate: "2023-03-31T00:11:28.939Z",
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
        type: "expense",
        amount: 200,
        transactionDate: "2023-03-31T00:11:28.939Z",
        description: undefined,
        cardOrigin: undefined,
      },
    });
    expect(res.json).toHaveBeenCalledWith(mockUpdatedTransaction);
  });
});
