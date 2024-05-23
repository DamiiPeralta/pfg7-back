import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToOne, JoinColumn } from 'typeorm';
import { Order } from 'src/orders/orders.entity';
import { Product } from 'src/products/products.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class OrderDetails {
  /** ID único de los detalles del pedido */
  @ApiProperty({
    description: "ID único de los detalles del pedido",
    example: "e072ae6b-6160-4d27-a25a-55d9618a96d2",
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Precio total de los detalles del pedido */
  @ApiProperty({
    description: "Precio total de los detalles del pedido",
    example: 100.50,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  /** Orden asociada a estos detalles del pedido (relación 1:1) */
  @ApiProperty({
    description: "Orden asociada a estos detalles del pedido",
    type: () => Order,
  })
  @OneToOne(() => Order, order => order.orderDetails)
  @JoinColumn({name:"order_id"})
  order: Order;

  /** Productos asociados a estos detalles del pedido (relación N:N) */
  @ApiProperty({
    description: "Productos asociados a estos detalles del pedido",
    type: () => [Product],
  })
  @ManyToMany(() => Product)
  @JoinTable({
    name:"orderdetails_products",
    joinColumn:{
      name:"orderdetail_id",
      referencedColumnName:"id"
    },
    inverseJoinColumn:{
      name:"product_id",
      referencedColumnName:"id"
    }
  })
  products: Product[];
}
