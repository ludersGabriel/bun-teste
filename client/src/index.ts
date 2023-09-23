import {
  createTRPCProxyClient,
  httpBatchLink,
} from '@trpc/client'
import type { AppRouter } from '../../server/src'

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/',
    }),
  ],
})

async function main() {
  const users = await trpc.userList.query()

  console.log(`Users: ${JSON.stringify(users)}`)

  const user = await trpc.userById.query('1')

  console.log(`User: ${JSON.stringify(user)}`)

  const newUser = await trpc.userCreate.mutate({
    name: 'Test',
  })

  console.log(`New user: ${JSON.stringify(newUser)}`)

  console.log(`Old array: ${JSON.stringify(users)}`)

  const newUsers = await trpc.userList.query()

  console.log(`New array: ${JSON.stringify(newUsers)}`)
}

main().catch((err) => {
  console.error(err)
})
