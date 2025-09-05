import tw from "tailwind-styled-components";

const Property = tw.div`text-gray-600 mt-2 flex`;
const Label = tw.span`font-semibold mr-2`;
const Value = tw.span``;

interface CardPropertyProps {
  label: string;
  value: string;
}

export function CardProperty({ label, value }: CardPropertyProps) {
  return (
    <Property>    
      <Label>{label}:</Label>
      <Value>{value}</Value>
    </Property>
  );
}
