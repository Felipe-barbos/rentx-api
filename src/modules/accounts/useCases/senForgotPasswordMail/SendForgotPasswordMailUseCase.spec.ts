import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/inMemory/MailProviderInMemory";
import { AppError } from "@shared/errors/AppError";
import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let mailProvider: MailProviderInMemory;


describe("Send Forgot Mail", () => {

    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        dateProvider = new DayjsDateProvider();
        usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
        mailProvider = new MailProviderInMemory();

        sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
            usersRepositoryInMemory,
            usersTokensRepositoryInMemory,
            dateProvider,
            mailProvider
        );
    });

    it("Should be able to send a forgot password mail to user", async () => {

        const sendMail = jest.spyOn(mailProvider, "sendMail");

      const user =  await usersRepositoryInMemory.create({
            driver_license: "23123145",
            email: "felipe@gmail.com",
            name: "felipe barbosa",
            password: "12345"
        });

    
        await sendForgotPasswordMailUseCase.execute("felipe@gmail.com");

        expect(sendMail).toHaveBeenCalled();
    });

    it("should not be able to send an email if  user does not exists",  async () =>{
        await expect(
            sendForgotPasswordMailUseCase.execute("sdwffw@gmail.com")
        ).rejects.toEqual(new AppError("User does not exists!"));
    });

    it("Should be able to create an users token", async () =>{
        const generateTokenMail = jest.spyOn(usersTokensRepositoryInMemory, "create");


        const user =  await usersRepositoryInMemory.create({
            driver_license: "23123145",
            email: "felipe@gmail.com",
            name: "felipe barbosa",
            password: "12345"
        });

        await sendForgotPasswordMailUseCase.execute("felipe@gmail.com");

        expect(generateTokenMail).toBeCalled();




    });
})