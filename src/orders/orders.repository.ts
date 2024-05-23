import { Repository } from 'typeorm';
import { Order } from './orders.entity';
import { Injectable} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { OrderDetails } from 'src/orders/orderDetails.entity';
import { Product } from '../products/products.entity';
import { ProductsService } from '../products/products.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from './createOrderDto.Dto';

@Injectable()
export class OrderRepository {
    constructor(
        private readonly usersService: UsersService,
        private readonly productsService: ProductsService,
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderDetails)
        private readonly orderDetailRepository: Repository<OrderDetails>
    ) {}

    async addOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    // Buscar al usuario por su ID
    const user = await this.usersService.getUserById(createOrderDto.userId);
    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    // Crear una nueva orden
    const order = new Order();
    order.user = user;
    order.date = new Date();

    // Crear el detalle de la orden
    const orderDetails = new OrderDetails();
    orderDetails.price = 0; // Inicializar el precio en 0
    orderDetails.products = [];

    // Iterar sobre los productos de la orden
    for (const product of createOrderDto.products) {
        // Buscar el producto por su ID en la base de datos
        const productInDB = await this.productsService.getProductById(product.id);
        if (productInDB && productInDB.stock > 0) {
            // Restar una unidad del stock del producto utilizando el servicio de productos
            productInDB.stock -= 1;
            await this.productsService.updateProduct(product.id, productInDB);

            // Sumar el precio del producto al precio total de la orden
            orderDetails.price += productInDB.price;
            // Agregar el producto al detalle de la orden
            orderDetails.products.push(productInDB);
        }
    }
    // Guardar el detalle de la orden en la base de datos
    const savedOrderDetails = await this.orderDetailRepository.save(orderDetails);

    // Asignar el detalle de la orden a la orden
    order.orderDetails = savedOrderDetails;

    // Guardar la orden en la base de datos
    const savedOrder = await this.orderRepository.save(order);

    // Devolver la orden creada
    return savedOrder;


}

    
    async getOrders():Promise<Order[]> {
        const orders:Order[] = await this.orderRepository.find({
            relations:['user', 'orderDetails'],
        });
        return orders

    }

    async getOrderById(id: string): Promise<Order> {
        // Buscar la orden por su ID incluyendo las relaciones
        const order: Order = await this.orderRepository.findOne({
            where: { id: id },
            relations: ['user', 'orderDetails'], // Utilizamos el nombre de la relación
          });
        return order;
    }
}
