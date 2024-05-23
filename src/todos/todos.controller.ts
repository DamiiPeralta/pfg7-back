import { Controller, Get } from "@nestjs/common";
import { TodosService } from "./todos.service";
import { ApiTags } from "@nestjs/swagger";

@Controller("todos")
@ApiTags("Todos")
export class TodosController {
    constructor(private readonly todosService: TodosService) {}

    @Get()
    getTodos(){
        return this.todosService.getTodos();
    }
}