import { Controller, Delete, HttpStatus, Param } from '@nestjs/common'
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { BadRequestError, InternalServerError } from '@app/shared/errors/nest-swagger-http.error'
import { TaskDeleteAction } from '@app/modules/task/action/task-delete.action'

@ApiTags('Task')
@Controller('/task')
export class TaskDeleteController {
  constructor(private handler: TaskDeleteAction) {}

  @ApiOperation({
    operationId: 'TaskDelete',
    summary: 'Delete task by id'
  })
  @ApiBadRequestResponse({
    type: BadRequestError,
    description: 'Bad request response'
  })
  @ApiInternalServerErrorResponse({ type: InternalServerError, description: 'Internal error response' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success response'
  })
  @Delete('/:id')
  async handle(@Param('id') taskId: string): Promise<void> {
    return await this.handler.handle(taskId)
  }
}
