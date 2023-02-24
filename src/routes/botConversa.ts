import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { env } from '../env'
import axios from 'axios'

export async function botConversaRoutes(app: FastifyInstance) {
  const baseURL = 'https://backend.botconversa.com.br/api/v1/webhook'

  app.get('/corretor', async (request, reply) => {
    reply.status(200).send({
      corretor: {
        name: 'Corretor xpto',
      }
    })
  })

  app.get('/:cellphone', async (request, reply) => {
    const getParamsSchema = z.object({
      cellphone: z.string(),
    })

    const { cellphone } = getParamsSchema.parse(request.params)

    const configGetSubscriberByCellphone = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${baseURL}/subscriber/get_by_phone/${cellphone}`,
      headers: {
        'API-KEY': env.API_KEY_BC_TRADES,
      },
    }

    const response = await (await axios(configGetSubscriberByCellphone)).data

    return {
      user: {
        id: response.id,
        fullName: response.full_name,
      },
    }
  })

  app.post('/send_message', async (request, reply) => {
    const getBodySchema = z.object({
      message: z.string(),
      subscriberId: z.number(),
    })

    const { message, subscriberId } = getBodySchema.parse(request.body)

    const data = JSON.stringify({
      type: 'text',
      value: message,
    })

    const configSendMessageBySubscriberId = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${baseURL}/subscriber/${subscriberId}/send_message/`,
      headers: {
        'API-KEY': env.API_KEY_BC_TRADES,
        'Content-Type': 'application/json',
      },
      data,
    }

    await (
      await axios(configSendMessageBySubscriberId)
    ).data

    return reply.status(200).send()
  })

  app.post('/send_flow', async (request, reply) => {
    const getBodySchema = z.object({
      flowId: z.number(),
      subscriberId: z.number(),
    })

    const { flowId, subscriberId } = getBodySchema.parse(request.body)

    const data = JSON.stringify({
      flow: flowId,
    })

    const configSendMessageBySubscriberId = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${baseURL}/subscriber/${subscriberId}/send_flow/`,
      headers: {
        'API-KEY': env.API_KEY_BC_TRADES,
        'Content-Type': 'application/json',
      },
      data,
    }

    await (
      await axios(configSendMessageBySubscriberId)
    ).data

    return reply.status(200).send()
  })
}
