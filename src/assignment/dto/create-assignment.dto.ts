import { ApiProperty } from '@nestjs/swagger';

export class CreateAssignmentDto {
    @ApiProperty({ 
        description: 'The title of the assignment', 
        example: 'Complete monthly report' 
    })
    title: string;

    @ApiProperty({ 
        description: 'The ID of the activity this assignment belongs to', 
        example: 1 
    })
    activityId: number;

    @ApiProperty({ 
        description: 'The status of the assignment (true for active, false for inactive)', 
        default: true, 
        required: false 
    })
    status?: boolean;
}
