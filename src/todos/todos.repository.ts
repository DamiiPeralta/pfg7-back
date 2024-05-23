import { Injectable } from "@nestjs/common";

@Injectable()
export class TodosRepository {
    private todos = [

    ];
    async getTodo() {
        return this.todos;
    };
}