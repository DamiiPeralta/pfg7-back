import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./users.entity"; // Importa la entidad User
import { CreateUserDto } from "./user.dto";

@Injectable()
export class UsersRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}
    //Trae todos los usuarios
    async getUsers(): Promise<User[]> {
        return this.userRepository.find();
    }
    //Trae a un usuario por el id
    async getUserById(id: string): Promise<User> {
        return this.userRepository.findOne({ 
            where: { id: id },
            relations: ['orders'],  });
    
    };
    //Trae todos los usuarios de dicho pais
    async getUsersByCountry(country: string): Promise<User[]>{
        return this.userRepository.find({where:{country}});
    }
    //Trae a los usuarios que estan entre el offset y el limit
    async getUsersPaginated(offset: number, limit: number): Promise<User[]> {
        return this.userRepository.find({
            skip: offset,
            take: limit
        });
    }
    //Trae la cantidad de usuarios que tengo en la base de datos
    async getTotalCount(): Promise<number> {
        return this.userRepository.count();
    }
    //Crea un nuevo usuario usando un dto que no contiene el id
    async createUser(userDto: CreateUserDto, createdAt: string){
        const users = await this.getUsers()
        const newUser: User = this.userRepository.create(userDto);
        if(users.length === 0){
            newUser.isAdmin = true;
        }
        newUser.createdAt = createdAt;
        this.userRepository.save(newUser);
        return {newUser, createdAt}
    }
    //Actualiza un usuario (Recibe como parametro ID de usuario a modificar y el campo a modificar)
    async updateUser(id: string, updateUserDto: Partial<User>): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id:id } });
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        Object.assign(user, updateUserDto);
        return this.userRepository.save(user);
    }
    //Borra un usuario mediante el ID.
    async deleteUser(id: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        await this.userRepository.remove(user);
        return await user
    }

    async getUserByEmail(email: string){
        return this.userRepository.findOne({where:{email}});
    }
    async getUserByName(name:string){
        return this.userRepository.findOne({where:{name}})
    }

}
