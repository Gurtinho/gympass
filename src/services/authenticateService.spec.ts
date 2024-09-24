import { InMemoryUsersRepository } from "@/repositories/in-memory-users-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthenticateService } from "./authenticateService";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalidCredentialsError";

let usersRepository: InMemoryUsersRepository;
let authenticateService: AuthenticateService;

describe("Authenticate users", () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    authenticateService = new AuthenticateService(usersRepository);
  });

  it("should be able to authenticate", async () => {

    await usersRepository.create({
      name: "teste",
      email: "teste@gmail.com",
      password_hash: await hash("123456", 8),
    });

    const { user } = await authenticateService.execute({
      email: "teste@gmail.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate with wrong email", async () => {
    await usersRepository.create({
      name: "teste",
      email: "teste@gmail.com",
      password_hash: await hash("123456", 8),
    });
    
    await expect(() => {
      return authenticateService.execute({
        email: "wrongemail@gmail.com",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    await usersRepository.create({
      name: "teste",
      email: "teste@gmail.com",
      password_hash: await hash("123456", 8),
    });

    await expect(() => {
      return authenticateService.execute({
        email: "teste@gmail.com",
        password: "123455",
      });
    }).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});