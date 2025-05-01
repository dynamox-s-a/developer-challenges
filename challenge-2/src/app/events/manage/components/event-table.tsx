"use client";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	IconButton,
	Chip,
	Tooltip,
	CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { EventTableProps } from "../types";

export default function EventTable({
	events,
	onEdit,
	onDelete,
	loading,
}: EventTableProps) {
	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<CircularProgress />
			</div>
		);
	}

	return (
		<TableContainer component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Título</TableCell>
						<TableCell>Descrição</TableCell>
						<TableCell>Data</TableCell>
						<TableCell>Local</TableCell>
						<TableCell>Categoria</TableCell>
						<TableCell>Status</TableCell>
						<TableCell align="right">Ações</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{events.map((event) => (
						<TableRow key={event.id}>
							<TableCell>{event.title}</TableCell>
							<TableCell>
								<Tooltip title={event.description} arrow>
									<div className="max-w-[300px] truncate">
										{event.description}
									</div>
								</Tooltip>
							</TableCell>
							<TableCell>
								{new Date(event.date).toLocaleDateString("pt-BR", {
									hour: "2-digit",
									minute: "2-digit",
								})}
							</TableCell>
							<TableCell>{event.location}</TableCell>
							<TableCell>{event.category}</TableCell>
							<TableCell>
								<Chip
									label={
										new Date(event.date) > new Date() ? "Ativo" : "Finalizado"
									}
									color={
										new Date(event.date) > new Date() ? "success" : "default"
									}
									variant="outlined"
									sx={{
										fontWeight: 500,
										minWidth: 90,
									}}
								/>
							</TableCell>
							<TableCell align="right">
								<Tooltip title="Editar">
									<IconButton
										onClick={() => onEdit(event)}
										size="small"
										sx={{ color: "var(--color-primary)" }}
									>
										<EditIcon
											sx={{
												color: "var(--color-primary)",
											}}
										/>
									</IconButton>
								</Tooltip>
								<Tooltip title="Excluir">
									<IconButton
										onClick={() => onDelete(event)}
										size="small"
										color="error"
									>
										<DeleteIcon />
									</IconButton>
								</Tooltip>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
