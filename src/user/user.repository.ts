import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { UserDto } from "./user.dto";

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async getUsers(): Promise<User[]> {
        try {
            return await this.userRepository.find({relations:['tasks', 'teams']});
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve users');
        }
    }

    async findUserById(id: string): Promise<User> {
        try {
            const user = await this.userRepository.findOne({ where: { user_id: id },relations: ['tasks', "teams"] });
            if (!user) {
                throw new NotFoundException(`User with ID ${id} not found`);
            }
            return user;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to retrieve the user');
        }
    }

    async findUserByEmail(email: string): Promise<User> {
        try {
            const user = await this.userRepository.findOne({ where: { email: email },relations: ['tasks', "teams"] });
            if (!user) {
                throw new NotFoundException(`User with Email ${email} not found`);
            }
            return user;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to retrieve the user');
        }
    }
    async createUser(userDto: UserDto): Promise<User> {
        try {
            const user: Partial<User> = userDto;
            const createdAt = new Date();
            user.created = createdAt.toDateString();
            const newUser = this.userRepository.create(user);
            return await this.userRepository.save(newUser);
        } catch (error) {
            throw new BadRequestException('Failed to create user');
        }
    }

    async updateUser(id: string, user: Partial<User>): Promise<User> {
        try {
            const upUser = await this.findUserById(id);
            Object.assign(upUser, user); // Update only provided fields
            return await this.userRepository.save(upUser);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('Failed to update user');
        }
    }

    async deleteUser(id: string): Promise<void> {
        try {
            const user = await this.findUserById(id);
            await this.userRepository.remove(user);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to delete user');
        }
    }
}
