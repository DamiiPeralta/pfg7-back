import { Controller, Post, Body, Param, Get, NotFoundException, InternalServerErrorException, Logger, UseGuards, Req } from "@nestjs/common";
import { OrdersService } from "./orders.service"
import { Order } from "./orders.entity";
import { CreateOrderDto } from "./createOrderDto.Dto";
import { AuthGuard } from "src/auth/auth.guard";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "src/auth/roles.enum";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@Controller("orders")
@ApiTags("Order")
export class OrdersController {
    private readonly logger = new Logger(OrdersController.name);

    constructor(private readonly ordersService: OrdersService) {}
    @ApiBearerAuth()
    @Post()
    @UseGuards(AuthGuard)
    async createOrder(@Req() req:Request, @Body() createOrderDto:CreateOrderDto): Promise<Order> {
        try {
            //console.log(req.credentials)
            console.log("este es", req.headers)
            //console.log(req)
            return await this.ordersService.addOrder(createOrderDto);
        } catch (error) {
            this.logger.error(`Error al crear la orden: ${error.message}`);
            throw new InternalServerErrorException('Error interno al crear la orden');
        }
    }
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Get()
    @Roles(Role.Admin)
    async getOrders(): Promise<Order[]> {
        try {
            return await this.ordersService.getOrders();
        } catch (error) {
            this.logger.error(`Error al obtener las órdenes: ${error.message}`);
            throw new InternalServerErrorException('Error interno al obtener las órdenes');
        }
    }
    @ApiBearerAuth()
    @Get(":id")
    @UseGuards(AuthGuard)
    async getOrderById(@Param("id") id: string): Promise<Order> {
        try {
            const order = await this.ordersService.getOrder(id);
            if (!order) {
                throw new NotFoundException(`Orden con ID '${id}' no encontrada`);
            }
            return order;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error; // Propagar NotFoundException sin modificar
            } else {
                this.logger.error(`Error al obtener la orden con ID '${id}': ${error.message}`);
                throw new InternalServerErrorException('Error interno al obtener la orden');
            }
        }
    }
}
