import { InMemoryUsersRepository } from "@/repositories/in-memory-users-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { GetUserProfileService } from "./getUserProfileService";
import { hash } from "bcryptjs";
import { ResourceNotFoundError } from "./errors/resourceNotFoundError";

let usersRepository: InMemoryUsersRepository;
let getUserProfileService: GetUserProfileService;

describe("Get user with profile", () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    getUserProfileService = new GetUserProfileService(usersRepository);
  });

  it("Should be able to get a user profile", async () => {
    const userCreated = await usersRepository.create({
      name: "teste",
      email: "teste@gmail.com",
      password_hash: await hash("123456", 8),
    });

    const { user } = await getUserProfileService.execute({ userId: userCreated.id });

    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toEqual("teste");
  });

  it("Should not be able to get user profile with wrong id", async () => {
    await expect(() => 
      getUserProfileService.execute({ userId: "1fedvjkdnbveri" })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});