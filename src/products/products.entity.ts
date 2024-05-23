import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Category } from "src/categories/categories.entity";
import { OrderDetails } from "src/orders/orderDetails.entity";
import { ApiProperty } from "@nestjs/swagger";

// Transformador personalizado para la columna de precio
export class ColumnNumericTransformer {
    to(data: number): number {
        return data;
    }
    from(data: string): number {
        return parseFloat(data);
    }
}

@Entity({ name: 'products' })
export class Product {
    @ApiProperty({
        description: "ID único del producto",
        example: "e072ae6b-6160-4d27-a25a-55d9618a96d2",
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: "Nombre del producto",
        example: "Camiseta",
    })
    @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
    name: string;

    @ApiProperty({
        description: "Descripción del producto",
        example: "Camiseta de algodón con estampado de unicornio",
    })
    @Column({ type: 'text', nullable: false })
    description: string;

    @ApiProperty({
        description: "Precio del producto",
        example: 19.99,
    })
    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: false,
        transformer: new ColumnNumericTransformer(),
    })
    price: number;

    @ApiProperty({
        description: "Stock disponible del producto",
        example: 100,
    })
    @Column({ type: 'int', nullable: false })
    stock: number;

    @ApiProperty({
        description: "URL de la imagen del producto",
        example: "https://www.example.com/image.jpg",
    })
    @Column({
        type: 'text',
        nullable: true,
        default: 'https://www.netambulo.com/storage/2011/12/404-not-found-gatito.jpg',
    })
    imgUrl: string;

    @ApiProperty({
        description: "Categoría a la que pertenece el producto",
        example: "Ropa",
    })
    @ManyToOne(() => Category, category => category.products)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @ApiProperty({
        description: "Detalles de los pedidos asociados al producto",
        type: () => [OrderDetails],
    })
    @OneToMany(() => OrderDetails, orderDetails => orderDetails.products)
    orderDetails: OrderDetails[];
}
