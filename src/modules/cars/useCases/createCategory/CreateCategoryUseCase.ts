import {inject, injectable} from "tsyringe";
import { AppError } from "@shared/errors/AppError";

import { ICategoriesRepository } from "@modules/cars/repositories/ICategoriesRepository";


interface IRequest {
    name: string;
    description: string;
}

/**
 * [x] - Definir o tipo de retorno
 * [x] - Alterar o retorno de erro
 * [x] - Acessar o repositório
 * [] - Retornar algo
 */

@injectable()
class CreateCategoryUseCase {

    
    constructor(
        @inject("CategoriesRepository")
        private categoriesRepository: ICategoriesRepository
        ) { }

   async execute({ name, description }: IRequest): Promise<void> {

        //variável recebendo a informação retornada da minha função na classe
        const categoryAlreadyExists = await this.categoriesRepository.findByName(name);
        //caso ela tiver essa informação, significa que a categoria já foi criada!
        if (categoryAlreadyExists) {
            throw new AppError("Category already exists!");
        }

        this.categoriesRepository.create({ name, description });

    }
}

export { CreateCategoryUseCase }