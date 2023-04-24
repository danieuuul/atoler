import { env } from '../../env/index.js'

import axios from 'axios'

const api = axios.create({
  baseURL: env.ATOLA_SERVER,
})

export async function scanDevices() {
  const { data } = await api.get('/scan-devices')
  return data.foundSourceDevices
}

export async function startImage({
  source,
  targetFolder,
  targetFile,
  targetFolderLogin,
  targetFolderPwd,
}) {
  const { data } = await api.get('/start-image', {
    params: {
      source,
      targetFolder,
      targetFolderLogin,
      targetFolderPwd,
      targetFile,
    },
  })
  return data
}

export async function checkImageStatus(taskKey) {
  const { data } = await api.get('/check-task', {
    params: {
      taskKey,
    },
  })
  return data
}

export async function stopImage(taskKey) {
  const { data } = await api.get('/stop-task', {
    params: {
      taskKey,
    },
  })
  return data
}
