import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('assignments')
@Controller('assignment')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}
}
