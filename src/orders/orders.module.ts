import { Module }   from   "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./orders.entity";
import { OrderRepository } from "./orders.repository";
import { OrderDetails } from "./orderDetails.entity";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { UsersService } from "src/users/users.service";
import { ProductsService } from "src/products/products.service";
import { ProductsRepository } from "src/products/products.repository";
import { UsersRepository } from "src/users/users.repository";
import { User } from "src/users/users.entity";
import { Product } from "src/products/products.entity";
import { CategoriesRepository } from "src/categories/categories.repository";
import { Category } from "src/categories/categories.entity";
import { CategoriesServices } from "src/categories/categories.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([OrderDetails]),
        TypeOrmModule.forFeature([User]),
        TypeOrmModule.forFeature([Product]),
        TypeOrmModule.forFeature([Order]),
        TypeOrmModule.forFeature([Category])
                ],
    providers: [
        OrderRepository,
        OrderDetails,
        UsersService,
        ProductsService,
        UsersRepository,
        ProductsRepository,
        OrdersService,
        CategoriesRepository,
        CategoriesServices
    ],
    controllers: [OrdersController]
})
export class OrderModule  {}