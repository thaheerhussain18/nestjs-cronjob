import { PartialType } from '@nestjs/swagger';
import { CreateCsvdatumDto } from './create-csvdatum.dto';

export class UpdateCsvdatumDto extends PartialType(CreateCsvdatumDto) {}
