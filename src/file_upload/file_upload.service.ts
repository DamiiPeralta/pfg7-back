import { Injectable, NotFoundException } from '@nestjs/common';
import { FileUploadRepository } from './file_upload.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/products.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FileUploadService {
    constructor (private readonly fileUploadRepository: FileUploadRepository,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ){}
    async uploadImage(file: Express.Multer.File, productId:string){
        const idProduct= await this.productRepository.findOneBy({id: productId});
            if(!idProduct) throw new NotFoundException(`product with id ${productId} not found`);

        const response = await this.fileUploadRepository.uploadImage(file);
        await this.productRepository.update(productId, {
            imgUrl: response.secure_url,
        });
        const foundProduct=  await this.productRepository.findOneBy({id:productId}) 
        return foundProduct;
    }
}
