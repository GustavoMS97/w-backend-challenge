import { Body, Controller, HttpStatus, Param, Put } from '@nestjs/common'
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { BadRequestError, InternalServerError } from '@app/shared/errors/nest-swagger-http.error'
import { TaskUpdateAction } from '@app/modules/task/action/task-update.action'
import { TaskUpdateInput, TaskUpdateOutput } from '@app/modules/task/contract/task-update.contract'

@ApiTags('Task')
@Controller('/task')
export class TaskUpdateController {
  constructor(private handler: TaskUpdateAction) {}

  @ApiOperation({
    operationId: 'TaskUpdate',
    summary: 'Update task'
  })
  @ApiBadRequestResponse({
    type: BadRequestError,
    description: 'Bad request response'
  })
  @ApiInternalServerErrorResponse({ type: InternalServerError, description: 'Internal error response' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success response',
    type: TaskUpdateOutput
  })
  @Put('/:id')
  async handle(@Body() input: TaskUpdateInput, @Param('id') taskId: string): Promise<TaskUpdateOutput> {
    return await this.handler.handle(input, taskId)
  }
}
