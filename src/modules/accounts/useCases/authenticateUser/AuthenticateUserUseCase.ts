import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import {sign} from "jsonwebtoken";
import {compare} from "bcrypt";
import { AppError } from "@shared/errors/AppError";




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
}


@injectable()
class AuthenticateUserUseCase{

    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ){}

    async execute({email,password}): Promise<IResponse>{

        //Usuário existe
        const user = await this.usersRepository.findByEmail(email);

        if(!user){
            throw new AppError("Email or password incorrect!");
        };
        // Senha está correta
        const passowrdMatch = await compare(password, user.password);

        if(!passowrdMatch){
            throw new AppError("Email or passowrd incorrect!");
        };
     
    // Gerar jsonwebtoken
        const token = sign({}, "ddc7aa412adff68b047feaa4f87babf8",{
            subject:user.id,
            expiresIn: "1d"
        });

        const tokenReturn: IResponse = {
            token,
            user:{
                name: user.name,
                email: user.email
            }
        }

        return tokenReturn;
       
        
    };
};

export {AuthenticateUserUseCase};