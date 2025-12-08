import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { PrismaService } from '../prisma/prisma.service';

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

      const activity = await this.prisma.activity.create({
        data: {
          employeeId: createActivityDto.employeeId,
          lastWorkedAt: new Date(),
        },
        include: {
          employee: true,
          assignments: true,
        },
      });

      this.logger.log(`Created activity for employee: ${employee.name} (ID: ${activity.id})`);
      return activity;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Failed to create activity: ${error.message}`, error.stack);
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
      this.logger.error(`Failed to fetch activities: ${error.message}`, error.stack);
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
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to fetch activity ${id}: ${error.message}`, error.stack);
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
      this.logger.error(`Failed to fetch activities for employee ${employeeId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  

  async update(id: number, updateActivityDto: UpdateActivityDto) {
    try {
      await this.findOne(id);

      const activity = await this.prisma.activity.update({
        where: { id },
        data: {
          ...(updateActivityDto.employeeId && { employeeId: updateActivityDto.employeeId }),
         
        },
        include: {
          employee: true,
          assignments: true,
        },
      });

      this.logger.log(`Updated activity ID: ${activity.id}`);
      return activity;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to update activity ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

   async employeeWorked(id: number) {
    try {
      await this.findOne(id);

     const employeeWorkedTime=  await this.prisma.activity.update({
        where: { id },
        data: {
         lastWorkedAt: new Date(),
        },
        include: {
          employee: true,
          assignments: true,
        },
      });
      return `Activity #${id} lastWorkedAt updated to current time ${employeeWorkedTime.lastWorkedAt}. employee: ${employeeWorkedTime}`;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      await this.prisma.activity.delete({
        where: { id },
      });
      this.logger.log(`Deleted activity with ID: ${id}`);
       return { message: `Activity with ID ${id} has been deleted`, id };
    } catch (error) {
       if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to delete activity ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
