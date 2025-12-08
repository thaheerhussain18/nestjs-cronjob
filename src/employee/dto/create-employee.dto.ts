import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty({ 
    description: 'The name of the employee', 
    example: 'John Doe', 
    minLength: 2 
  })
  name: string;
}
