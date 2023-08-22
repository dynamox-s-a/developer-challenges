import { render, screen } from '../../test-utils/test-utils'
import Sidebar from './Sidebar'

const handleDrawerToggle = jest.fn()
const drawerWidth = 240

describe('Sidebar', () => {
  it('should render open sidebar successfully', () => {
    const { baseElement } = render(
      <Sidebar
        drawerWidth={drawerWidth}
        isLgUp={true}
        isOpen={true}
        handleDrawerToggle={handleDrawerToggle}
      />
    )
    expect(baseElement).toBeTruthy()
  })
  it('should render closed sidebar successfully', () => {
    const { baseElement } = render(
      <Sidebar
        drawerWidth={drawerWidth}
        isLgUp={false}
        isOpen={false}
        handleDrawerToggle={handleDrawerToggle}
      />
    )
    expect(baseElement).toBeTruthy()
    const menuItem = screen.queryByText('Dashboard')
    expect(menuItem).not.toBeInTheDocument()
  })
})
