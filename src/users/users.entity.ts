import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from "typeorm";
import { Order } from "src/orders/orders.entity"; 
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: "users" })
export class User {
    /** ID único del usuario */
    @ApiProperty({
        description: "ID único del usuario",
        example: "e072ae6b-6160-4d27-a25a-55d9618a96d2",
    })
    @PrimaryGeneratedColumn("uuid")
    id: string;

    /** Nombre del usuario */
    @ApiProperty({
        description: "Nombre del usuario",
        example: "John Doe",
    })
    @Column({ length: 50 })
    name: string;

    /** Correo electrónico único del usuario */
    @ApiProperty({
        description: "Correo electrónico único del usuario",
        example: "usuario@example.com",
    })
    @Column({ unique: true, length: 50 })
    email: string;

    /** Contraseña del usuario */
    @ApiProperty({
        description: "Contraseña del usuario",
        example: "contraseña123",
    })
    @Column()
    password: string;

    /** Número de teléfono del usuario */
    @ApiProperty({
        description: "Número de teléfono del usuario",
        example: 123456789,
    })
    @Column({ type: "int" , nullable:true })
    phone: number;

    /** País del usuario */
    @ApiProperty({
        description: "País del usuario",
        example: "United States",
    })
    @Column({ length: 50, nullable: true})
    country: string;

    /** Dirección del usuario */
    @ApiProperty({
        description: "Dirección del usuario",
        example: "123 Main St",
    })
    @Column({ type: "text", nullable: true})
    address: string;

    /** Ciudad del usuario */
    @ApiProperty({
        description: "Ciudad del usuario",
        example: "New York",
    })
    @Column({ length: 50 , nullable:true})
    city: string;

    /** Indica si el usuario es administrador */
    @ApiProperty({
        description: "Indica si el usuario es administrador",
        example: false,
    })
    @Column({default:false})
    isAdmin:boolean;

    /** Fecha de creación del usuario */
    @ApiProperty({
        description: "Fecha de creación del usuario",
        example: "2024-05-12",
    })
    @Column({nullable:true})
    createdAt:string;

    /** Pedidos realizados por el usuario */
    @ApiProperty({
        description: "Pedidos realizados por el usuario",
        type: () => [Order],
    })
    @OneToMany(() => Order, order => order.user)
    @JoinColumn({name:"order_id"})
    orders: Order[];
}
