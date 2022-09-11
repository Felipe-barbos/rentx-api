import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokenRepository } from "@modules/accounts/repositories/IUsersTokenRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { resolve } from "path";
import { v4 as uuidV4 } from "uuid";


@injectable()
class SendForgotPasswordMailUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("UsersTokenRepository")
        private usersTokenRepository: IUsersTokenRepository,
        @inject("DateProvider")
        private dateProvider: IDateProvider,
        @inject("EtherealMailProvider")
        private mailPRovider: IMailProvider
    ) { }

    async execute(email: string): Promise<void> {
        const user = await this.usersRepository.findByEmail(email);

        const templatePath = resolve(
            __dirname,
            "..",
            "..",
            "view",
            "emails",
            "forgotPassword.hbs");

        if (!user) {
            throw new AppError("User does not exists!");
        }

        const token = uuidV4();

        const expires_date = this.dateProvider.addHours(3);

        await this.usersTokenRepository.create({
            refresh_token: token,
            user_id: user.id,
            expires_date
        });

        const variables = {
            name: user.name, 
            link: `${process.env.FORGOT_MAIL_URL}${token}`
        }

        await this.mailPRovider.sendMail(
            email,
            "Recuperação de senha",
            variables,
            templatePath
        );

    }
}

export { SendForgotPasswordMailUseCase };