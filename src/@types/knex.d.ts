// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    transactions: {
      id: string
      title: string
      amount: number
      created_at: string
      session_id?: string
    }
    accounts: {
      id: string
      name: string
      email: string
      cellphone: string
      password: string
      is_admin: boolean
      is_online: boolean
      created_at: string
    }
  }
}
