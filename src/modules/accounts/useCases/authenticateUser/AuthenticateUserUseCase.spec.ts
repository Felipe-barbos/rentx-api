import { AppError } from "@shared/errors/AppError";
import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";



let  authenticateUserUseCase:  AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase:  CreateUserUseCase;

describe("Authenticate User", ()=>{

    beforeEach(async () =>{
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    });

    it("should be abler to authenticate a user", async ()=>{
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
        
        it("should not be able to authenticate an nonexistent user", ()=>{
            expect( async ()=>{
               await authenticateUserUseCase.execute({
                    email: "false@email.com",
                    password: '1234',
                  });

            }).rejects.toBeInstanceOf(AppError);
        });

        it("sould not be able to authenticate with incorrect password", ()=>{

            expect (async () =>{
                const user: ICreateUserDTO ={
                    driver_license: "32333",
                    email:"user@user.com",
                    password: "d1234",
                    name:"user Teste Error"
                }

                await createUserUseCase.execute(user);

                await authenticateUserUseCase.execute({
                    email: user.email,
                    password: "23123"
                });
            }).rejects.toBeInstanceOf(AppError);
        })
});