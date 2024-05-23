import { Injectable } from "@nestjs/common";
import { CategoriesRepository } from "./categories.repository";
import { Category } from "./categories.entity";

@Injectable()
export class CategoriesServices{
    constructor (private categoriesRepository:CategoriesRepository){}
    
    getCategoryById(id:string){
        return this.categoriesRepository.getCategoryById(id);
    }
    createCategory(categoryName:Partial<Category>){
        return this.categoriesRepository.createCategory(categoryName)
    }
    addCategories(){
        return this.categoriesRepository.addCategories();
    }

    getCategories(){
        return this.categoriesRepository.getCategories();
    }
}