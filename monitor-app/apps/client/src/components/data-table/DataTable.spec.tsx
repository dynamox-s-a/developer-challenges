import { render, screen } from '../../test-utils/test-utils'
import userEvent from '@testing-library/user-event'
import DataTable from './DataTable'

const mockData = [
  {
    id: 'cllo1jq950000vev2qykl9o6j',
    name: 'machine 001',
    type: 'Fan'
  },
  {
    id: 'cllpkfnp90000vejobymmn6xh',
    name: 'machine 002',
    type: 'Pump'
  },
  {
    id: 'cllpllgr10001vejo6eq0ebqf',
    name: 'machine 003',
    type: 'Pump'
  },
  {
    id: 'cllpp14ml0000vewl7cygvrj1',
    name: 'machine 004',
    type: 'Fan'
  },
  {
    id: 'cllpp18700001vewljr6bphlc',
    name: 'machine 005',
    type: 'Fan'
  },
  {
    id: 'cllpp1df00002vewlu39kn121',
    name: 'machine 006',
    type: 'Pump'
  },
  {
    id: 'cllqww33i0000vehucd4dl02o',
    name: 'machine with a very big name test',
    type: 'Fan'
  }
]

describe('DataTable', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DataTable data={mockData} tableTitle="test title" />)
    expect(baseElement).toBeTruthy()
  })

  it('should sort ascending when click on table head', async () => {
    render(<DataTable data={mockData} tableTitle="test title" />)
    const orderByDescIcon = screen.getByText('name')
    const user = userEvent.setup()
    await user.click(orderByDescIcon)
    const firstRowName = screen.getAllByRole('row')[1]
    const firstRow = mockData.slice(0)
    expect(firstRowName).toHaveTextContent(firstRow[0].name)
  })

  it('should sort descending when click two times on table head', async () => {
    render(<DataTable data={mockData} tableTitle="test title" />)
    const orderBy = screen.getByText('name')
    const user = userEvent.setup()
    await user.click(orderBy)
    await user.click(orderBy)
    const firstRowName = screen.getAllByRole('row')[1]
    const firstRow = mockData.slice(-1)
    expect(firstRowName).toHaveTextContent(firstRow[0].name)
  })

  it('should navigate to next page when clicks next page button', async () => {
    render(<DataTable data={mockData} tableTitle="test title" />)
    const nextPageButton = screen.getByLabelText('Go to next page')
    const user = userEvent.setup()
    await user.click(nextPageButton)
    const firstRowName = screen.getAllByRole('row')[1]
    const firstRowOfNextPage = mockData.slice(5)
    expect(firstRowName).toHaveTextContent(firstRowOfNextPage[0].name)
  })

  it('should render a number of rows per page correctly', async () => {
    render(<DataTable data={mockData} tableTitle="test title" />)
    const currentRowsPerPage = screen.getByRole('button', { name: /5/ })
    const user = userEvent.setup()
    await user.click(currentRowsPerPage)
    const rowsPerPage = screen.getByRole('option', { name: /10/ })
    await user.click(rowsPerPage)
    const lastRowName = screen.getAllByRole('row')[mockData.length]
    const lastRow = mockData.slice(-1)
    expect(lastRowName).toHaveTextContent(lastRow[0].name)
  })

  it('should render a actions menu when clicks on settings icon button', async () => {
    render(<DataTable data={mockData} tableTitle="test title" />)
    const actionsButton = screen.getAllByTestId('SettingsIcon')[0]
    const user = userEvent.setup()
    await user.click(actionsButton)
    const editButton = screen.getByRole('menuitem', { name: /edit/i })
    expect(editButton).toBeInTheDocument()
  })
})
