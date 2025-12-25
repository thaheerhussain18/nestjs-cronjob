import { IsString, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateDemoDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Code is required' })
  @Matches(/^[A-Z0-9]+$/, { message: 'Code must contain only uppercase letters and numbers' })
  @MinLength(3, { message: 'Code must be at least 3 characters' })
  @MaxLength(20, { message: 'Code must not exceed 20 characters' })
  code: string;

  @IsString()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;
}
