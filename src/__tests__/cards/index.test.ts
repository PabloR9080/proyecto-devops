import mocked from "next/jest.js";
import { NextApiRequest, NextApiResponse } from "next";
import handler from "../../pages/api/cards/index";
import handler2 from "../../pages/api/cards/[id]";
import { db } from "../../lib/db";

jest.mock("../../lib/db", () => ({
  db: {
    card: {
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
    it("should return all cards", async () => {
      const cards = [
        {
          id: "83a90301-c117-4b49-9ef1-1bccf612e5b0",
          type: "debit",
          bankName: "Santander",
          number: "3424354365783421",
          expiryDate: "2024-03",
          createdDate: new Date(),
          updatedDate: new Date(),
        },
        {
          id: "01a20302-c547-4b49-9ef1-1bccf612e5b0",
          type: "credit",
          bankName: "BBVA",
          number: "8974354365783421",
          expiryDate: "2024-03",
          createdDate: new Date(),
          updatedDate: new Date(),
        },
      ];
      db.card.findMany.mockResolvedValueOnce(cards);

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(db.card.findMany).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(cards);
    });

    it("should return 500 if an error occurs", async () => {
      db.card.findMany.mockRejectedValueOnce(new Error());

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(db.card.findMany).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error retrieving cards",
      });
    });
  });

  describe("POST method", () => {
    beforeEach(() => {
      req.method = "POST";
      req.body = {
        id: "83a90301-c117-4b49-9ef1-1bccf612e5b0",
        type: "debit",
        bankName: "Santander",
        number: "3424354365783421",
        expiryDate: "2024-03",
        accountId: null,
      };
    });

    it("should create a new card", async () => {
      const newCard = {
        id: "83a90301-c117-4b49-9ef1-1bccf612e5b0",
        type: "debit",
        bankName: "Santander",
        number: "3424354365783421",
        expiryDate: "2024-03",
        accountId: null,
      };
      db.card.create.mockResolvedValueOnce(newCard);

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(db.card.create).toHaveBeenCalledWith({
        data: {
          type: "debit",
          bankName: "Santander",
          number: "3424354365783421",
          expiryDate: "2024-03",
          accountId: null,
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newCard);
    });

    it("should return 500 if an error occurs", async () => {
      db.card.create.mockRejectedValueOnce(new Error());
      
      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(db.card.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error creating card",
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

describe("GET /api/cards/[id]", () => {
  it("should return card data", async () => {
    const mockCard = {
      id: "83a90301-c117-4b49-9ef1-1bccf612e5b0",
      type: "debit",
      bankName: "Santander",
      number: "3424354365783421",
      expiryDate: "2024-03",
      createdDate: new Date(),
      updatedDate: new Date(),
    };
    const mockFindUnique = jest.fn().mockResolvedValueOnce(mockCard);
    db.card.findUnique = mockFindUnique;

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
    expect(res.json).toHaveBeenCalledWith(mockCard);
  });

  it("should return 404 when card is not found", async () => {
    const mockFindUnique = jest.fn().mockResolvedValueOnce(null);
    db.card.findUnique = mockFindUnique;

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
    expect(res.json).toHaveBeenCalledWith({ message: "Card not found" });
  });
});

describe("PUT /api/cards/[id]", () => {
  it("should update card data", async () => {
    const mockUpdatedCard = {
      id: "83a90301-c117-4b49-9ef1-1bccf612e5b0",
      type: "debit",
      bankName: "Santander",
      number: "3424354365783421",
      expiryDate: "2023-03",
      createdDate: "2023-03-31T00:11:28.939Z",
      updatedDate: "2023-03-31T00:11:28.939Z",
    };
    const mockUpdate = jest.fn().mockResolvedValueOnce(mockUpdatedCard);
    db.card.update = mockUpdate;

    const req = {
      method: "PUT",
      query: {
        id: "83a90301-c117-4b49-9ef1-1bccf612e5b0",
      },
      body: {
        type: "debit",
        bankName: "Santander",
        number: "3424354365783421",
        expiryDate: "2025-03",
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
        type: "debit",
        bankName: "Santander",
        number: "3424354365783421",
        expiryDate: "2025-03",
      },
    });
    expect(res.json).toHaveBeenCalledWith(mockUpdatedCard);
  });
});
