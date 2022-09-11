import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import {sign} from "jsonwebtoken";
import {compare} from "bcrypt";
import { AppError } from "@shared/errors/AppError";
import { IUsersTokenRepository } from "@modules/accounts/repositories/IUsersTokenRepository";
import auth from "@config/auth";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";




interface IRequest{
    email: string;
    password: string;
};


interface IResponse{
    user:{
        name: string,
        email: string,
    },
    token: string;
    refresh_token: string;
}


@injectable()
class AuthenticateUserUseCase{

    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("UsersTokenRepository")
        private usersTokenRepository: IUsersTokenRepository,
        @inject("DateProvider")
        private dateProvider: IDateProvider
    ){}

    async execute({email,password}): Promise<IResponse>{

        //Usuário existe
        const user = await this.usersRepository.findByEmail(email);
        const {expires_in_token, secret_refresh_token,secret_token, expires_in_refresh_token,expires_refresh_token_days} = auth;

        if(!user){
            throw new AppError("Email or password incorrect!");
        };
        // Senha está correta
        const passowrdMatch = await compare(password, user.password);

        if(!passowrdMatch){
            throw new AppError("Email or passowrd incorrect!");
        };
     
    // Gerar jsonwebtoken
        const token = sign({}, secret_token,{
            subject:user.id,
            expiresIn: expires_in_token
        });

    // refresh-token
    
    const refresh_token = sign({email}, secret_refresh_token,{
        subject: user.id,
        expiresIn: expires_in_refresh_token
    });

    const refresh_token_expires_date = this.dateProvider.addDays(
        expires_refresh_token_days);


    
     await this.usersTokenRepository.create({
            user_id: user.id,
            refresh_token,
            expires_date:refresh_token_expires_date,
      });


        

        const tokenReturn: IResponse = {
            token,
            user:{
                name: user.name,
                email: user.email
            },
            refresh_token,
        }

        return tokenReturn;
       
        
    };
};

export {AuthenticateUserUseCase};