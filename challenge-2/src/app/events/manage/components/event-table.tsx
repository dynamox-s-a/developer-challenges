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
import { useState } from "react";
import EventDetailsModal from "./event-details-modal";
import type { Event } from "@/services/events/types";
import type { EventTableProps } from "../types";

export default function EventTable({
	events,
	onEdit,
	onDelete,
	loading,
}: EventTableProps) {
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

	const handleRowClick = (event: Event) => {
		setSelectedEvent(event);
	};
	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<CircularProgress />
			</div>
		);
	}

	return (
		<>
			<TableContainer
				component={Paper}
				className="overflow-x-auto rounded-lg shadow-md"
				sx={{ maxHeight: "calc(100vh - 200px)" }}
			>
				<Table
					stickyHeader
					size="small"
					sx={{
						minWidth: 650,
						"& .MuiTableCell-root": {
							px: { xs: 1.5, sm: 2 },
							py: 1.5,
							fontSize: { xs: "0.813rem", sm: "0.875rem" },
						},
						"& .MuiTableRow-root": {
							cursor: "pointer",
							"&:hover": {
								bgColor: "action.hover",
							},
						},
					}}
				>
					<TableHead>
						<TableRow>
							<TableCell sx={{ width: { xs: "25%", sm: "20%" } }}>
								Título
							</TableCell>
							<TableCell className="hidden md:table-cell" sx={{ width: "20%" }}>
								Descrição
							</TableCell>
							<TableCell sx={{ width: { xs: "30%", sm: "20%" } }}>
								Data
							</TableCell>
							<TableCell className="hidden sm:table-cell" sx={{ width: "15%" }}>
								Local
							</TableCell>
							<TableCell className="hidden lg:table-cell" sx={{ width: "15%" }}>
								Categoria
							</TableCell>
							<TableCell sx={{ width: { xs: "25%", sm: "15%" } }}>
								Status
							</TableCell>
							<TableCell align="right" sx={{ width: { xs: "15%", sm: "10%" } }}>
								Ações
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{events.map((event) => (
							<TableRow
								data-testid="event-row"
								key={event.id}
								hover
								onClick={(e) => {
									const target = e.target as HTMLElement;
									if (!target.closest("button")) {
										handleRowClick(event);
									}
								}}
								sx={{
									"&:last-child td, &:last-child th": { border: 0 },
									transition: "background-color 0.2s",
								}}
							>
								<TableCell>
									<div className="truncate font-medium max-w-[150px] sm:max-w-[200px]">
										{event.title}
									</div>
								</TableCell>
								<TableCell className="hidden md:table-cell">
									<div className="truncate text-gray-600 max-w-[150px] sm:max-w-[200px]">
										{event.description}
									</div>
								</TableCell>
								<TableCell>
									<div className="text-gray-700 whitespace-nowrap">
										{new Date(event.date).toLocaleDateString("pt-BR", {
											day: "2-digit",
											month: "2-digit",
											year: "numeric",
											hour: "2-digit",
											minute: "2-digit",
										})}
									</div>
								</TableCell>
								<TableCell className="hidden sm:table-cell">
									<div className="truncate text-gray-600 max-w-[120px]">
										{event.location}
									</div>
								</TableCell>
								<TableCell className="hidden lg:table-cell">
									<div className="truncate text-gray-600 max-w-[120px]">
										{event.category}
									</div>
								</TableCell>
								<TableCell>
									<Chip
										label={
											new Date(event.date) > new Date() ? "Ativo" : "Finalizado"
										}
										color={
											new Date(event.date) > new Date() ? "success" : "default"
										}
										size="small"
										variant="outlined"
										sx={{
											fontWeight: 500,
											minWidth: { xs: 80, sm: 90 },
											fontSize: { xs: "0.75rem", sm: "0.875rem" },
										}}
									/>
								</TableCell>
								<TableCell sx={{ pr: { xs: 1, sm: 2 } }}>
									<Tooltip title="Editar" arrow>
										<IconButton
											onClick={() => onEdit(event)}
											size="small"
											color="primary"
											sx={{
												mr: 1,
												color: "var(--color-primary)",
											}}
										>
											<EditIcon fontSize="small" />
										</IconButton>
									</Tooltip>
									<Tooltip title="Excluir" arrow>
										<IconButton
											onClick={() => onDelete(event)}
											size="small"
											color="error"
										>
											<DeleteIcon fontSize="small" />
										</IconButton>
									</Tooltip>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<EventDetailsModal
				event={selectedEvent}
				open={!!selectedEvent}
				onClose={() => setSelectedEvent(null)}
				onEdit={onEdit}
				onDelete={onDelete}
			/>
		</>
	);
}
