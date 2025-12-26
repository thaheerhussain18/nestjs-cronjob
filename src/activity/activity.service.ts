import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { PrismaService } from '../prisma/prisma.service';
import { title } from 'process';

@Injectable()
export class ActivityService {
  private readonly logger = new Logger(ActivityService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createActivityDto: CreateActivityDto) {
    try {
      const employee = await this.prisma.employee.findUnique({
        where: { id: createActivityDto.employeeId },
      });

      if (!employee) {
        throw new BadRequestException(`Employee with ID ${createActivityDto.employeeId} not found`);
      }
      if(!createActivityDto.title){
        throw new BadRequestException(`Title is required to create an activity`);
      }

      const activity = await this.prisma.activity.create({
        data: {
          lastWorkedAt: new Date(),
          assignments: {create:[{title: createActivityDto.title }, {title: createActivityDto.title },{title: createActivityDto.title },{title: createActivityDto.title },{title: createActivityDto.title },{title: createActivityDto.title }]},
          employee:{connect:{id:createActivityDto.employeeId}}
        },
        include: {
          employee: true,
          assignments: true,
        },
      });

     console.log(`Created activity for employee: ${employee.name} (ID: ${activity.id})`);
      return activity;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.prisma.activity.findMany({
        include: {
          employee: true,
          assignments: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const activity = await this.prisma.activity.findUnique({
        where: { id },
        include: {
          employee: true,
          assignments: true,
        },
      });

      if (!activity) {
        throw new NotFoundException(`Activity with ID ${id} not found`);
      }

      return activity;
    } catch (error) {
      throw error;
    }
  }

  async findByEmployee(employeeId: number) {
    try {
      return await this.prisma.activity.findMany({
        where: { employeeId },
        include: {
          employee: true,
          assignments: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }


   async employeeWorked(id: number) {
    try {
      await this.findOne(id);

     const employeeWorkedTime=  await this.prisma.activity.update({
        where: { id },
        data: {
        employeeId:id,
         lastWorkedAt: new Date(),
        },
        include: {
          employee: true,
          assignments: true,
        },
      });
      return `Activity #${id} lastWorkedAt updated to current time ${employeeWorkedTime.lastWorkedAt}. employee: ${employeeWorkedTime.assignments.map(a=>a.title).join(", ")} employee name: ${employeeWorkedTime.employee?.name} `;
    } catch (error) {
      throw error;
    }
  }
}
