import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "./categories.entity";
import { CategoriesServices } from "./categories.service";
import { CategoriesRepository } from "./categories.repository";
import { CategoriesControllers } from "./categories.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Category])],
    providers:[CategoriesServices, CategoriesRepository],
    controllers:[CategoriesControllers]
})
export class CategoriesModule{} 