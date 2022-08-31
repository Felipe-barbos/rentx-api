import { Car } from "../infra/typeorm/entities/Car";
import { CarImage } from "../infra/typeorm/entities/CarImage";



interface ICarsImagesRepository{
    create(car_id: string, image_name: string): Promise<CarImage>;
    findById(car_id: string): Promise<CarImage>;
}


export {ICarsImagesRepository};