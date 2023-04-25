import React, { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import {
  CheckboxInput,
  CheckboxLabel,
  CheckboxWrapper,
  Input,
  Label,
  Table,
  TableData,
  TableHeader,
  MainContainer,
  Buttons,
  LogContainer,
  LogItem,
  LoadContainer,
  Spinner,
} from './styles'

import { ObserverControl } from './components/ObserverControl'
import { socket } from '../../socket'

export function Devices() {
  const [isImagesStarted, setIsImagesStarted] = useState(false)

  const [isObserving, setIsObserving] = useState(false)

  const [logItems, setLogItems] = useState([])

  const { register, control, handleSubmit, reset } = useForm()

  const { fields } = useFieldArray({
    name: 'evidences',
    control,
  })

  function loadDevices() {
    socket.emit('scanDevices')
  }

  useEffect(() => {
    loadDevices()
  }, [])

  useEffect(() => {
    socket.on('fetchData', async (data) => {
      const { ports } = data
      const evidences = ports.map((port) => ({
        port,
      }))
      reset({ evidences })
    })

    return () => {
      socket.off('fetchData')
    }
  }, [reset])

  useEffect(() => {
    const handleLogMessage = (msg) => {
      setLogItems((prevItems) => [...prevItems, msg])
    }
    socket.on('logMessage', handleLogMessage)
    return () => {
      socket.off('logMessage')
    }
  }, [])

  async function handleStart(data) {
    const { evidences } = data
    socket.emit('startDeviceImages', { evidences })
    setIsImagesStarted(true)
  }

  async function handleWatch() {
    !isObserving
      ? socket.emit('startWatchDirectory')
      : socket.emit('stopWatchDirectory')

    setIsObserving(!isObserving)
  }

  return fields.length ? (
    <MainContainer>
      <Table>
        <thead>
          <tr>
            <TableHeader>Porta</TableHeader>
            <TableHeader>Registro</TableHeader>
            <TableHeader>Laudo</TableHeader>
            <TableHeader>Perfil do IPED</TableHeader>
            <TableHeader>Tarefas</TableHeader>
          </tr>
        </thead>
        <tbody>
          {fields.map((evidence, index) => (
            <tr key={evidence.port}>
              <TableData>
                <Label disabled={isImagesStarted}>{evidence.port}</Label>
              </TableData>
              <TableData>
                <Input
                  type="text"
                  {...register(`evidences.${index}.register`)}
                  disabled={isImagesStarted}
                />
              </TableData>
              <TableData>
                <Input
                  type="text"
                  {...register(`evidences.${index}.report`)}
                  disabled={isImagesStarted}
                />
              </TableData>
              <TableData>
                <Input
                  type="text"
                  {...register(`evidences.${index}.ipedProfile`)}
                  disabled={isImagesStarted}
                />
              </TableData>
              <TableData>
                <CheckboxWrapper>
                  <CheckboxLabel>Lauder</CheckboxLabel>
                  <CheckboxInput
                    type="checkbox"
                    defaultChecked
                    {...register(`evidences.${index}.runLauder`)}
                    disabled={isImagesStarted}
                  />
                  <CheckboxLabel>HIZ</CheckboxLabel>
                  <CheckboxInput
                    type="checkbox"
                    defaultChecked
                    {...register(`evidences.${index}.runHIZ`)}
                    disabled={isImagesStarted}
                  />
                </CheckboxWrapper>
              </TableData>
            </tr>
          ))}
        </tbody>
      </Table>
      <Buttons>
        <ObserverControl isWatching={isObserving} onToggle={handleWatch} />
        <button onClick={handleSubmit(handleStart)} disabled={isImagesStarted}>
          {!isImagesStarted ? 'INICIAR IMAGENS' : 'PROCESSANDO ...'}
        </button>
      </Buttons>
      <LogContainer>
        {logItems.map((log, index) => (
          <LogItem key={index}>
            <span className="log-timestamp">{log.timestamp}</span>
            <span className="log-message">{log.message}</span>
          </LogItem>
        ))}
      </LogContainer>
    </MainContainer>
  ) : (
    <LoadContainer>
      <Spinner />
      <Label>Carregando dispositivos ...</Label>
      <button onClick={loadDevices}>Recarregar</button>
    </LoadContainer>
  )
}
