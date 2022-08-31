import { rejects } from "assert";
import { parse as csvParse } from "csv-parse";
import fs from "fs";
import { resolve } from "path";
import { inject, injectable } from "tsyringe";
import { ICategoriesRepository } from "@modules/cars/repositories/ICategoriesRepository";

interface IImportCategory {
    name: string;
    description: string;

}

@injectable()
class ImportCategoryUseCase {

    constructor(
        @inject("CategoriesRepository")
        private categoriesRepository: ICategoriesRepository) { }


    leadCategories(file: Express.Multer.File): Promise<IImportCategory[]> {
        return new Promise((resolve, rejects) => {

            const stream = fs.createReadStream(file.path);
            const categories: IImportCategory[] = [];


            const parseFile = csvParse();

            stream.pipe(parseFile);

            parseFile.on("data", async (line) => {

                const [name, description] = line;
                categories.push({
                    name,
                    description
                });
            })
                .on("end", () => {
                    fs.promises.unlink(file.path);
                    resolve(categories);
                }).on("error", (error) => {
                    rejects(error);
                });
        });
    }

    async execute(file: Express.Multer.File): Promise<void> {
        const categories = await this.leadCategories(file);


        categories.map(async (category) => {
            const { name, description } = category;

            const existCategory = await this.categoriesRepository.findByName(name);
            if (!existCategory) {
                await this.categoriesRepository.create({
                    name,
                    description,
                });
            }
        })
    }

}

export { ImportCategoryUseCase };