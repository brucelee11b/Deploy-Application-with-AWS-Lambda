import cors from '@middy/http-cors'
import middy from '@middy/core'
import { createLogInfo } from '../../log-info/LogUtils.mjs'
import httpErrorHandler from '@middy/http-error-handler'
import { createTodoLogic } from '../../businessLogic/todosLogic.js'

const log = createLogInfo('Event: Create new todo!')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true,
      origin: '*'
    })
  )
  .handler(async (event) => {
    const todo = await createTodoLogic(event)
    log.info('Created OK!', {
      todo: todo
    })
    return {
      statusCode: 201,
      body: JSON.stringify({
        item: todo
      })
    }
  })
