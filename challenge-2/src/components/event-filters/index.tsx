import type { RootState } from "@/store";
import {
	resetFilters,
	setPeriod,
	setSearchTerm,
	setSort,
} from "@/store/events/slice";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import SortIcon from "@mui/icons-material/Sort";
import {
	Box,
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

export function EventFilters() {
	const dispatch = useDispatch();
	const filters = useSelector((state: RootState) => state.events.filters);

	return (
		<Box
			sx={{
				p: 2,
				bgcolor: "background.paper",
				borderRadius: 1,
				border: "1px solid var(--color-primary)",
			}}
		>
			<Stack
				direction="column"
				sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}
			>
				<TextField
					label="Buscar eventos"
					value={filters.searchTerm}
					onChange={(e) => dispatch(setSearchTerm(e.target.value))}
					size="small"
					placeholder="Digite para buscar por título ou descrição"
					InputProps={{
						type: "search",
					}}
					fullWidth
					color="primary"
					sx={{
						"& .MuiOutlinedInput-root": {
							"& fieldset": {
								borderColor: "var(--color-primary)",
							},
							"&:hover fieldset": {
								borderColor: "var(--color-primary)",
							},
							"&.Mui-focused fieldset": {
								borderColor: "var(--color-primary)",
							},
						},
						"& .MuiInputLabel-root": {
							color: "var(--color-primary)",
							"&.Mui-focused": {
								color: "var(--color-primary)",
							},
						},
					}}
				/>

				<FormControl size="small" fullWidth>
					<InputLabel
						sx={{
							color: "var(--color-primary)",
							"&.Mui-focused": {
								color: "var(--color-primary)",
							},
						}}
					>
						Período
					</InputLabel>
					<Select
						value={filters.period}
						label="Período"
						onChange={(e) =>
							dispatch(setPeriod(e.target.value as "all" | "past" | "future"))
						}
						color="primary"
						sx={{
							"& .MuiOutlinedInput-notchedOutline": {
								borderColor: "var(--color-primary)",
							},
							"&:hover .MuiOutlinedInput-notchedOutline": {
								borderColor: "var(--color-primary)",
							},
							"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
								borderColor: "var(--color-primary)",
							},
						}}
					>
						<MenuItem value="all">Todos os eventos</MenuItem>
						<MenuItem value="future">Eventos futuros</MenuItem>
						<MenuItem value="past">Eventos passados</MenuItem>
					</Select>
				</FormControl>

				<FormControl size="small" fullWidth>
					<InputLabel
						sx={{
							color: "var(--color-primary)",
							"&.Mui-focused": {
								color: "var(--color-primary)",
							},
						}}
					>
						Ordenar por
					</InputLabel>
					<Select
						value={`${filters.sortBy}-${filters.order}`}
						label="Ordenar por"
						onChange={(e) => {
							const [by, order] = e.target.value.split("-") as [
								"date" | "title",
								"asc" | "desc",
							];
							dispatch(setSort({ by, order }));
						}}
						IconComponent={SortIcon}
						color="primary"
						sx={{
							"& .MuiOutlinedInput-notchedOutline": {
								borderColor: "var(--color-primary)",
							},
							"&:hover .MuiOutlinedInput-notchedOutline": {
								borderColor: "var(--color-primary)",
							},
							"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
								borderColor: "var(--color-primary)",
							},
						}}
					>
						<MenuItem value="date-desc">Data (mais recente)</MenuItem>
						<MenuItem value="date-asc">Data (mais antiga)</MenuItem>
						<MenuItem value="title-asc">Nome (A-Z)</MenuItem>
						<MenuItem value="title-desc">Nome (Z-A)</MenuItem>
					</Select>
				</FormControl>
				<Button
					variant="outlined"
					size="small"
					startIcon={<FilterAltOffIcon />}
					onClick={() => dispatch(resetFilters())}
					disabled={
						filters.searchTerm === "" &&
						filters.period === "all" &&
						filters.sortBy === "date" &&
						filters.order === "desc"
					}
					fullWidth
					color="primary"
					sx={{
						borderColor: "var(--color-primary)",
						color: "var(--color-primary)",
					}}
				>
					Limpar filtros
				</Button>
			</Stack>
		</Box>
	);
}
