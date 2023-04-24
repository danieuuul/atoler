import fs from 'fs'
import path from 'path'
import chokidar from 'chokidar'

import { env } from './env/index.js'
import { runIPED } from './tasks/IPED/runIPED.js'
import { runLauder } from './tasks/LAUDER/runLauder.js'
import { runHIZ } from './tasks/HIZ/runHIZ.js'
import { scanDevices, startImage } from './libs/api/atola.js'
import { Logger } from './libs/Logger.js'
import { templates } from './tasks/LAUDER/templates/index.js'
import { Evidence } from './model/Evidence.js'

export class Atoler {
  constructor() {
    this.directoryToWatch = env.DIRECTORY_TO_WATCH
    this.imageRawFolder = env.IMAGE_RAW_FOLDER
    this.targetFolderLogin = env.FOLDER_LOGIN
    this.targetFolderPwd = env.FOLDER_PWD

    this.countImagesProcessed = 0
  }

  loadEvidences(evidences) {
    this.evidences = evidences.map((evidence) => new Evidence(evidence))
  }

  getEvidenceByE01File(e01FullPath) {
    return this.evidences.find((evidence) => {
      return (
        path.basename(evidence.e01FullPath, '.E01') ===
        path.basename(e01FullPath, '.E01')
      )
    })
  }

  async scanDevices() {
    const devices = await scanDevices()
    const ports = devices.map((device) => device.split(' ')[0])
    return ports
  }

  startDevicesImages() {
    Logger.write('Starting images')
    this.evidences.forEach((evidence) => {
      startImage({
        source: evidence.port,
        targetFolder: path.resolve(this.imageRawFolder, evidence.register),
        targetFile: evidence.e01Filename.replace('.E01', ''),
        targetFolderLogin: this.targetFolderLogin,
        targetFolderPwd: this.targetFolderPwd,
      })
    })
  }

  startWatch() {
    this.watcher = chokidar.watch(this.directoryToWatch, {
      ignored: /^\./,
    })

    Logger.write(`Start watching directory ${this.directoryToWatch}`)

    this.watcher.on('all', async (event, path) => {
      if (path.includes('Log.html')) {
        const content = fs.readFileSync(path, { encoding: 'utf-8' })
        // if (content.includes('Imaging completed')) {
        if (content.includes('paused')) {
          Logger.write(`File modificated: ${path}`)
          const newE01fileFullpath = path.split('_E01')[0] + '.E01'
          const newEvidence = this.getEvidenceByE01File(newE01fileFullpath)

          await new Promise((resolve) => setTimeout(resolve, 1000))

          Logger.write(
            `Processing image: ${newEvidence.e01Filename} - ${
              this.countImagesProcessed + 1
            } of ${this.evidences.length}`,
          )

          await new Promise((resolve) => setTimeout(resolve, 2000))

          newEvidence.runIPED &&
            runIPED({
              e01FullPath: newEvidence.e01FullPath,
              ipedOutputFolder: newEvidence.ipedOutputFolder,
              ipedProfile: newEvidence.ipedProfile,
              asapFullPath: newEvidence.asapFullPath,
            })

          await new Promise((resolve) => setTimeout(resolve, 2000))

          newEvidence.runLauder &&
            (await runLauder({
              registerPath: newEvidence.registerPath,
              reportNumber: newEvidence.report,
              template: templates[newEvidence.ipedProfile] || templates.default,
            }))

          await new Promise((resolve) => setTimeout(resolve, 2000))

          newEvidence.runHIZ &&
            runHIZ(newEvidence.ipedOutputFolder, newEvidence.report)

          await new Promise((resolve) => setTimeout(resolve, 1000))

          Logger.write(
            `Finished image processing: ${newEvidence.e01Filename} - ${
              this.countImagesProcessed + 1
            } of ${this.evidences.length}`,
          )
          this.countImagesProcessed++
        }
      }
    })
  }

  stopWatch() {
    this.watcher
      .close()
      .then(() =>
        Logger.write(`Stop watching directory ${this.directoryToWatch}`),
      )
  }
}
