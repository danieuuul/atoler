import fetch from 'node-fetch'
import https from 'https'
import fs from 'fs'
import { env } from '../../env/index.js'

let cookies = ''

export async function login() {
  const loginUrl = 'URL-TO-LOGIN'

  const formData = new FormData()
  formData.append('usuario', env.SISCRIM_USER)
  formData.append('senha', env.SISCRIM_KEY)

  const response = await fetch(loginUrl, {
    method: 'POST',
    body: formData,
    redirect: 'manual',
    agent: new https.Agent({ rejectUnauthorized: false }),
  })

  if (
    response.status === 302 &&
    response.headers.get('Location') === 'URL-TO-REDIRECT-AFTER-LOGIN'
  ) {
    cookies = response.headers.raw()['set-cookie'].join('; ')
  } else {
    throw new Error('Login failed')
  }
}

export async function getReportCodeByReportNumber(reportNumber) {
  const reportUrl = new URL('URL-TO-GET-REPORT-CODE')
  const params = {
    tipo_busca: '',
    acao: '',
    numero_busca: reportNumber,
  }
  reportUrl.search = new URLSearchParams(params).toString()

  const response = await fetch(reportUrl, {
    agent: new https.Agent({ rejectUnauthorized: false }),
    headers: {
      Cookie: cookies,
    },
  })

  if (response.ok) {
    const reportCode = new URL(response.url).searchParams.get('codigo')
    return reportCode
  } else {
    throw new Error('Failed to fetch document')
  }
}

export async function downloadAsapFile(reportCode, pathToSave) {
  const downloadAsapFileUrl = new URL('URL TO DOWNLOAD ASAP')
  const params = {
    action: '',
    id: reportCode,
  }
  downloadAsapFileUrl.search = new URLSearchParams(params).toString()

  const response = await fetch(downloadAsapFileUrl, {
    agent: new https.Agent({ rejectUnauthorized: false }),
    headers: {
      Cookie: cookies,
    },
  })

  const data = await response.arrayBuffer()
  fs.writeFileSync(pathToSave, Buffer.from(data))
}

export async function downloadBarCodeFile(reportCode, pathToSave) {
  const downloadBarCodeFileUrl = new URL('URL-TO-DOWNLOAD-BAR-CODE')
  const params = {
    acao: '',
    codigo: reportCode,
  }
  downloadBarCodeFileUrl.search = new URLSearchParams(params).toString()

  const response = await fetch(downloadBarCodeFileUrl, {
    agent: new https.Agent({ rejectUnauthorized: false }),
    headers: {
      Cookie: cookies,
    },
  })

  const data = await response.arrayBuffer()
  fs.writeFileSync(pathToSave, Buffer.from(data))
}
