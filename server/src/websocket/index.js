import { Atoler } from '../Atoler.js'
import { io } from '../socket.js'

io.on('connect', (socket) => {
  const atoler = new Atoler()

  socket.on('scanDevices', async () => {
    const ports = await atoler.scanDevices()
    socket.emit('fetchData', { ports })
  })

  socket.on('startDeviceImages', async (data) => {
    const { evidences } = data
    atoler.loadEvidences(evidences)
    atoler.startDevicesImages()
  })

  socket.on('startWatchDirectory', () => atoler.startWatch())

  socket.on('stopWatchDirectory', () => atoler.stopWatch())
})
