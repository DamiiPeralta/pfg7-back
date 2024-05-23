import { Controller, Get, InternalServerErrorException, Logger, Post } from "@nestjs/common";
import { CategoriesServices } from "./categories.service";
import { Category } from "./categories.entity";
import { ApiTags } from "@nestjs/swagger";

@Controller('categories')
@ApiTags("Categories")
export class CategoriesControllers {
    private readonly logger = new Logger(CategoriesControllers.name);

    constructor(private readonly categoriesServices: CategoriesServices) {}

    @Get('seeder')
    async addCategories() {
        try {
            await this.categoriesServices.addCategories();
        } catch (error) {
            this.logger.error(`Error al agregar categorías: ${error.message}`);
            throw new InternalServerErrorException('Error interno al agregar categorías');
        }
    }

    @Post()
    async createCategory(categoryName:Partial<Category>){
        try {
            return await this.categoriesServices.createCategory(categoryName)
        }
        catch (error){
            this.logger.error(`Error al crear la categoria: ${error.message}`)
            throw new InternalServerErrorException('Error interno al crear la categoría');
        }
    }
    @Get(':id')
    async getCategoryById(id:string){
        try { 
            return await this.categoriesServices.getCategoryById(id)
            
        } catch (error) {
            this.logger.error(`Error al buscar la categoria por id: ${error.message}`)
            throw new InternalServerErrorException('Error interno al buscar la categoría por id')
        }

    }
     
    @Get()
    async getCategories() {
        try {
            return await this.categoriesServices.getCategories();
        } catch (error) {
            this.logger.error(`Error al obtener categorías: ${error.message}`);
            throw new InternalServerErrorException('Error interno al obtener categorías');
        }
    }
}
