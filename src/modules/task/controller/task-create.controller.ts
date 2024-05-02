import { Body, Controller, HttpStatus, Post } from '@nestjs/common'
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { TaskCreateAction } from '@app/modules/task/action/task-create.action'
import { TaskCreateInput, TaskCreateOutput } from '@app/modules/task/action/task-create.contract'
import { BadRequestError, InternalServerError } from '@app/shared/errors/nest-swagger-http.error'

@ApiTags('Task')
@Controller('/task')
export class TaskCreateController {
  constructor(private handler: TaskCreateAction) {}

  @ApiOperation({
    operationId: 'TaskCreate',
    summary: 'Create task'
  })
  @ApiBadRequestResponse({
    type: BadRequestError,
    description: 'Bad request response'
  })
  @ApiInternalServerErrorResponse({ type: InternalServerError, description: 'Internal error response' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Success response',
    type: TaskCreateOutput
  })
  @Post('/')
  async handle(@Body() input: TaskCreateInput): Promise<TaskCreateOutput> {
    return await this.handler.handle(input)
  }
}
