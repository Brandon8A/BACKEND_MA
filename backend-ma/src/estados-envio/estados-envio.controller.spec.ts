import { Test, TestingModule } from '@nestjs/testing';
import { EstadosEnvioController } from './estados-envio.controller';
import { EstadosEnvioService } from './estados-envio.service';

describe('EstadosEnvioController', () => {
  let controller: EstadosEnvioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstadosEnvioController],
      providers: [EstadosEnvioService],
    }).compile();

    controller = module.get<EstadosEnvioController>(EstadosEnvioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
