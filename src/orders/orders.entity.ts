import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { User } from "src/users/users.entity";
import { OrderDetails } from "src/orders/orderDetails.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: "orders" })
export class Order {
    /** ID único de la orden */
    @ApiProperty({
        description: "ID único de la orden",
        example: "e072ae6b-6160-4d27-a25a-55d9618a96d2",
    })
    @PrimaryGeneratedColumn("uuid")
    id: string;

    /** Detalles de la orden (relación 1:1) */
    @ApiProperty({
        description: "Detalles de la orden",
        type: () => OrderDetails,
    })
    @OneToOne(() => OrderDetails, orderDetail => orderDetail.order)
    orderDetails: OrderDetails;

    /** Fecha de la orden */
    @ApiProperty({
        description: "Fecha de la orden",
        example: "2024-05-12",
    })
    @Column({ type: "date" })
    date: Date;

    /** Usuario asociado a la orden (relación N:1) */
    @ApiProperty({
        description: "Usuario asociado a la orden",
        type: () => User,
    })
    @ManyToOne(() => User, user => user.orders)
    @JoinColumn({name: "user_id"})
    user: User;
}
