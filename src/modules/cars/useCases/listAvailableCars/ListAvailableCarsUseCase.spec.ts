import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";


let listAvailableCarsUseCase: ListAvailableCarsUseCase;

let carsRepositoryInMemory: CarsRepositoryInMemory;


describe("List Cars", () =>{

    beforeEach(()=>{
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        listAvailableCarsUseCase = new ListAvailableCarsUseCase(carsRepositoryInMemory);
    });

    it("should be able to list all availabre cars", async () =>{

     const car = await carsRepositoryInMemory.create({
            name: "Car1",
	        daily_rate: 180.00,
	        description: "Carro description",
	        license_plate: "DEF-1234",
	        fine_amount: 80.00,
	        brand: "Car_brand",
	        category_id: "category_id"
        });
        

      const cars =   await listAvailableCarsUseCase.execute({});
 
      expect(cars).toEqual([car]);
    });

    it("should be able to list all available cars by brand", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Car2",
	        daily_rate: 180.00,
	        description: "Carro description",
	        license_plate: "DEF-1234",
	        fine_amount: 80.00,
	        brand: "Car_brand2",
	        category_id: "category_id"
        });
        

      const cars =   await listAvailableCarsUseCase.execute({
        brand: "Car_brand2",
      });

      

      expect(cars).toEqual([car]);

    });

    it("should be able to list all available cars by name", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Car3",
	        daily_rate: 180.00,
	        description: "Carro description",
	        license_plate: "DEF-123345",
	        fine_amount: 80.00,
	        brand: "Car_brand2",
	        category_id: "category_id"
        });
        

      const cars =   await listAvailableCarsUseCase.execute({
        name: "Car3"
      });

      

      expect(cars).toEqual([car]);

    });
    it("should be able to list all available cars by category", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "w2",
	        daily_rate: 180.00,
	        description: "Carro description",
	        license_plate: "DEF-1233452ww",
	        fine_amount: 80.00,
	        brand: "Car_brand2",
	        category_id: "category_id2"
        });
        

      const cars =   await listAvailableCarsUseCase.execute({
        category_id: "category_id2"
      });

      

      expect(cars).toEqual([car]);

    });
});