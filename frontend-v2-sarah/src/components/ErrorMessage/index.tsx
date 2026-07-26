import {
  ErrorWrapper,
  ErrorContentBox,
  StyledErrorIcon,
  ErrorText,
} from './style';

export const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <ErrorWrapper my={2}>
      <ErrorContentBox>
        <StyledErrorIcon />
        <ErrorText component="span">{message}</ErrorText>
      </ErrorContentBox>
    </ErrorWrapper>
  );
};
