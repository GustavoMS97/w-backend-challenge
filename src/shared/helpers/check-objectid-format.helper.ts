import { HttpException, HttpStatus } from '@nestjs/common'
import mongoose from 'mongoose'

export default function checkObjectId(taskId: string): boolean {
  const isValid = mongoose.Types.ObjectId.isValid(taskId)
  if (!isValid) {
    throw new HttpException({ errors: ['Invalid id format'] }, HttpStatus.BAD_REQUEST)
  }

  return isValid
}
