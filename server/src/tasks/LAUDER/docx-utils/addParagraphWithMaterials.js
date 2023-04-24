export function addParagraphWithMaterials(xml, materials) {
  // Find the paragraph to add
  let paragraphs = xml.getElementsByTagNameNS(
    'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
    'p',
  )
  let targetIndex = -1
  for (let i = 0; i < paragraphs.length; i++) {
    let paragraph = paragraphs[i]
    let textNodes = paragraph.getElementsByTagNameNS(
      'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
      't',
    )
    for (let j = 0; j < textNodes.length; j++) {
      if (
        textNodes[j].textContent ===
        'O presente laudo refere-se ao exame dos seguintes materiais'
      ) {
        targetIndex = i
        break
      }
    }
  }

  if (targetIndex >= 0) {
    const paragraphs = xml.getElementsByTagNameNS(
      'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
      'p',
    )

    if (materials.length > 0) {
      materials.forEach((material, index) => {
        let frag = createFragItem(xml, index + 1, material)
        xml.documentElement.insertBefore(frag, paragraphs[targetIndex + 1])
      })
    } else {
      paragraphs[targetIndex].childNodes[2].lastChild.textContent =
        'Nenhum material cadastrado.'
      xml.documentElement.removeChild(paragraphs[targetIndex].childNodes[3])
    }
  }
}

