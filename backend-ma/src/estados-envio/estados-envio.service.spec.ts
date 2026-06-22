import { Test, TestingModule } from '@nestjs/testing';
import { EstadosEnvioService } from './estados-envio.service';

describe('EstadosEnvioService', () => {
  let service: EstadosEnvioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EstadosEnvioService],
    }).compile();

    service = module.get<EstadosEnvioService>(EstadosEnvioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
