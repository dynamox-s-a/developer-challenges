import Typography from "@mui/material/Typography"

interface IPageTitle extends React.HTMLAttributes<HTMLElement> {
  text: string
}

export const PageTitle = ({ text, ...props }: IPageTitle) => {
  return (
    <Typography variant="h5" component="h1">
      {text}
    </Typography>
  )
}
