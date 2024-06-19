import { Box, Icon, Typography, styled } from '@mui/material';
import React from 'react';

/**
 * Parte dos estilos que estão alinhando os textos e icones para tela grande e pequena
 */
const ItemBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    margin: theme.spacing(1),
    '&:not(:last-child)': {
      borderRight: `1px solid ${theme.palette.divider}`,
      paddingRight: theme.spacing(2),
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      borderRight: 'none',
      paddingRight: 0,
      '&:not(:last-child)': {
        borderBottom: `1px solid ${theme.palette.divider}`,
        paddingBottom: theme.spacing(2),
      },
    },
  }));

/**
 * 
 * @param param0 
 * icone do tipo string que traz o nome do icone usado pelo componente
 * nome do tipo string que traz o nome que será mostrado ao lado do icone
 * @returns 
 * Cabeçalho do componente pai
 */
const Cabecalho: React.FC<TagMonitoramentoModel> = ({icone, nome}) => {
  return (
    <ItemBox>
        <Icon fontSize="small">{icone}</Icon>
        <Typography marginLeft={1} variant="body2" gutterBottom>
          {nome}
        </Typography>
    </ItemBox>
  );
}

export default Cabecalho;