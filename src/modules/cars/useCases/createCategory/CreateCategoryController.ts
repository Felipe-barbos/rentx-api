import {Response, Request} from "express";

import {container} from "tsyringe";
import { CreateCategoryUseCase } from "@modules/cars/useCases/createCategory/CreateCategoryUseCase";


class CreateCategoryController {
    async handle(request: Request, response: Response): Promise<Response>{
        const { name, description } = request.body;

      const createCategoryUseCase = container.resolve(CreateCategoryUseCase);
        //mandando para o nosso serviço as informações do request
      await createCategoryUseCase.execute({name,description});
    
        return response.status(201).send();
    }
};

export { CreateCategoryController};