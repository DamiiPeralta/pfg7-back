// src/orders/orders.service.ts

import { Injectable } from "@nestjs/common";
import { OrderRepository } from "./orders.repository";
import { Order } from "./orders.entity";
import { Product } from "src/products/products.entity";
import { CreateOrderDto } from "./createOrderDto.Dto";

@Injectable()
export class OrdersService {
    constructor(private readonly ordersRepository: OrderRepository) {}

    async addOrder(createOrderDto:CreateOrderDto): Promise<Order> {
        return this.ordersRepository.addOrder(createOrderDto);
    }

    async getOrder(id: string): Promise<Order> {
        return this.ordersRepository.getOrderById(id);
    }

    async getOrders():Promise<Order[]>{
        return this.ordersRepository.getOrders();
    }
}
