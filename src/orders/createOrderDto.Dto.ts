import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString, IsUUID, ArrayMinSize } from "class-validator";
import { Product } from "src/products/products.entity";

export class CreateOrderDto {
    @IsNotEmpty()
    @IsUUID()
    @IsString()
    @ApiProperty({
        description: "ID del usuario que realiza el pedido",
        example: "e072ae6b-6160-4d27-a25a-55d9618a96d2",
    })
    userId: string;

    @IsNotEmpty()
    @IsArray({ message: 'Se espera que products sea un array' })
    @ArrayMinSize(1, { message: 'Se espera que products contenga al menos un elemento' })   
    @ApiProperty({
        type: [Product],
        description: "Productos en el pedido",
        example: [{ id: "1", name: "Camiseta", description: "Camiseta de algodón", price: 19.99, stock: 100 }],
    })
    products: Partial<Product[]>;
}
