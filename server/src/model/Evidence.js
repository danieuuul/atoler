import path from 'path'
import { env } from '../env/index.js'

export class Evidence {
  constructor({
    port,
    register,
    report,
    filename,
    ipedProfile = 'forensic',
    runHIZ = false,
    runIPED = true,
    runLauder = false,
  }) {
    this.port = port

    this.register = register
    this.registerPath = path.resolve(env.REGISTER_RAW_FOLDER, this.register)

    this.report = report

    this.e01Filename = filename
      ? `${filename}.E01`
      : `Laudo_${this.report}_image.E01`

    this.ipedOutputFolder = path.resolve(
      env.REGISTER_RAW_FOLDER,
      this.register,
      `IPED_${this.e01Filename.split('_image')[0]}`,
    )

    this.asapFullPath = path.resolve(
      env.REGISTER_RAW_FOLDER,
      this.register,
      `Asap_${report}.asap`,
    )

    this.e01FullPath = path.resolve(
      env.IMAGE_RAW_FOLDER,
      register,
      this.e01Filename,
    )

    this.ipedProfile = ipedProfile
    this.runIPED = runIPED
    this.runLauder = runLauder
    this.runHIZ = runHIZ
  }
}
