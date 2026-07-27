import {
  ErrorWrapper,
  ErrorContentBox,
  StyledErrorIcon,
  ErrorText,
} from './style';

export const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <ErrorWrapper my={2} data-testid="error-wrapper">
      <ErrorContentBox>
        <StyledErrorIcon data-testid="error-message-icon" />
        <ErrorText component="span" data-testid="error-message-text">
          {message}
        </ErrorText>
      </ErrorContentBox>
    </ErrorWrapper>
  );
};
