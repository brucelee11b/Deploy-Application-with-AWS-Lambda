import cors from '@middy/http-cors'
import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import { createLogInfo } from '../../log-info/LogUtils.mjs'
import { updateTodoLogic } from '../../businessLogic/todosLogic.js'

const log = createLogInfo('Event: Update a todo!')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true,
      origin: '*'
    })
  )
  .handler(async (event) => {
    const updatedTodo = await updateTodoLogic(event)
    log.info('Updated OK!', {
      updatedTodo
    })
    return {
      statusCode: 200,
      body: 'Updated OK'
    }
  })
