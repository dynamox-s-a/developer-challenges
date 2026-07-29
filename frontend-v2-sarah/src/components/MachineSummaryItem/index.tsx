import type { MachineData } from '../MachineSummaryBar/type';
import { MachineSummaryBarDataLabel, MachineSummaryText } from './style';

export const MachineSummaryItem = ({ data }: { data: MachineData }) => {
  const IconComponent = data.icon;

  return (
    <MachineSummaryBarDataLabel
      isLarge={data.isLarge}
      data-testid={`machine-summary-item-${data.id}`}
    >
      {IconComponent && (
        <IconComponent size={20} data-testid="machine-summary-icon" />
      )}
      <MachineSummaryText
        variant="body1"
        noWrap
        data-testid="machine-summary-text"
      >
        {data.label}
      </MachineSummaryText>
    </MachineSummaryBarDataLabel>
  );
};
