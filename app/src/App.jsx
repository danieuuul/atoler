import { ThemeProvider } from 'styled-components'
import { Devices } from './pages/Devices'
import { theme } from './styles'

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <Devices />
    </ThemeProvider>
  )
}
