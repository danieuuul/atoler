import { Atoler } from '../Atoler.js'
import { io } from '../socket.js'

const atoler = new Atoler()

io.on('connect', (socket) => {
  socket.on('scanDevices', async () => {
    const ports = await atoler.scanDevices()
    socket.emit('fetchData', { ports })
  })

  socket.on('startDeviceImages', async (data) => {
    const { evidences } = data
    atoler.loadEvidences(evidences)
    atoler.startDevicesImages()
  })

  socket.on('startWatchDirectory', async () => await atoler.startWatch())

  socket.on('stopWatchDirectory', async () => await atoler.stopWatch())
})
