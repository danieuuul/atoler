import path from 'node:path'
import { program } from 'commander'

import { Logger } from '../../libs/Logger.js'
import { zipAndIso } from './izip.js'
import { calchashes } from './calchashes.js'

export async function runHIZ(folderPath, reportNumber) {
  await Logger.write('Starting HIZ')

  await calchashes(folderPath, reportNumber)
  await zipAndIso(folderPath)

  await Logger.write('Finished HIZ')
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
      console.log('  node runHIZ.js -p <path> -l <report>')
      console.log('  node runHIZ.js --path <path> --report <report>')

      console.log('Examples:')
      console.log('  node runHIZ.js -p G:/2023/599 -l 2023-599')
      console.log('  node runHIZ.js --path G:/2023/599 --report 2023-599')
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

  runHIZ(folderPath, reportNumber)
}
