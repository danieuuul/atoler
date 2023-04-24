import { execSync } from 'node:child_process'
import path from 'node:path'
import fs from 'node:fs'
import { program } from 'commander'

import { env } from '../../env/index.js'
import { Logger } from '../../libs/Logger.js'

export function calchashes(folderPath, reportNumber) {
  Logger.write(`Start hashing`)

  const filesPath = path.resolve(folderPath)
  const filesPathParent = path.dirname(filesPath)

  const hashesTxtFullPathfile_ = path.join(filesPathParent, 'hashes.txt')
  const hashOfHashesTxtFullPathFile = path.join(
    filesPathParent,
    'hashOfHashes_' + reportNumber + '.txt',
  )

  const fsumHashOfFilesComannd = `${env.FSUM_PATH} -r -sha256 -d"${filesPath}" *.* > "${hashesTxtFullPathfile_}"`

  Logger.write(`Calculating hashes of files:\n ${fsumHashOfFilesComannd}`)

  execSync(fsumHashOfFilesComannd, { stdio: 'inherit', shell: true })

  const fsumHashOfHashesCommand = `${env.FSUM_PATH} -sha256 -d"${filesPathParent}" hashes.txt > ${hashOfHashesTxtFullPathFile}`

  Logger.write(`Calculating hashes of hashes.txt:\n ${fsumHashOfHashesCommand}`)
  execSync(fsumHashOfHashesCommand, { stdio: 'inherit', shell: true })

  fs.renameSync(
    path.join(filesPathParent, 'hashes.txt'),
    path.join(filesPath, 'hashes.txt'),
  )
}

const importMetaUrl = path.normalize(import.meta.url).replace('file:\\', '')
const processArgv1 = path.normalize(process.argv[1])

if (importMetaUrl === processArgv1) {
  program
    .option('-p, --path <value>', 'Path to files')
    .option('-l, --report <value>', 'Report number (YYYY-XX)')
    .on('--help', () => {
      console.log('')
      console.log('Usage:')
      console.log('  node calchashes.js -p <path> -l <report>')
      console.log('  node calchashes.js --path <path> --report <report>')

      console.log('Examples:')
      console.log('  node calchashes.js -p G:/2023/599 -l 2023-599')
      console.log('  node calchashes.js --path G:/2023/599 --report 2023-599')
      console.log('')
    })

  program.parse(process.argv)

  const options = program.opts()

  const folderPath = options.path
  const reportNumber = options.report

  if (!folderPath || !reportNumber) {
    console.error('Error: Both path and report number are required')
    program.help()
  }

  calchashes(folderPath, reportNumber)
}
