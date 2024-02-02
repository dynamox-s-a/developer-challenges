import { Box } from "@mui/material"
import { PageHeader } from "./PageHeader"
import { PageTitle } from "./PageTitle"

interface IPageContainer extends React.HTMLAttributes<HTMLDivElement> {}

export const PageContainer = ({ ...props }: IPageContainer) => {
  return (
    <Box>
      <PageHeader />
      <PageTitle text="Welcome" />
      {props.children}
    </Box>
  )
}
