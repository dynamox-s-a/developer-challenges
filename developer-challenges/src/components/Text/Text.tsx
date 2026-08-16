export interface TextProps {
	text: string;
}

export function Text({ text }: TextProps) {
	return <p>{text}</p>;
}

export default Text;
