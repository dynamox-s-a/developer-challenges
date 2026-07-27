import type { MachineData } from '../MachineSummaryBar/type';
import { MachineSummaryBarDataLabel, MachineSummaryText } from './style';

export const MachineSummaryItem = ({ data }: { data: MachineData }) => {
  const IconComponent = data.icon;

  return (
    <MachineSummaryBarDataLabel isLarge={data.isLarge}>
      {IconComponent && <IconComponent size={20} />}
      <MachineSummaryText variant="body1" noWrap>
        {data.label}
      </MachineSummaryText>
    </MachineSummaryBarDataLabel>
  );
};
