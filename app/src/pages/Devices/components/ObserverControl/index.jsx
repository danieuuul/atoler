import { Switch } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useState } from 'react'
import { Label, SwitchContainer } from './styles'

const useStyles = makeStyles(() => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: '0 10px',
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + $track': {
        backgroundColor: '#52d869',
        opacity: 1,
        border: 'none',
      },
    },
  },
  thumb: {
    width: 24,
    height: 24,
    backgroundColor: '#fff',
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid grey`,
    opacity: 1,
    backgroundColor: '#f44336',
    '&$checked': {
      backgroundColor: '#52d869',
    },
  },
  checked: {},
  notWatching: {},
}))

export function ObserverControl({ isWatching, onToggle }) {
  const [watching, setWatching] = useState(isWatching)
  const classes = useStyles()

  const handleSwitchChange = (event) => {
    setWatching(event.target.checked)
    onToggle(event.target.checked)
  }

  return (
    <SwitchContainer>
      <Label variant="h6">Observando diretório</Label>
      <Switch
        classes={{
          root: classes.root,
          switchBase: classes.switchBase,
          thumb: classes.thumb,
          track: classes.track,
          checked: classes.checked,
        }}
        checked={watching}
        onChange={handleSwitchChange}
      />
    </SwitchContainer>
  )
}
