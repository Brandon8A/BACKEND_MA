import { Test, TestingModule } from '@nestjs/testing';
import { TiposVehiculoController } from './tipos-vehiculo.controller';
import { TiposVehiculoService } from './tipos-vehiculo.service';

describe('TiposVehiculoController', () => {
  let controller: TiposVehiculoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TiposVehiculoController],
      providers: [TiposVehiculoService],
    }).compile();

    controller = module.get<TiposVehiculoController>(TiposVehiculoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
