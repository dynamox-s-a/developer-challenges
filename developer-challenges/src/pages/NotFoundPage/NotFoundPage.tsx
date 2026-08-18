import { Link } from "react-router-dom";
import { Flex } from "../../components/Flex/Flex";
import { Typography } from "../../components/Typography/Typography";

export function NotFoundPage() {
	return (
		<Flex direction="column" align="center" gap={2} m={4}>
			<Typography text="404 - Página não encontrada" size="h5" />
			<Link to="/data">Voltar para o início</Link>
		</Flex>
	);
}

export default NotFoundPage;
