import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { env } from '../env'
import axios from 'axios'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'

export async function botConversaRoutes(app: FastifyInstance) {
  const baseURL = 'https://backend.botconversa.com.br/api/v1/webhook'

  //Cadatra um usuário no botconversa e salva os dados na base local com id do botconversa
  app.post('/client', async (request, reply) => {
    const getBodySchema = z.object({
      phone: z.string(),
      first_name: z.string(),
      last_name: z.string(),
    })

    const { phone, first_name, last_name } = getBodySchema.parse(request.body)

    const data = JSON.stringify({
      phone,
      first_name,
      last_name
    })

    const configCreateSubscriber = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${baseURL}/subscriber/`,
      headers: {
        'API-KEY': env.API_KEY_BC_TRADES,
        'Content-Type': 'application/json',
      },
      data,
    }

    try {
      const { data } = await axios(configCreateSubscriber)

      await knex('subscribers').insert({
        id: randomUUID(),
        id_botconversa: 123,
        first_name: first_name,
        last_name: last_name,
        full_name: `${first_name} ${last_name}`,
        phone: phone
      })

      return reply.status(201).send({
        data
      })
    } catch (error) {
      return reply.status(400).send({
        message: 'Error ao cadastrar cliente',
        error: error
      })
    }

  })

  //Endpoint de retorno com dados do corretor que ira realizar o atendimento ao cliente
  app.get('/corretor', async (request, reply) => {
    reply.status(200).send({
      corretor: {
        name: 'Corretor xpto',
      }
    })
  })

  //Busca um cliente cadastrado na api do botconversa pelo número de telefone
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

  //Envia uma mensagem via whatsapp, atualmente enviando apenas mensagens de texto
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

  //Envia um fluxo para um usuário pelo id do fluxo e do usuário
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
