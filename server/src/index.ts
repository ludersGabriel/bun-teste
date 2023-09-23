import { randomUUID } from 'crypto'
import { dbUsers } from './components/user/user'
import { publicProcedure, router } from './trpc'

import { createHTTPServer } from '@trpc/server/adapters/standalone'

import { z } from 'zod'

const appRouter = router({
  '': publicProcedure.query(() => 'TRPC Running!'),
  userList: publicProcedure.query(() => {
    const users = dbUsers

    return users
  }),
  userById: publicProcedure
    .input(z.string())
    .query((opts) => {
      const { input } = opts

      const user = dbUsers.find((user) => user.id === input)

      return user
    }),
  userCreate: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation((opts) => {
      const { input } = opts

      const user = {
        id: randomUUID(),
        name: input.name,
      }

      dbUsers.push(user)

      return user
    }),
})

export type AppRouter = typeof appRouter

const server = createHTTPServer({
  router: appRouter,
})

server.listen(3000)

console.log(
  'TRPC server listening on http://localhost:3000'
)
