import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from "typeorm";
import { Product } from "src/products/products.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: "categories" })
export class Category {
    /** ID único de la categoría */
    @ApiProperty({
        description: "ID único de la categoría",
        example: "e072ae6b-6160-4d27-a25a-55d9618a96d2",
    })
    @PrimaryGeneratedColumn("uuid")
    id: string;

    /** Nombre de la categoría */
    @ApiProperty({
        description: "Nombre de la categoría",
        example: "Ropa",
    })
    @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
    name: string;

    /** Productos asociados a esta categoría (relación 1:N) */
    @ApiProperty({
        description: "Productos asociados a esta categoría",
        type: () => [Product],
    })
    @OneToMany(() => Product, product => product.category)
    @JoinColumn()
    products: Product[];
}
