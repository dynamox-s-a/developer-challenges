import { useEffect } from 'react';

interface PageTitleProps {
  title: string;
}

const PageTitle = ({ title }: PageTitleProps) => {
  useEffect(() => {
    document.title = `${title} | Dynamox`;
  }, [title]);

  return null;
};

export default PageTitle;
