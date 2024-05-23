import { Injectable } from "@nestjs/common";
import { User } from "./users.entity"; 
import { CreateUserDto } from "./user.dto";
import { UsersRepository } from "./users.repository";

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}

    async createUser(createUserDto: CreateUserDto, createdAt:string) {
        const newUser = await this.usersRepository.createUser(createUserDto, createdAt);
        return {newUser, createdAt};
    }

    async getUsers(page: number = 1, limit: number = 5): Promise<{ users: any[], totalPages: number, totalCount: number }> {
        // Calcula el offset para la paginación
        const offset = (page - 1) * limit;
        
        // Obtiene los usuarios paginados del repositorio
        const users = await this.usersRepository.getUsersPaginated(offset, limit);

        const usersWithoutPassword:any[] = [];
        users.forEach(user => {
            const { password, ...userWithoutPassword } = user;
            usersWithoutPassword.push(userWithoutPassword);
        });
        // Obtiene el número total de usuarios desde el repositorio
        const totalCount = await this.usersRepository.getTotalCount();

        // Calcula el número total de páginas
        const totalPages = Math.ceil(totalCount / limit);

        return await { users:usersWithoutPassword, totalPages, totalCount };
    }

    async getUsersByCountry(country:string) {
        return await this.usersRepository.getUsersByCountry(country);
    }
    async getUserByEmail(email: string){
        return await this.usersRepository.getUserByEmail(email);
    }

    async getUserByName(name: string){
        return await this.usersRepository.getUserByName(name);
    }

    async getUserById(id: string): Promise<User> {
        return await this.usersRepository.getUserById(id);
    }

    async updateUser(id: string, updateUserDto: Partial<User>) {
        const user = await this.usersRepository.updateUser(id, updateUserDto);
        const { password,isAdmin, ...userWithoutPassword } = user;
        return userWithoutPassword

    }

    async deleteUser(id: string): Promise<User> {
        return await this.usersRepository.deleteUser(id);
    }

    
}