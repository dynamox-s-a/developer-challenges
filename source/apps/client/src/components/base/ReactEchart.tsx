import { forwardRef } from 'react';
import { Box, BoxProps } from '@mui/material';
import { EChartsReactProps } from 'echarts-for-react';
import EChartsReactCore from 'echarts-for-react/lib/core';
import ReactEChartsCore from 'echarts-for-react/lib/core';

export interface ReactEchartProps extends BoxProps {
  echarts: EChartsReactProps['echarts'];
  option: EChartsReactProps['option'];
}

const ReactEchart = forwardRef<null | EChartsReactCore, ReactEchartProps>(
  ({ option, ...rest }, ref) => {
    return (
      <Box
        component={ReactEChartsCore}
        ref={ref}
        option={{
          ...option,
          tooltip: {
            ...option.tooltip,
            confine: true,
          },
        }}
        {...rest}
      />
    );
  },
);

export default ReactEchart;
