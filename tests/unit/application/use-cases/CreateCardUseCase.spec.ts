import { describe, expect, it, vi } from "vitest";
import { CreateCardUseCase } from "../../../../src/application/use-cases/CreateCardUseCase";
import type { UserRepository } from "../../../../src/application/ports/UserRepository";
import type { CardRepository } from "../../../../src/application/ports/CardRepository";
import type { IdGenerator } from "../../../../src/application/ports/IdGenerator";
import { User } from "../../../../src/domain/entities/User";
import { NotFoundError } from "../../../../src/shared/errors/NotFoundError";
import { ValidationError } from "../../../../src/shared/errors/ValidationError";

// Factories para reduzir duplicação
function createUserRepository(existingUser?: User): UserRepository {
  return {
    findById: vi.fn().mockResolvedValue(existingUser ?? null),
    findByEmail: vi.fn(),
    save: vi.fn()
  };
}

function createCardRepository(): CardRepository {
  return {
    findById: vi.fn(),
    findByUserId: vi.fn(),
    save: vi.fn()
  };
}

function createIdGenerator(id: string = "card-1"): IdGenerator {
  return { generate: vi.fn().mockReturnValue(id) };
}

function createSampleUser(): User {
  return User.create({
    id: "user-1",
    name: "Alice",
    email: "alice@mail.com",
    passwordHash: "hash",
    createdAt: new Date()
  });
}

describe("CreateCardUseCase", () => {
  it("should create card for existing user", async () => {
    const user = createSampleUser();
    const userRepository = createUserRepository(user);
    const cardRepository = createCardRepository();
    const idGenerator = createIdGenerator();
    const useCase = new CreateCardUseCase(userRepository, cardRepository, idGenerator);

    const card = await useCase.execute({
      userId: "user-1",
      cardNumber: "1234123412341234",
      limitCents: 1000
    });

    expect(card.id).toBe("card-1");
    expect(card.toJSON().last4).toBe("1234");
    expect(cardRepository.save).toHaveBeenCalledOnce();
  });

  it("should fail when user does not exist", async () => {
    const userRepository = createUserRepository(null);
    const cardRepository = createCardRepository();
    const idGenerator = createIdGenerator();
    const useCase = new CreateCardUseCase(userRepository, cardRepository, idGenerator);

    await expect(
      useCase.execute({
        userId: "user-1",
        cardNumber: "1234123412341234",
        limitCents: 1000
      })
    ).rejects.toThrow(NotFoundError);
  });

  it("should fail when card number is invalid", async () => {
    const user = createSampleUser();
    const userRepository = createUserRepository(user);
    const cardRepository = createCardRepository();
    const idGenerator = createIdGenerator();
    const useCase = new CreateCardUseCase(userRepository, cardRepository, idGenerator);

    await expect(
      useCase.execute({
        userId: "user-1",
        cardNumber: "1234",
        limitCents: 1000
      })
    ).rejects.toThrow(ValidationError);
  });
});