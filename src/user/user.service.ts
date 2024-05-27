import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "./user.entity";
import { UserRepository } from "./user.repository";
import { UserDto } from "./user.dto";

@Injectable()
export class UserService {
    constructor(private readonly usersRepository: UserRepository) {}

    async getAllUsers(): Promise<User[]> {
        return await this.usersRepository.findAll();
    }

    async getUserById(id: string): Promise<User> {
        return await this.usersRepository.findById(id);
    }

    async createUser(userDto: UserDto): Promise<User> {
        return await this.usersRepository.create(userDto);
    }

    async updateUser(id: string, userDto: UserDto): Promise<User> {
        const existingUser = await this.usersRepository.findById(id);
        Object.assign(existingUser, userDto); // Update only provided fields
        return await this.usersRepository.update(id, existingUser);
    }

    async deleteUser(id: string): Promise<void> {
        await this.usersRepository.delete(id);
    }
}
