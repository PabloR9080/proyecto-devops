import mocked from "next/jest.js";
import { NextApiRequest, NextApiResponse } from "next";
import handler from "../../pages/api/budgets/index";
import handler2 from "../../pages/api/budgets/[id]";
import { db } from "../../lib/db";

jest.mock("../../lib/db", () => ({
  db: {
    budget: {
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
    it("should return all budgets", async () => {
      const budgets = [
        {
          id: "83a90301-c117-4b49-9ef1-1bccf612e5b0",
          name: "June",
          description: "june",
          amount: 2000,
          amountLeft: 2000,
          startDate: "2023-03-31T00:11:28.939Z",
          endDate: "2023-03-31T00:11:28.939Z",
        },
        {
          id: "01a20302-c547-4b49-9ef1-1bccf612e5b0",
          name: "November",
          description: "november",
          amount: 3000,
          amountLeft: 3000,
          startDate: "2023-03-31T00:11:28.939Z",
          endDate: "2023-03-31T00:11:28.939Z",
        },
      ];
      db.budget.findMany.mockResolvedValueOnce(budgets);

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(db.budget.findMany).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(budgets);
    });

    it("should return 500 if an error occurs", async () => {
      db.budget.findMany.mockRejectedValueOnce(new Error());

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(db.budget.findMany).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error retrieving budgets",
      });
    });
  });

  describe("POST method", () => {
    beforeEach(() => {
      req.method = "POST";
      req.body = {
          id: "01a20302-c547-4b49-9ef1-1bccf612e5b0",
          name: "November",
          description: "november",
          amount: 3000,
          amountLeft: 3000,
          startDate: "2023-03-31T00:11:28.939Z",
          endDate: "2023-03-31T00:11:28.939Z",
      };
    });

    it("should create a new budget", async () => {
      const newbudget = {
        id: "01a20302-c547-4b49-9ef1-1bccf612e5b0",
          name: "November",
          description: "november",
          amount: 3000,
          amountLeft: 3000,
          startDate: "2023-03-31T00:11:28.939Z",
          endDate: "2023-03-31T00:11:28.939Z",
      };
      db.budget.create.mockResolvedValueOnce(newbudget);

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(db.budget.create).toHaveBeenCalledWith({
        data: {
            name: "November",
            description: "november",
            amount: 3000,
            amountLeft: 3000,
            startDate: "2023-03-31T00:11:28.939Z",
            endDate: "2023-03-31T00:11:28.939Z",
            createdAt: undefined,
            updatedAt: undefined,
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newbudget);
    });

    it("should return 500 if an error occurs", async () => {
      db.budget.create.mockRejectedValueOnce(new Error());

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(db.budget.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error creating budget",
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

describe("GET /api/budgets/[id]", () => {
  it("should return budget data", async () => {
    const mockbudget = {
      id: "83a90301-c117-4b49-9ef1-1bccf612e5b0",
      type: "income",
      amount: 100,
      description: undefined,
      budgetDate: new Date(),
      cardOrigin: undefined,
    };
    const mockFindUnique = jest.fn().mockResolvedValueOnce(mockbudget);
    db.budget.findUnique = mockFindUnique;

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
    expect(res.json).toHaveBeenCalledWith(mockbudget);
  });

  it("should return 404 when budget is not found", async () => {
    const mockFindUnique = jest.fn().mockResolvedValueOnce(null);
    db.budget.findUnique = mockFindUnique;

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
    expect(res.json).toHaveBeenCalledWith({ message: "Budget not found" });
  });
});

describe("PUT /api/budgets/[id]", () => {
  it("should update budget data", async () => {
    const mockUpdatedBudget = {
      id: "83a90301-c117-4b49-9ef1-1bccf612e5b0",
      name: "November",
      description: "november",
      amount: 3000,
      amountLeft: 3000,
      startDate: "2023-03-31T00:11:28.939Z",
      endDate: "2023-03-31T00:11:28.939Z",
    };
    const mockUpdate = jest.fn().mockResolvedValueOnce(mockUpdatedBudget);
    db.budget.update = mockUpdate;

    const req = {
      method: "PUT",
      query: {
        id: "83a90301-c117-4b49-9ef1-1bccf612e5b0",
      },
      body: {
        name: "November",
        description: "november",
        amount: 3000,
        amountLeft: 2000,
        endDate: "2023-05-20T00:11:28.939Z",
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
        name: "November",
        description: "november",
        amountLeft: 2000,
        endDate: "2023-05-20T00:11:28.939Z",
      },
    });
    expect(res.json).toHaveBeenCalledWith(mockUpdatedBudget);
  });
});
