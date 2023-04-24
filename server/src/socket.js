import { Server } from 'socket.io'

export const io = new Server({
  cors: {
    origin: 'http://localhost:3000',
  },
})

let socketServerInstance = null
const getSocketServerInstance = () => {
  if (!socketServerInstance) {
    socketServerInstance = io
  }
  return socketServerInstance
}

export { getSocketServerInstance }
