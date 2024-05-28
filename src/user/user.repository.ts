import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { UserDto } from "./user.dto";

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}
    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async findById(id: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { user_id: id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        
        return user;
    }

    async create(userDto: UserDto): Promise<User> {
        const newUser = this.userRepository.create(userDto);
        return await this.userRepository.save(newUser);
    }

    async update(id: string, userDto: UserDto): Promise<User> {
        const user = await this.findById(id);
        Object.assign(user, userDto); // Update only provided fields
        return await this.userRepository.save(user);
    }

    async delete(id: string): Promise<void> {
        const user = await this.findById(id);
        await this.userRepository.remove(user);
    }
}