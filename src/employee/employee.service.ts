import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmployeeService {
  private readonly logger = new Logger(EmployeeService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    try {
      const employee = await this.prisma.employee.create({
        data: {
          name: createEmployeeDto.name,
        },
      });

      this.logger.log(`Created employee: ${employee.name} (ID: ${employee.id})`);
      return employee;
    } catch (error) {
      this.logger.error(`Failed to create employee: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.prisma.employee.findMany({
        include: {
          activities: {
            include: {
              assignments: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(`Failed to fetch employees: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const employee = await this.prisma.employee.findUnique({
        where: { id },
        include: {
          activities: {
            include: {
              assignments: true,
            },
          },
        },
      });

      if (!employee) {
        throw new NotFoundException(`Employee with ID ${id} not found`);
      }

      return employee;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to fetch employee ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    try {
      await this.findOne(id);

      const employee = await this.prisma.employee.update({
        where: { id },
        data: {
          name: updateEmployeeDto.name,
        },
      });
      

      this.logger.log(`Updated employee: ${employee.name} (ID: ${employee.id})`);
      return employee;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to update employee ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      // Check if employee exists
      await this.findOne(id);

      await this.prisma.employee.delete({
        where: { id },
      });

      this.logger.log(`Deleted employee with ID: ${id}`);
      return { message: `Employee with ID ${id} has been deleted`, id };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to delete employee ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
