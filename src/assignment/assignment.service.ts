import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AssignmentService {
  constructor(private readonly prismaService:PrismaService) {}
  async create(createAssignmentDto: CreateAssignmentDto) {
   const activity=await this.prismaService.activity.findFirst({
      where: { id: createAssignmentDto.activityId }
    });
    if (!activity) {
      throw new ConflictException(`Activity with ID ${createAssignmentDto.activityId} not found`);
    }
const assignment = await this.prismaService.assignment.create({
  data:{
    title: createAssignmentDto.title,
    activityId: createAssignmentDto.activityId,
    ...(createAssignmentDto.status !== undefined && { status: createAssignmentDto.status })
  },
  include:{
    activity:true
  }
})
return assignment;
  }

  findAll() {
    return `This action returns all assignment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} assignment`;
  }

  update(id: number, updateAssignmentDto: UpdateAssignmentDto) {
    return `This action updates a #${id} assignment`;
  }

  remove(id: number) {
    return `This action removes a #${id} assignment`;
  }

  async complete(id: number) {
    await this.prismaService.assignment.update({
      where: { id },
      data: { status: false }
    });
    return `Assignment #${id} marked as completed.`;
  }
}
