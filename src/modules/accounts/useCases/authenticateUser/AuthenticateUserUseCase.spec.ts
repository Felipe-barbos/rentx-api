import { AppError } from "@shared/errors/AppError";
import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";



let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {

    beforeEach(async () => {
        usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory;
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        dateProvider = new DayjsDateProvider();
        authenticateUserUseCase = new AuthenticateUserUseCase(
            usersRepositoryInMemory, 
            usersTokensRepositoryInMemory, 
            dateProvider);
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    });

    it("should be abler to authenticate a user", async () => {
        const user: ICreateUserDTO = {
            driver_license: "weqwe",
            email: "user@test.com",
            password: "1234",
            name: "UserTest"
        };


        await createUserUseCase.execute(user);

        await expect(authenticateUserUseCase.execute({
            email: user.email,
            password: 'incorrect password',
        })).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to authenticate an nonexistent user", async () => {
        await expect(authenticateUserUseCase.execute({
            email: "false@email.com",
            password: '1234',
        })
        ).rejects.toEqual(new AppError("Email or password incorrect!"));
    });

    it("sould not be able to authenticate with incorrect password", async () => {
        const user: ICreateUserDTO = {
            driver_license: "32333",
            email: "user@user.com",
            password: "d1234",
            name: "user Teste Error"
        }

        await createUserUseCase.execute(user);

        await expect(
            authenticateUserUseCase.execute({
                email: user.email,
                password: "23123"
            })
        ).rejects.toEqual(new AppError("Email or password incorrect!"));
    })
});