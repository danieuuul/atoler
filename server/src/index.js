import { io } from './socket.js'
import './websocket/index.js'

io.on('connection', (socket) => {
  console.log('Socket:', socket.id)
})

io.listen(3333)
console.log('Socket is running on port 3333')
