import { execSync } from 'child_process'
import { Logger } from '../../libs/Logger.js'

export async function runIPED({
  e01FullPath,
  ipedOutputFolder,
  ipedProfile,
  asapFullPath,
}) {
  let ipedCLI = `iped -d ${e01FullPath} -o ${ipedOutputFolder} -profile ${ipedProfile}`

  if (['userCategories', 'userCategories_multimedia'].includes(ipedProfile)) {
    ipedCLI += ` -asap ${asapFullPath}`
  }

  await Logger.write(`Starting IPED:\n ${ipedCLI}\n`)

  try {
    const stdout = execSync(ipedCLI).toString()
    await Logger.write(stdout)
  } catch (err) {
    await Logger.write(err.output.toString())
  }
}
