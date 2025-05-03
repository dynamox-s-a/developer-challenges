import { TextField, MenuItem, Button } from "@mui/material";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import { useCallback, useMemo } from "react";
import { EventCategory } from "@/types/event";

interface EventFiltersProps {
	onFilterChange: (filters: EventFilters) => void;
	filters: EventFilters;
}

export interface EventFilters {
	title: string;
	category: string;
	startDate: string;
	endDate: string;
}

export function EventFilters({ onFilterChange, filters }: EventFiltersProps) {
	const handleFilterChange = useCallback(
		(field: keyof EventFilters, value: string) => {
			onFilterChange({
				...filters,
				[field]: value,
			});
		},
		[filters, onFilterChange],
	);

	const handleClearFilters = useCallback(() => {
		onFilterChange({
			title: "",
			category: "",
			startDate: "",
			endDate: "",
		});
	}, [onFilterChange]);

	const hasActiveFilters = useMemo(() => {
		return (
			filters.title !== "" ||
			filters.category !== "" ||
			filters.startDate !== "" ||
			filters.endDate !== ""
		);
	}, [filters]);

	return (
		<div className="mb-6">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<TextField
					label="Buscar por título"
					value={filters.title}
					onChange={(e) => handleFilterChange("title", e.target.value)}
					fullWidth
					data-testid="event-title-filter"
					size="small"
				/>
				<TextField
					select
					label="Categoria"
					value={filters.category}
					onChange={(e) => handleFilterChange("category", e.target.value)}
					fullWidth
					size="small"
				>
					<MenuItem value="">Todas</MenuItem>
					{(Object.values(EventCategory) as string[]).map((category) => (
						<MenuItem key={category} value={category}>
							{category}
						</MenuItem>
					))}
				</TextField>
				<TextField
					label="Data inicial"
					type="date"
					value={filters.startDate}
					onChange={(e) => handleFilterChange("startDate", e.target.value)}
					fullWidth
					size="small"
					InputLabelProps={{
						shrink: true,
					}}
				/>
				<TextField
					label="Data final"
					type="date"
					value={filters.endDate}
					onChange={(e) => handleFilterChange("endDate", e.target.value)}
					fullWidth
					size="small"
					InputLabelProps={{
						shrink: true,
					}}
				/>
				<Button
					variant="outlined"
					startIcon={<FilterAltOffIcon />}
					onClick={handleClearFilters}
					size="small"
					disabled={!hasActiveFilters}
				>
					Limpar Filtros
				</Button>
			</div>
		</div>
	);
}
