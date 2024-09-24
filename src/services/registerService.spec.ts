import { beforeEach, describe, expect, it } from "vitest";

import { RegisterService } from "./registerService";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/userAlreadyExistsError";

let usersRepository: InMemoryUsersRepository;
let registerService: RegisterService;

describe("Create Users", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    registerService = new RegisterService(usersRepository);
  });

  it("should hash user password upon registration", async () => {
    const { user } = await registerService.execute({
      name: "teste",
      email: "teste@gmail.com",
      password: "123456",
    });

    const passwordIsMatch = await compare("123456", user.password_hash);

    expect(passwordIsMatch).toBe(true);
  });

  it("should not be able to register with same email twice", async () => {
    const email = "teste@gmail.com";

    await registerService.execute({
      email,
      name: "teste",
      password: "123456",
    });

    await expect(() =>
      registerService.execute({
        email,
        name: "teste",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });

  it("should be able to register", async () => {
    const { user } = await registerService.execute({
      name: "teste",
      email: "teste@gmail.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });
});