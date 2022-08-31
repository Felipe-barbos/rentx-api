import { Category } from "@modules/cars/infra/typeorm/entities/Category";
import { ICategoriesRepository, ICreateCategoryDTO } from "@modules/cars/repositories/ICategoriesRepository";

import { getRepository, Repository } from "typeorm";

// criando o meu repositorio com a class que irá realizar a manipulação das informações
//DTO => Data transfer object

//criando minha interface que irá recear as informações
// a partir do momento que minha classe for instanciada com a função created


// singleton 
class CategoriesRepository implements ICategoriesRepository {

    private repository: Repository<Category>;

    //criando o construtor 
   constructor() {
        this.repository = getRepository(Category);
    }



    // função responsável por cadastrar uma categoria no array categories
    async create ({ description, name }: ICreateCategoryDTO): Promise<void> {

        const category = this.repository.create({
            description,
            name,
        });
        //salvando os dados da categoria no bando de dados

        await this.repository.save(category);
    }

    // funçao que retorna as categorias registradas no BD;
    async list(): Promise<Category[]> {
        const categories =  await this.repository.find();

        return categories;
    }

    //função que irá verificar se o nome da categoria já está cadastrado
    async findByName(name: string): Promise<Category> {
        // Select * from categoires where name = "name" limit 1
        const category =  await this.repository.findOne({name});
        return category
    }
}

//exportando minha classe
export { CategoriesRepository }