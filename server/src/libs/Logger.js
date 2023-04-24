import dayjs from 'dayjs'
import tz from 'dayjs/plugin/timezone.js'
import utc from 'dayjs/plugin/utc.js'

import fs from 'fs'
import path from 'path'
import { getSocketServerInstance } from '../socket.js'

dayjs.extend(tz)
dayjs.extend(utc)
const now = dayjs().tz(dayjs.tz.guess())

export class Logger {
  static logFilepath = path.resolve(
    `./logs/ATOLER-${now.format('YYYY-MM-DD-HH-mm-ss')}`,
  )

  static write(msg) {
    const formattedDate = dayjs()
      .tz(dayjs.tz.guess())
      .format('DD/MM/YYYY - HH:mm:ss [GMT]Z')
    console.log(`${formattedDate} - ${msg}`)
    fs.writeFileSync(this.logFilepath, `${formattedDate} - ${msg}\n`, {
      flag: 'a+',
    })

    const logMessage = {
      timestamp: formattedDate,
      message: msg,
    }
    const socket = getSocketServerInstance()
    console.log('Emitting logMessage')
    socket.emit('logMessage', logMessage)
  }
}
