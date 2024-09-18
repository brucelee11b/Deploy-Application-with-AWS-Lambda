import cors from '@middy/http-cors'
import middy from '@middy/core'
import { createLogInfo } from '../../log-info/LogUtils.mjs'
import httpErrorHandler from '@middy/http-error-handler'
import { getTodoLogic } from '../../businessLogic/todosLogic.js'

const log = createLogInfo('Event: get all todos!')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true,
      origin: '*'
    })
  )
  .handler(async (event) => {
    const todos = await getTodoLogic(event)
    log.info('Get all OK!', todos)
    return {
      statusCode: 200,
      body: JSON.stringify({
        items: todos
      })
    }
  })
