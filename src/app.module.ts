import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TodosModule } from './todos/todos.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeOrmConfig from "./config/typeorm"
import { OrderModule } from './orders/orders.module';
import { ProductsService } from './products/products.service';
import { UsersService } from './users/users.service';
import { OrdersService } from './orders/orders.service';
import { CategoriesModule } from './categories/categories.module';
import { FileUploadModule } from './file_upload/file_upload.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      load: [typeOrmConfig]

    }),
    TypeOrmModule.forRootAsync({
      inject:[ConfigService],
      useFactory:(configService: ConfigService) => 
      configService.get("typeorm")
    }),
    JwtModule.register({
      global:true,
      signOptions:{expiresIn:"1h"},
      secret:process.env.JWT_SECRET
    })
    ,UsersModule, TodosModule, ProductsModule, AuthModule, OrderModule, CategoriesModule, FileUploadModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
