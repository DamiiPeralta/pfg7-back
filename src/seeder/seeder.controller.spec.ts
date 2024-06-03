import { Test, TestingModule } from '@nestjs/testing';
import { SeederController } from './seeder.controller';
import { SeederService } from './seeder.service';
import { beforeEach, describe, it } from 'node:test';

describe('SeederController', () => {
  let controller: SeederController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeederController],
      providers: [SeederService],
    }).compile();

    controller = module.get<SeederController>(SeederController);
  });
});
function expect(controller: SeederController) {
  throw new Error('Function not implemented.');
}

