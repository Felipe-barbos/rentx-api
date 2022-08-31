import { ICarsImagesRepository } from "@modules/cars/repositories/ICarsImagesRepository";
import { inject, injectable } from "tsyringe";

import {deleteFile} from "@utils/file";
import { userInfo } from "os";

interface IRequest {
    car_id: string,
    images_name: string[]
}

@injectable()
class UploadCarImagesUseCase {

    constructor( 
    @inject("CarsImagesRepository")
    private carsImagesRepository: ICarsImagesRepository
    ){ }

    async execute({car_id, images_name}: IRequest): Promise<void>{
        //percorrendo o array de images
        images_name.map( async (image) => {
            
            const carImage = await this.carsImagesRepository.findById(car_id);

            if(carImage.image_name){
                 deleteFile(`./tmp/cars/${carImage.image_name}`);
            }

            //salvando as imagens um por um
            await this.carsImagesRepository.create(car_id, image);
        });
    }
}

export {UploadCarImagesUseCase};