import path from 'node:path'
import { Command } from 'commander'

import { createReportDocument } from './createReportDocument.js'
import { downloadAsapAndBarCode } from './downloadAsapAndBarCode.js'

import { Logger } from '../../libs/Logger.js'
import { templates } from './templates/index.js'

export async function runLauder({ registerPath, reportNumber, template }) {
  Logger.write('Starting Lauder')

  const { asapPath, barCodePath } = await downloadAsapAndBarCode(
    registerPath,
    reportNumber,
  )
  const pathToSave = path.join(registerPath, `Laudo_${reportNumber}.docx`)

  await createReportDocument({
    asapPath,
    barCodePath,
    pathToSave,
    template,
  })
  Logger.write('Finished Lauder')
}

const importMetaUrl = path.normalize(import.meta.url).replace('file:\\', '')
const processArgv1 = path.normalize(process.argv[1])

function validateTemplate(value) {
  const templateNames = Object.keys(templates)
  if (!templateNames.includes(value)) {
    console.log(
      `Invalid template name. Options are: ${templateNames.join(', ')}`,
    )
    process.exit(1)
  }
  return value
}

if (importMetaUrl === processArgv1) {
  const program = new Command()
  program
    .option('-p, --path <value>', 'Path to files')
    .option('-l, --report <value>', 'Report number (YYYY-XX)')
    .option(
      '-t, --template [value]',
      `Template file name. Options: ${Object.keys(templates).join(', ')}`,
      'default',
    )
    .on('--help', () => {
      console.log('')
      console.log('Usage:')
      console.log('  node runLauder.js -p <path> -l <report> [-t <template>]')
      console.log(
        '  node runLauder.js --path <path> --report <report> [--template <template>]',
      )

      console.log('Examples:')
      console.log(
        '  node runLauder.js -p G:/2023/599 -l 2023-599 -t notfunctional',
      )
      console.log(
        '  node runLauder.js --path G:/2023/599 --report 2023-599 --template pedo',
      )
      console.log('')
    })
    .parse(process.argv)

  const options = program.opts()
  validateTemplate(options.template)

  const registerPath = options.path
  const reportNumber = options.report
  const template = templates[options.template] || templates.default

  if (!registerPath || !reportNumber) {
    console.error('Error: Both path and report number are required')
    program.help()
  }

  runLauder({ registerPath, reportNumber, template })
}