function createFragItem(xml, index, material) {
  const frag = xml.createDocumentFragment()

  let newParagraph = xml.createElement('w:p')
  newParagraph.setAttribute('w14:textId', '77777777')
  newParagraph.setAttribute('w:rsidR', '00B6447D')
  newParagraph.setAttribute('w:rsidRDefault', '00B6447D')
  newParagraph.setAttribute('w:rsidP', '00647EE2')

  let pPr = xml.createElement('w:pPr')
  let pPrStyle = xml.createElement('w:pStyle')
  pPrStyle.setAttribute('w:val', 'Laudo-corpo')
  pPr.appendChild(pPrStyle)

  newParagraph.appendChild(pPr)

  frag.appendChild(newParagraph)

  newParagraph = xml.createElement('w:p')
  newParagraph.setAttribute('w14:textId', '77777777')
  newParagraph.setAttribute('w:rsidR', '00367716')
  newParagraph.setAttribute('w:rsidRDefault', '00367716')
  newParagraph.setAttribute('w:rsidP', '00032F9F')

  newParagraph = xml.createElement('w:p')
  newParagraph.setAttribute('w14:textId', '77777777')
  newParagraph.setAttribute('w:rsidR', '00B6447D')
  newParagraph.setAttribute('w:rsidRPr', '00012FA2')
  newParagraph.setAttribute('w:rsidRDefault', '00B6447D')
  newParagraph.setAttribute('w:rsidP', '00B6447D')

  pPr = xml.createElement('w:pPr')
  pPrStyle = xml.createElement('w:pStyle')
  pPrStyle.setAttribute('w:val', 'ListNumber1')
  let pPrJc = xml.createElement('w:jc')
  pPrJc.setAttribute('w:val', 'both')

  pPr.appendChild(pPrStyle)
  pPr.appendChild(pPrJc)
  newParagraph.appendChild(pPr)

  let newRun = xml.createElement('w:r')
  newRun.setAttribute('w:rsidRPr', '00012FA2')
  let newRunText = xml.createElement('w:t')
  newRunText.setAttribute('xml:space', 'preserve')
  newRunText.textContent = `Item ${index}) ${material.title}`

  newRun.appendChild(newRunText)
  newParagraph.appendChild(newRun)

  frag.appendChild(newParagraph)

  newParagraph = xml.createElement('w:p')
  newParagraph.setAttribute('w14:textId', '77777777')
  newParagraph.setAttribute('w:rsidR', '00B6447D')
  newParagraph.setAttribute('w:rsidRPr', '00012FA2')
  newParagraph.setAttribute('w:rsidRDefault', '00B6447D')
  newParagraph.setAttribute('w:rsidP', '00B6447D')

  pPr = xml.createElement('w:pPr')
  pPrStyle = xml.createElement('w:pStyle')
  pPrStyle.setAttribute('w:val', 'ListNumber1')
  pPrJc = xml.createElement('w:jc')
  pPrJc.setAttribute('w:val', 'both')

  pPr.appendChild(pPrStyle)
  pPr.appendChild(pPrJc)
  newParagraph.appendChild(pPr)

  frag.appendChild(newParagraph)

  newParagraph = xml.createElement('w:p')
  newParagraph.setAttribute('w14:textId', '77777777')
  newParagraph.setAttribute('w:rsidR', '00B6447D')
  newParagraph.setAttribute('w:rsidRPr', '00012FA2')
  newParagraph.setAttribute('w:rsidRDefault', '00B6447D')
  newParagraph.setAttribute('w:rsidP', '00B6447D')

  pPr = xml.createElement('w:pPr')
  pPrStyle = xml.createElement('w:pStyle')
  pPrStyle.setAttribute('w:val', 'ListParagraph')
  pPr.appendChild(pPrStyle)

  let pPrNumPr = xml.createElement('w:numPr')

  let pPrNumPrIlvl = xml.createElement('w:ilvl')
  pPrNumPrIlvl.setAttribute('w:val', '0')
  pPrNumPr.appendChild(pPrNumPrIlvl)

  let pPrNumPrNumId = xml.createElement('w:numId')
  pPrNumPrNumId.setAttribute('w:val', '28')
  pPrNumPr.appendChild(pPrNumPrNumId)

  pPr.appendChild(pPrNumPr)

  let pPrSpacing = xml.createElement('w:spacing')
  pPrSpacing.setAttribute('w:line', '360')
  pPrSpacing.setAttribute('w:lineRule', 'auto')
  pPr.appendChild(pPrSpacing)

  newParagraph.appendChild(pPr)

  newRun = xml.createElement('w:r')
  newRun.setAttribute('w:rsidRPr', '00012FA2')
  newRunText = xml.createElement('w:t')
  newRunText.setAttribute('xml:space', 'preserve')
  newRunText.textContent = `Descrição: ${material.description}`

  newRun.appendChild(newRunText)
  newParagraph.appendChild(newRun)

  frag.appendChild(newParagraph)

  newParagraph = xml.createElement('w:p')
  newParagraph.setAttribute('w14:textId', '77777777')
  newParagraph.setAttribute('w:rsidR', '00B6447D')
  newParagraph.setAttribute('w:rsidRPr', '00012FA2')
  newParagraph.setAttribute('w:rsidRDefault', '00B6447D')
  newParagraph.setAttribute('w:rsidP', '00B6447D')

  pPr = xml.createElement('w:pPr')
  pPrStyle = xml.createElement('w:pStyle')
  pPrStyle.setAttribute('w:val', 'ListParagraph')
  pPr.appendChild(pPrStyle)

  pPrNumPr = xml.createElement('w:numPr')

  pPrNumPrIlvl = xml.createElement('w:ilvl')
  pPrNumPrIlvl.setAttribute('w:val', '0')
  pPrNumPr.appendChild(pPrNumPrIlvl)

  pPrNumPrNumId = xml.createElement('w:numId')
  pPrNumPrNumId.setAttribute('w:val', '28')
  pPrNumPr.appendChild(pPrNumPrNumId)

  pPr.appendChild(pPrNumPr)

  pPrSpacing = xml.createElement('w:spacing')
  pPrSpacing.setAttribute('w:line', '360')
  pPrSpacing.setAttribute('w:lineRule', 'auto')
  pPr.appendChild(pPrSpacing)

  newParagraph.appendChild(pPr)

  newRun = xml.createElement('w:r')
  newRun.setAttribute('w:rsidRPr', '00012FA2')
  newRunText = xml.createElement('w:t')
  newRunText.setAttribute('xml:space', 'preserve')
  newRunText.textContent = `Registro Interno do Material: ${material.register}`

  newRun.appendChild(newRunText)
  newParagraph.appendChild(newRun)

  frag.appendChild(newParagraph)

  newParagraph = xml.createElement('w:p')
  newParagraph.setAttribute('w14:textId', '77777777')
  newParagraph.setAttribute('w:rsidR', '00B6447D')
  newParagraph.setAttribute('w:rsidRPr', '00012FA2')
  newParagraph.setAttribute('w:rsidRDefault', '00B6447D')
  newParagraph.setAttribute('w:rsidP', '00B6447D')

  pPr = xml.createElement('w:pPr')
  pPrStyle = xml.createElement('w:pStyle')
  pPrStyle.setAttribute('w:val', 'ListParagraph')
  pPr.appendChild(pPrStyle)

  pPrNumPr = xml.createElement('w:numPr')

  pPrNumPrIlvl = xml.createElement('w:ilvl')
  pPrNumPrIlvl.setAttribute('w:val', '0')
  pPrNumPr.appendChild(pPrNumPrIlvl)

  pPrNumPrNumId = xml.createElement('w:numId')
  pPrNumPrNumId.setAttribute('w:val', '28')
  pPrNumPr.appendChild(pPrNumPrNumId)

  pPr.appendChild(pPrNumPr)

  pPrSpacing = xml.createElement('w:spacing')
  pPrSpacing.setAttribute('w:line', '360')
  pPrSpacing.setAttribute('w:lineRule', 'auto')
  pPr.appendChild(pPrSpacing)

  newParagraph.appendChild(pPr)

  newRun = xml.createElement('w:r')
  newRun.setAttribute('w:rsidRPr', '00012FA2')
  newRunText = xml.createElement('w:t')
  newRunText.setAttribute('xml:space', 'preserve')
  newRunText.textContent = 'Codigo do Lacre:'

  newRun.appendChild(newRunText)
  newParagraph.appendChild(newRun)

  newRun = xml.createElement('w:r')
  newRun.setAttribute('w:rsidRPr', '00012FA2')

  let newRunProperties = xml.createElement('w:rPr')
  let newRunColor = xml.createElement('w:color')
  newRunColor.setAttribute('w:val', 'FF0000')
  newRunProperties.appendChild(newRunColor)
  newRun.appendChild(newRunProperties)

  newRunText = xml.createElement('w:t')
  newRunText.setAttribute('xml:space', 'preserve')
  newRunText.textContent = ' XXXXX'
  newRun.appendChild(newRunText)

  newParagraph.appendChild(newRun)

  frag.appendChild(newParagraph)

  return frag
}
