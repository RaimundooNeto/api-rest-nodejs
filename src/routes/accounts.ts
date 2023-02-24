import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'
import { hash, compare } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { env } from '../env'

export async function accountsRoutes(app: FastifyInstance) {
  app.post('/login', async (request, reply) => {
    const loginBodySchema = z.object({
      email: z.string(),
      password: z.string(),
    })

    const { email, password } = loginBodySchema.parse(request.body)

    const user = await knex('users').where('email', email).first()

    if (!user) {
      return reply.status(404).send({
        type: 'error',
        message: 'Email or password incorrect',
      })
    }

    const passwordMatch = await compare(password, user.password)

    console.log(passwordMatch)

    if (!passwordMatch) {
      return reply.status(404).send({
        type: 'error',
        message: 'Email or password incorrect',
      })
    }

    const token = sign({}, env.JWT_SECRET, {
      subject: user.id,
      expiresIn: '1d',
    })

    return {
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    }
  })

  app.get('/', async () => {
    const accounts = await knex('users').select()

    return { accounts }
  })

  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
      cellphone: z.string(),
    })

    const { name, email, password, cellphone } = createUserBodySchema.parse(
      request.body,
    )

    const passwordHash = await hash(password, 8)

    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
      password: passwordHash,
      cellphone,
    })

    return reply.status(201).send()
  })
}
