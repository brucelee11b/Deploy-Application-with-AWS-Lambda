import cors from '@middy/http-cors'
import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import { createLogInfo } from '../../log-info/LogUtils.mjs'
import { addAttachMentLogic } from '../../businessLogic/todosLogic.js'

const log = createLogInfo('Event: Generate upload url!')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true,
      origin: '*'
    })
  )
  .handler(async (event) => {
    const uploadUrl = await addAttachMentLogic(event)
    log.info('Generated upload url OK!', {
      uploadUrl: uploadUrl
    })
    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl: uploadUrl
      })
    }
  })
