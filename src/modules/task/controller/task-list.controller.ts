import { Controller, Get, HttpStatus, Query } from '@nestjs/common'
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { BadRequestError, InternalServerError } from '@app/shared/errors/nest-swagger-http.error'
import { TaskListInput, TaskListOutput } from '@app/modules/task/contract/task-list.contract'
import { TaskListAction } from '@app/modules/task/action/task-list.action'

@ApiTags('Task')
@Controller('/task')
export class TaskListController {
  constructor(private handler: TaskListAction) {}

  @ApiOperation({
    operationId: 'TaskList',
    summary: 'List tasks with filters'
  })
  @ApiBadRequestResponse({
    type: BadRequestError,
    description: 'Bad request response'
  })
  @ApiInternalServerErrorResponse({ type: InternalServerError, description: 'Internal error response' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success response',
    type: [TaskListOutput]
  })
  @Get('/')
  async handle(@Query() input: TaskListInput): Promise<TaskListOutput[]> {
    return await this.handler.handle(input)
  }
}
