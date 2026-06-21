import { Test, TestingModule } from '@nestjs/testing';
import { PerfilesRepartidorController } from './perfiles-repartidor.controller';

describe('PerfilesRepartidorController', () => {
  let controller: PerfilesRepartidorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PerfilesRepartidorController],
    }).compile();

    controller = module.get<PerfilesRepartidorController>(PerfilesRepartidorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
