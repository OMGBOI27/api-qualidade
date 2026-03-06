// schemas.ts
const errorResponse = {
  type: "object",
  properties: {
    error: {
      type: "object",
      properties: {
        code: { type: "string", example: "VALIDATION_ERROR" },
        message: { type: "string", example: "Invalid input" }
      },
      required: ["code", "message"]
    }
  },
  required: ["error"]
};

const userProperties = {
  id: { type: "string" },
  name: { type: "string" },
  email: { type: "string" },
  createdAt: { type: "string", format: "date-time" }
};

const createUserRequestSchema = {
  type: "object",
  properties: {
    name: { type: "string", example: "Alice" },
    email: { type: "string", format: "email", example: "alice@mail.com" },
    password: { type: "string", minLength: 8, example: "12345678" }
  },
  required: ["name", "email", "password"]
};

const createCardRequestSchema = {
  type: "object",
  properties: {
    userId: { type: "string", example: "user-id" },
    cardNumber: { type: "string", pattern: String.raw`^\d{16}$`, example: "1234123412341234" },
    limitCents: { type: "integer", minimum: 100, example: 500000 }
  },
  required: ["userId", "cardNumber", "limitCents"]
};

const cardResponseSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    userId: { type: "string" },
    last4: { type: "string", example: "1234" },
    limitCents: { type: "integer" },
    availableLimitCents: { type: "integer" },
    status: { type: "string", enum: ["ACTIVE", "BLOCKED"] },
    createdAt: { type: "string", format: "date-time" }
  },
  required: ["id", "userId", "last4", "limitCents", "availableLimitCents", "status", "createdAt"]
};

const transactionResponseSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    cardId: { type: "string" },
    userId: { type: "string" },
    amountCents: { type: "integer" },
    description: { type: "string" },
    status: { type: "string", enum: ["PENDING", "APPROVED", "DECLINED", "CANCELLED", "CHARGEBACK"] },
    referenceMonth: { type: "string", example: "2026-03" },
    createdAt: { type: "string", format: "date-time" },
    cancelledAt: { type: "string", format: "date-time", nullable: true },
    chargebackAt: { type: "string", format: "date-time", nullable: true }
  },
  required: [
    "id",
    "cardId",
    "userId",
    "amountCents",
    "description",
    "status",
    "referenceMonth",
    "createdAt"
  ]
};

const invoiceResponseSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    cardId: { type: "string" },
    userId: { type: "string" },
    referenceMonth: { type: "string", example: "2026-03" },
    totalCents: { type: "integer" },
    transactionIds: { type: "array", items: { type: "string" } },
    generatedAt: { type: "string", format: "date-time" }
  },
  required: ["id", "cardId", "userId", "referenceMonth", "totalCents", "transactionIds", "generatedAt"]
};

export {
  errorResponse,
  userProperties,
  createUserRequestSchema,
  createCardRequestSchema,
  cardResponseSchema,
  transactionResponseSchema,
  invoiceResponseSchema
};