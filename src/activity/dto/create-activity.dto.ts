import { ApiProperty } from "@nestjs/swagger";

export class CreateActivityDto {
  @ApiProperty({ 
    description: 'The ID of the employee associated with this activity', 
    example: 1, 
    required: false,
    nullable: true 
  })
  employeeId?: number;

}
