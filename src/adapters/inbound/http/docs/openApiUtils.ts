// openApiUtils.ts

// Factory para respostas comuns
export function response(status: string, schemaRef: string, description?: string) {
  return {
    [status]: {
      description: description ?? "",
      content: {
        "application/json": { schema: { $ref: schemaRef } }
      }
    }
  };
}

// Factory para request bodies
export function requestBody(schemaRef: string) {
  return {
    required: true,
    content: { "application/json": { schema: { $ref: schemaRef } } }
  };
}

// Factory para parâmetros em path
export function pathParam(name: string, type: string = "string") {
  return { name, in: "path", required: true, schema: { type } };
}

// Factory para query param
export function queryParam(name: string, type: string = "string", example?: string) {
  const param: any = { name, in: "query", required: true, schema: { type } };
  if (example) param.schema.example = example;
  return param;
}