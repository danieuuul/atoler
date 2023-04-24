export function addRowsToTableOfMaterialsAndSeals(xmlDoc, materials) {
  const tables = xmlDoc.getElementsByTagNameNS(
    'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
    'tbl',
  )
  const tableOfMaterialsAndSeal = tables[1]

  materials.forEach((material) => {
    const row = xmlDoc.createElement('w:tr')
    row.setAttribute('w:rsidR', '00E87E31')
    row.setAttribute('w14:paraId', '7770D0DB')
    row.setAttribute('w14:textId', '77777777')
    row.setAttribute('w:rsidTr', '00AF3EBB')

    const rowProperties = xmlDoc.createElement('w:trPr')
    const rowPropertiesJustification = xmlDoc.createElement('w:jc')
    rowPropertiesJustification.setAttribute('w:val', 'center')
    rowProperties.appendChild(rowPropertiesJustification)

    row.appendChild(rowProperties)

    row.appendChild(createCell(xmlDoc, material.register))
    row.appendChild(createCell(xmlDoc, 'XXXXX', 'red'))

    tableOfMaterialsAndSeal.appendChild(row)
  })
}

function createCell(xmlDoc, text, color = 'default') {
  const cell = xmlDoc.createElement('w:tc')

  const cellProperties = xmlDoc.createElement('w:tcPr')

  const cellWidth = xmlDoc.createElement('w:tcW')
  cellWidth.setAttribute('w:w', '4531')
  cellWidth.setAttribute('w:type', 'dxa')
  cellProperties.appendChild(cellWidth)

  const cellShading = xmlDoc.createElement('w:shd')
  cellShading.setAttribute('w:val', 'clear')
  cellShading.setAttribute('w:color', 'auto')
  cellShading.setAttribute('w:fill', 'auto')
  cellProperties.appendChild(cellShading)

  cell.appendChild(cellProperties)

  const cellParagraph = xmlDoc.createElement('w:p')
  cellParagraph.setAttribute('w14:paraId', '2FD9BDD6')
  cellParagraph.setAttribute('w14:textId', '481C743E')
  cellParagraph.setAttribute('w:rsidR', '00E87E31')
  cellParagraph.setAttribute('w:rsidRPr', '00E87E31')
  cellParagraph.setAttribute('w:rsidRDefault', '00E87E31')
  cellParagraph.setAttribute('w:rsidP', '00533F79')

  const cellParagraphProperties = xmlDoc.createElement('w:pPr')

  const cellSuppressLineNumbers = xmlDoc.createElement('w:suppressLineNumbers')
  cellParagraphProperties.appendChild(cellSuppressLineNumbers)

  const cellSpacing = xmlDoc.createElement('w:spacing')
  cellSpacing.setAttribute('w:line', '360')
  cellSpacing.setAttribute('w:lineRule', 'auto')
  cellParagraphProperties.appendChild(cellSpacing)

  const cellJustification = xmlDoc.createElement('w:jc')
  cellJustification.setAttribute('w:val', 'center')
  cellParagraphProperties.appendChild(cellJustification)

  cellParagraph.appendChild(cellParagraphProperties)

  const cellRun = xmlDoc.createElement('w:r')
  cellRun.setAttribute('w:rsidRPr', '00E87E31')

  if (color !== 'default') {
    const runProperties = xmlDoc.createElement('w:rPr')
    const runColor = xmlDoc.createElement('w:color')
    runColor.setAttribute('w:val', color)
    runProperties.appendChild(runColor)
    cellRun.appendChild(runProperties)
  }

  const cellRunNode = xmlDoc.createElement('w:t')
  cellRunNode.textContent = text
  cellRun.appendChild(cellRunNode)

  cellParagraph.appendChild(cellRun)

  cell.appendChild(cellParagraph)

  return cell
}
