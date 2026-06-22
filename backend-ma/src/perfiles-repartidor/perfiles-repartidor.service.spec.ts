import { Test, TestingModule } from '@nestjs/testing';
import { PerfilesRepartidorService } from './perfiles-repartidor.service';

describe('PerfilesRepartidorService', () => {
  let service: PerfilesRepartidorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PerfilesRepartidorService],
    }).compile();

    service = module.get<PerfilesRepartidorService>(PerfilesRepartidorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
