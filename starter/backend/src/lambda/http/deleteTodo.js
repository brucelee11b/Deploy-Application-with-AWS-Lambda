import cors from '@middy/http-cors'
import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import { createLogInfo } from '../../log-info/LogUtils.mjs'
import { deleteTodoLogic } from '../../businessLogic/todosLogic.js'

const log = createLogInfo('Event: Delete a todo!')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true,
      origin: '*'
    })
  )
  .handler(async (event) => {
    const todoId = await deleteTodoLogic(event)
    log.info('Deleted OK!', {
      todoId: todoId
    })
    return {
      statusCode: 200,
      body: 'Deleted OK!'
    }
  })
