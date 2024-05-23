import { UseGuards, Controller, Get,Req,  Body, Param, Put, Delete, HttpStatus, HttpCode, BadRequestException, NotFoundException, InternalServerErrorException, Query} from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./users.entity";
import { AuthGuard } from "src/auth/auth.guard";
import { Role } from "src/auth/roles.enum";
import { Roles } from "src/decorators/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";

@Controller("users")
@ApiTags("Users")
export class UsersController {
    constructor(private readonly usersService: UsersService
    ) {}
    @ApiBearerAuth()
    @Get("admin")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @HttpCode(HttpStatus.OK)
    getAdmin(){
        return "Ruta protegida"
    }
    @ApiBearerAuth()
    @Get()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async getUsers(@Query('page') page: number, @Query('limit') limit: number): Promise<{ users: any[], totalPages: number, totalCount: number }> {
        try {
            return await this.usersService.getUsers(page, limit);
        } catch (error) {
            throw new InternalServerErrorException('Error interno al obtener usuarios');
        }
    }
    @ApiBearerAuth()
    @Get("profile")
    @UseGuards(AuthGuard)
    getUserProfile(@Req() request: Request & {user:any}){
        return "Este enpoint retorne el perfil del usuario"
    }
    @ApiBearerAuth()
    @Get('/country/:country')
    @UseGuards(AuthGuard)
    async getUsersByCountry(@Param('country') country: string): Promise<User[]> {
        try {
            const countryName = country.replace(/-/g, ' ');
            const countryUsers = await this.usersService.getUsersByCountry(countryName);
            if(countryUsers.length > 0){
                return countryUsers
            }else {
                throw  new NotFoundException("No hay usuarios con esa nacionalidad")
            }
        } catch (error) {
            throw new InternalServerErrorException('Error interno al obtener usuarios por país');
        }
    }
    @ApiBearerAuth()
    @Get(':id')
    @UseGuards(AuthGuard)
    async getUserById(@Param('id') id: string){
        try {
            const user = await this.usersService.getUserById(id);
            if (!user) {
                throw new NotFoundException(`Usuario con ID '${id}' no encontrado`);
            }
            return user;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            } else {
                throw new InternalServerErrorException('Error interno al obtener el usuario');
            }
        }
    }
    
    @ApiBearerAuth()
    @Put(':id')
    @ApiBody({})
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    async updateUser(@Param('id') id: string, @Body() updateUserDto: Partial<User>){
        try {
            if (!updateUserDto.phone && !updateUserDto.country && !updateUserDto.city && !updateUserDto.name && !updateUserDto.email && !updateUserDto.password && !updateUserDto.address) {
                throw new BadRequestException('At least one field to update must be provided');
            }
            return await this.usersService.updateUser(id, updateUserDto);
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            } else {
                throw new InternalServerErrorException('Error interno al actualizar el usuario');
            }
        }
    }
    @ApiBearerAuth()
    @Delete(':id')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    async deleteUser(@Param('id') id: string): Promise<User> {
        try {
            const user = await this.usersService.deleteUser(id);
            if (!user) {
                throw new NotFoundException(`Usuario con ID '${id}' no encontrado`);
            }
            return user;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            } else {
                throw new InternalServerErrorException('Error interno al eliminar el usuario');
            }
        }
    }
}
