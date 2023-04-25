import fs from 'fs'
import path from 'path'
import {
  login as loginSISCIM,
  getReportCodeByReportNumber,
  downloadAsapFile,
  downloadBarCodeFile,
} from '../../libs/api/siscrim.js'
import { Logger } from '../../libs/Logger.js'

export async function downloadAsapAndBarCode(registerPath, reportNumber) {
  try {
    // LOGIN INTO SISCRIM AND SAVE COOKIE
    await loginSISCIM()
    await Logger.write('Logged in SISCRIM')

    // GET THE REPORT CODE SO IT'LL BE POSSIBLE TO RETRIEVE OTHER DOCUMENTS FURTHER
    const reportCode = await getReportCodeByReportNumber(
      reportNumber.split('-')[1],
    )

    // CREATE REGISTER FOLDER IF NOT EXISTS
    await fs.promises.mkdir(registerPath, {
      recursive: true,
    })

    // DOWNLOAD ASAP FILE
    const asapPath = path.join(registerPath, `Asap_${reportNumber}.asap`)
    await downloadAsapFile(reportCode, asapPath)
    await Logger.write(`Downloaded ${asapPath} file`)

    // DOWNLOAD BAR CODE FILE
    const barCodePath = path.join(registerPath, `bar_code_${reportNumber}.png`)

    await downloadBarCodeFile(reportCode, barCodePath)
    await Logger.write(`Downloaded ${barCodePath} bar code file`)

    return { asapPath, barCodePath }
  } catch (error) {
    console.error(error)
  }
}
