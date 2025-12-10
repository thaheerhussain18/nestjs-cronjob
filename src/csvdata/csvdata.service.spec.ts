import { Test, TestingModule } from '@nestjs/testing';
import { CsvdataService } from './csvdata.service';

describe('CsvdataService', () => {
  let service: CsvdataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CsvdataService],
    }).compile();

    service = module.get<CsvdataService>(CsvdataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
