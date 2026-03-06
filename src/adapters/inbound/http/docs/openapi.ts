// openApiDocument.ts
import {
  errorResponse,
  createUserRequestSchema,
  createCardRequestSchema,
  cardResponseSchema,
  transactionResponseSchema,
  invoiceResponseSchema,
  userProperties
} from "./schemas";

import { response, requestBody, pathParam, queryParam } from "./openApiUtils";

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
        requestBody: requestBody("#/components/schemas/CreateUserRequest"),
        responses: {
          ...response("201", "#/components/schemas/UserResponse", "Usuario criado"),
          ...response("400", "#/components/schemas/ErrorResponse", "Erro de validacao")
        }
      }
    },
    "/cards": {
      post: {
        tags: ["Cards"],
        summary: "Criar cartao",
        requestBody: requestBody("#/components/schemas/CreateCardRequest"),
        responses: {
          ...response("201", "#/components/schemas/CardResponse", "Cartao criado"),
          ...response("404", "#/components/schemas/ErrorResponse", "Usuario nao encontrado")
        }
      }
    },
    "/transactions": {
      post: {
        tags: ["Transactions"],
        summary: "Processar transacao",
        requestBody: requestBody("#/components/schemas/ProcessTransactionRequest"),
        responses: {
          ...response("201", "#/components/schemas/TransactionResponse", "Transacao processada")
        }
      }
    },
    "/transactions/{transactionId}/cancel": {
      post: {
        tags: ["Transactions"],
        summary: "Cancelar transacao",
        parameters: [pathParam("transactionId")],
        responses: { ...response("200", "#/components/schemas/TransactionResponse", "Transacao cancelada") }
      }
    },
    "/transactions/{transactionId}/chargeback": {
      post: {
        tags: ["Transactions"],
        summary: "Simular chargeback",
        parameters: [pathParam("transactionId")],
        responses: { ...response("200", "#/components/schemas/TransactionResponse", "Chargeback aplicado") }
      }
    },
    "/cards/{cardId}/invoice": {
      get: {
        tags: ["Invoices"],
        summary: "Gerar ou consultar fatura mensal",
        parameters: [pathParam("cardId"), queryParam("referenceMonth", "string", "2026-03")],
        responses: { ...response("200", "#/components/schemas/InvoiceResponse", "Fatura do mes") }
      }
    }
  }
} as const;