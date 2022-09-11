import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokenRepository } from "@modules/accounts/repositories/IUsersTokenRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import {hash} from "bcrypt";

interface IRequest{
    token: string;
    password: string;
}


@injectable()
class ResetPasswordUserUseCase {

    constructor(
        @inject("UsersTokenRepository")
        private usersTokenRepository: IUsersTokenRepository,
        @inject("DateProvider")
        private dateProvider: IDateProvider,
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ){ }

    async execute({token, password}: IRequest): Promise<void>{ 
        const userToken = await this.usersTokenRepository.findByRefreshToken(token);

        if(!userToken){
             throw new AppError("Token Invalid!");
        }

        if(this.dateProvider.compareIfBefore(userToken.expires_date, this.dateProvider.dateNow())){
            throw new AppError("Token expired!");
        }

        const user = await this.usersRepository.findById(userToken.user_id);

        user.password = await hash(password,8);

        await this.usersRepository.create(user);

        await this.usersTokenRepository.deleteById(userToken.id);


    }
}

export { ResetPasswordUserUseCase };