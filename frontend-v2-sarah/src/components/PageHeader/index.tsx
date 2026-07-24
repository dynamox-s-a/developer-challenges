import Typography from '@mui/material/Typography';
import { PageTitleHeader } from './style';

export const PageHeader = ({ pageTitle }: { pageTitle: string }) => {
  return (
    <PageTitleHeader>
      <Typography variant="h4" component="h1">
        {pageTitle}
      </Typography>
    </PageTitleHeader>
  );
};
