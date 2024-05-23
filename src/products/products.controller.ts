import { UseGuards, Controller, Get, Post, Body, Param, Put, Delete, HttpStatus, HttpCode, BadRequestException, NotFoundException, InternalServerErrorException, Query } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { Product } from "./products.entity";
import { ProductDto } from "./products.dto";
import { AuthGuard } from "src/auth/auth.guard";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "src/auth/roles.enum";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";

@Controller("products")
@ApiTags("Products")
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async getProducts(): Promise<Product[]> {
        try {
            return await this.productsService.getProducts();
        } catch (error) {
            throw new InternalServerErrorException('Error interno al obtener productos');
        }
    }

    @Get(':name/stock')
    async getStockOfProduct(@Param('name') name: string): Promise<string>{
        try {
            const productName = name.replace(/-/g, ' ');
            return await this.productsService.getStockOfProduct(productName);
        } catch (error) {
            throw new InternalServerErrorException('Error interno al obtener el stock del producto');
        }
    }

    @Get('seeder')
    @HttpCode(HttpStatus.CREATED)
    @Roles(Role.Admin)
    async getAddHardProduct(){
        try {
            return await this.productsService.addHardProduct();
        } catch (error) {
            throw new InternalServerErrorException('Error interno al añadir un producto');
        }
    }
    
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async getProductById(@Param('id') id: string): Promise<Product> {
        try {
            const product = await this.productsService.getProductById(id);
            if (!product) {
                throw new NotFoundException(`Producto con ID '${id}' no encontrado`);
            }
            return product;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error; // Propagar NotFoundException sin modificar
            } else {
                throw new InternalServerErrorException('Error interno al obtener el producto');
            }
        }
    }
    @ApiBearerAuth()
    @Post()
    @UseGuards(AuthGuard) 
    @HttpCode(HttpStatus.CREATED)
    @Roles(Role.Admin)
    async createProduct(@Body() productDto: ProductDto): Promise<Product> {
        try {
            if (!productDto.name || !productDto.description || !productDto.price || !productDto.stock || !productDto.imgUrl) {
                throw new BadRequestException('Name, description, price, stock, and imgUrl are required');
            }
            return await this.productsService.createProduct(productDto);
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error; // Propagar BadRequestException sin modificar
            } else {
                throw new InternalServerErrorException('Error interno al crear el producto');
            }
        }
    }
    @ApiBearerAuth()
    @Put(':id')
    @ApiBody({})
    @UseGuards(AuthGuard) 
    @Roles(Role.Admin)
    @HttpCode(HttpStatus.OK)
    async updateProduct(@Param('id') id: string, @Body() productDto: Partial<Product>): Promise<Product> {
        try {
            if (!productDto.name && !productDto.description && !productDto.price && !productDto.stock && !productDto.imgUrl) {
                throw new BadRequestException('At least one field to update must be provided');
            }
            return await this.productsService.updateProduct(id, productDto);
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            } else {
                throw new InternalServerErrorException('Error interno al actualizar el producto');
            }
        }
    }
    @ApiBearerAuth()
    @Delete(':id')
    @UseGuards(AuthGuard)
    @Roles(Role.Admin) 
    @HttpCode(HttpStatus.OK)
    async deleteProduct(@Param('id') id: string): Promise<void> {
        try {
            await this.productsService.deleteProduct(id);
        } catch (error) {
            throw new InternalServerErrorException('Error interno al eliminar el producto');
        }
    }
}
