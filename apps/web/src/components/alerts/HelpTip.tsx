import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';

/**
 * Ajuda pontual — o texto longo mora aqui, não na tela. Focável de propósito: um tooltip
 * preso a um ícone inerte não existe para quem navega por teclado.
 */
export function HelpTip({ text, label }: { text: string; label: string }): JSX.Element {
  return (
    <Tooltip title={text} arrow enterTouchDelay={0} leaveTouchDelay={6000}>
      <InfoOutlinedIcon
        tabIndex={0}
        role="note"
        aria-label={label}
        sx={{ fontSize: 14, color: 'text.secondary', verticalAlign: 'middle', ml: 0.4, cursor: 'help', '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', borderRadius: '50%' } }}
      />
    </Tooltip>
  );
}
