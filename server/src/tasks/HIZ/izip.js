import { execSync } from 'node:child_process'
import path from 'node:path'
import { program } from 'commander'
import { env } from '../../env/index.js'
import { Logger } from '../../libs/Logger.js'

const LIMIT_DVD_BLURAY = 15
const BLURAY_MAX_FILES = 16
const DVD_MAX_FILES = 3

function buildListOfIso(numberOfFiles) {
  const listOfIso = []
  let mediasCounter = 1
  let filesCounter = 1

  while (numberOfFiles > 0) {
    if (numberOfFiles > LIMIT_DVD_BLURAY) {
      if (numberOfFiles <= BLURAY_MAX_FILES) {
        listOfIso.push({
          mediasCounter,
          filesCounter,
          numberOfFiles,
        })
        mediasCounter += 1
        filesCounter += numberOfFiles
        numberOfFiles = 0
      } else {
        listOfIso.push({
          mediasCounter,
          filesCounter,
          numberOfFiles: BLURAY_MAX_FILES,
        })
        mediasCounter += 1
        filesCounter += BLURAY_MAX_FILES
        numberOfFiles -= BLURAY_MAX_FILES
      }
    } else {
      if (numberOfFiles <= DVD_MAX_FILES) {
        listOfIso.push({
          mediasCounter,
          filesCounter,
          numberOfFiles,
        })
        mediasCounter += 1
        filesCounter += numberOfFiles
        numberOfFiles = 0
      } else {
        listOfIso.push({
          mediasCounter,
          filesCounter,
          numberOfFiles: DVD_MAX_FILES,
        })
        mediasCounter += 1
        filesCounter += DVD_MAX_FILES
        numberOfFiles -= DVD_MAX_FILES
      }
    }
  }

  return listOfIso
}

export function zipAndIso(folderPath) {
  Logger.write(`Start zipping`)

  const folderParentPath = path.dirname(folderPath)

  const zipFileName = path.join(
    folderParentPath,
    `${path.basename(folderPath)}.7z`,
  )

  const zipCommand = `"${env.ZIP_PATH}" -v1448m a "${zipFileName}" "${folderPath}"`

  Logger.write(`Zipping folder:\n ${zipCommand}`)

  execSync(zipCommand, { stdio: 'inherit', shell: true })

  const findCommand = `dir "${folderParentPath}\\*.7z*" | find /c "${path.basename(
    folderPath,
  )}.7z"`
  const totalOfZipFiles = parseInt(execSync(findCommand).toString())

  const listOfIso = buildListOfIso(totalOfZipFiles)
  const totalOfMedias = listOfIso.length

  const imgBurnEXE = 'C:/Program Files (x86)/ImgBurn/imgburn'
  const imgBurnConfig =
    ' /mode build /buildoutputmode imagefile /FILESYSTEM "UDF" /VOLUMELABEL_UDF IPED /ROOTFOLDER YES /NOIMAGEDETAILS /START /CLOSE'

  for (let i = 0; i < totalOfMedias; i++) {
    const isoName = path.join(
      folderParentPath,
      `${path.basename(folderPath)}_${
        listOfIso[i].mediasCounter
      }de${totalOfMedias}.iso`,
    )

    let files = ''
    for (let j = 0; j < listOfIso[i].numberOfFiles; j++) {
      files +=
        folderPath +
        '.7z.' +
        String(listOfIso[i].filesCounter + j).padStart(3, '0') +
        '|'
    }

    const imgBurnCommand = `"${imgBurnEXE}" /DEST "${isoName}" /src "${files}" ${imgBurnConfig}`
    Logger.write(`Creating .iso files:\n ${imgBurnCommand}`)

    execSync(imgBurnCommand.trim(), { stdio: 'inherit', shell: true })
  }
}

const importMetaUrl = path.normalize(import.meta.url).replace('file:\\', '')
const processArgv1 = path.normalize(process.argv[1])

if (importMetaUrl === processArgv1) {
  program.option('-p, --path <value>', 'Path to files').on('--help', () => {
    console.log('')
    console.log('Usage:')
    console.log('  node izip.js -p <path>')
    console.log('  node izip.js --path <path>')

    console.log('Examples:')
    console.log('  node izip.js -p G:/2023-599/IPED_Laudo_2023-599')
    console.log('  node izip.js --path G:/2023-599/IPED_Laudo_2023-599')
    console.log('')
  })

  program.parse(process.argv)

  const options = program.opts()

  const folderPath = options.path

  if (!folderPath) {
    console.error('Error: Path is required')
    program.help()
  }

  zipAndIso(folderPath)
}
