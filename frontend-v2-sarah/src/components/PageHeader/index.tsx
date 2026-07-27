import Typography from '@mui/material/Typography';
import { PageTitleHeader } from './style';

export const PageHeader = ({ pageTitle }: { pageTitle: string }) => {
  return (
    <PageTitleHeader data-testid="page-header-container">
      <Typography variant="h4" component="h1" data-testid="page-header-title">
        {pageTitle}
      </Typography>
    </PageTitleHeader>
  );
};
