import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import fs from 'fs'

import path from 'path'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br.js'
import xmldom from 'xmldom'
import { addRowsToTableOfMaterialsAndSeals } from './docx-utils/addRowsToTableOfMaterialsAndSeals.js'
import { addParagraphWithMaterials } from './docx-utils/addParagraphWithMaterials.js'
import { Logger } from '../../libs/Logger.js'

export async function createReportDocument({
  asapPath,
  barCodePath,
  pathToSave,
  template,
}) {
  const templatePath = path.resolve(`./src/tasks/LAUDER/templates/${template}`)
  const content = fs.readFileSync(templatePath, 'binary')

  const docx = new Docxtemplater()
  const zip = new PizZip(content)
  docx.loadZip(zip)

  // for (const key of Object.keys(zip.files)) {
  //   let text = zip.file(key).asText()
  //   fs.writeFileSync(
  //     `G:/2023-226/${key
  //       .replace(/\//g, '')
  //       .replace('.', '')
  //       .replace('_', '')}.txt`,
  //     text,
  //   )
  // }

  zip.remove('word/media/image4.png')
  const imgData = fs.readFileSync(barCodePath)
  zip.file('word/media/image4.png', imgData, { binary: true })

  const asapDictionary = {}
  const linesOfAsapFile = fs.readFileSync(asapPath, 'latin1').split('\n')
  linesOfAsapFile.forEach((line) => {
    const [key, value] = line.split('=')
    if (key && value) {
      asapDictionary[key.trim()] = value.trim()
    }
  })
  const todayDate = dayjs().locale(ptBr).format('DD [de] MMMM [de] YYYY')
  asapDictionary.DATA_HOJE = todayDate
  docx.setData(asapDictionary)

  const materials = []
  const materialTitles = asapDictionary.MATERIAL.split('|')
  const materialDescriptions = asapDictionary.MATERIAL_DESCR.split('|')
  const materialRegister = asapDictionary.MATERIAL_NUMERO.split('|')
  materialTitles.forEach((title, index) => {
    materials.push({})
    materials[index].title = title.split('(Descrição')[0]
    materials[index].description = materialDescriptions[index]
    materials[index].register = materialRegister[index]
  })

  const documentXml = docx.getZip().file('word/document.xml').asText()

  const documentDom = new xmldom.DOMParser().parseFromString(documentXml)

  addRowsToTableOfMaterialsAndSeals(documentDom, materials)

  addParagraphWithMaterials(documentDom, materials)

  const serializer = new xmldom.XMLSerializer()
  const modifiedXml = serializer.serializeToString(documentDom)
  zip.file('word/document.xml', modifiedXml)

  // let text = zip.file('word/document.xml').asText()
  // fs.writeFileSync(`G:/2023-226/document.txt`, text)

  docx.render()
  const output = docx.getZip().generate({ type: 'nodebuffer' })

  try {
    fs.writeFileSync(pathToSave, output)
    Logger.write(`Report ${pathToSave} created.`)
  } catch (error) {
    Logger.write(error)
  }
}
