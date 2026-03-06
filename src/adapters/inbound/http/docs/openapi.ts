// openApiDocument.ts
import {
  errorResponse,
  userProperties,
  createUserRequestSchema,
  createCardRequestSchema,
  cardResponseSchema,
  transactionResponseSchema,
  invoiceResponseSchema
} from "./schemas";

export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Mini Fintech API",
    version: "1.0.0",
    description: "API para processamento de transacoes financeiras com arquitetura hexagonal"
  },
  servers: [{ url: "/api", description: "Base path local" }],
  tags: [
    { name: "Users" },
    { name: "Cards" },
    { name: "Transactions" },
    { name: "Invoices" }
  ],
  components: {
    schemas: {
      ErrorResponse: errorResponse,
      CreateUserRequest: createUserRequestSchema,
      UserResponse: { type: "object", properties: userProperties, required: Object.keys(userProperties) },
      CreateCardRequest: createCardRequestSchema,
      CardResponse: cardResponseSchema,
      ProcessTransactionRequest: {
        type: "object",
        properties: {
          userId: { type: "string", example: "user-id" },
          cardId: { type: "string", example: "card-id" },
          amountCents: { type: "integer", minimum: 1, example: 10000 },
          description: { type: "string", example: "Compra mercado" }
        },
        required: ["userId", "cardId", "amountCents", "description"]
      },
      TransactionResponse: transactionResponseSchema,
      InvoiceResponse: invoiceResponseSchema
    }
  },
  paths: {
    "/users": {
      post: {
        tags: ["Users"],
        summary: "Criar usuario",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateUserRequest" } } } },
        responses: {
          "201": { description: "Usuario criado", content: { "application/json": { schema: { $ref: "#/components/schemas/UserResponse" } } } },
          "400": { description: "Erro de validacao", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
        }
      }
    },
    "/cards": {
      post: {
        tags: ["Cards"],
        summary: "Criar cartao",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateCardRequest" } } } },
        responses: {
          "201": { description: "Cartao criado", content: { "application/json": { schema: { $ref: "#/components/schemas/CardResponse" } } } },
          "404": { description: "Usuario nao encontrado", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
        }
      }
    },
    "/transactions": {
      post: {
        tags: ["Transactions"],
        summary: "Processar transacao",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ProcessTransactionRequest" } } } },
        responses: {
          "201": { description: "Transacao processada", content: { "application/json": { schema: { $ref: "#/components/schemas/TransactionResponse" } } } }
        }
      }
    },
    "/transactions/{transactionId}/cancel": {
      post: {
        tags: ["Transactions"],
        summary: "Cancelar transacao",
        parameters: [{ name: "transactionId", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Transacao cancelada", content: { "application/json": { schema: { $ref: "#/components/schemas/TransactionResponse" } } } }
        }
      }
    },
    "/transactions/{transactionId}/chargeback": {
      post: {
        tags: ["Transactions"],
        summary: "Simular chargeback",
        parameters: [{ name: "transactionId", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Chargeback aplicado", content: { "application/json": { schema: { $ref: "#/components/schemas/TransactionResponse" } } } }
        }
      }
    },
    "/cards/{cardId}/invoice": {
      get: {
        tags: ["Invoices"],
        summary: "Gerar ou consultar fatura mensal",
        parameters: [
          { name: "cardId", in: "path", required: true, schema: { type: "string" } },
          { name: "referenceMonth", in: "query", required: true, schema: { type: "string", example: "2026-03" } }
        ],
        responses: {
          "200": { description: "Fatura do mes", content: { "application/json": { schema: { $ref: "#/components/schemas/InvoiceResponse" } } } }
        }
      }
    }
  }
} as const;