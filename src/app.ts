import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { transactionsRoutes } from './routes/transactions'
import { accountsRoutes } from './routes/accounts'
import { botConversaRoutes } from './routes/botConversa'

export const app = fastify()

app.register(cookie)

app.register(transactionsRoutes, {
  prefix: 'transactions',
})

app.register(accountsRoutes, {
  prefix: 'accounts',
})

app.register(botConversaRoutes, {
  prefix: 'integrations',
})
