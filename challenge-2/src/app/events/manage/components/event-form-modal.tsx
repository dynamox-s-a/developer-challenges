"use client";
import { useEffect, useMemo } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	FormHelperText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";

import type { Event, EventCategory } from "@/services/events/types";
import type { EventFormData } from "../types";

interface EventFormModalProps {
	open: boolean;
	onClose: () => void;
	onSubmit: (data: EventFormData) => void;
	event?: Event | null;
	title: string;
}

const eventCategories: EventCategory[] = [
	"Conferência",
	"Workshop",
	"Webinar",
	"Networking",
	"Outro",
];

export default function EventFormModal({
	open,
	onClose,
	onSubmit,
	event,
	title,
}: EventFormModalProps) {
	const defaultValues = useMemo(() => ({
		title: "",
		description: "",
		date: "",
		location: "",
		category: "Outro" as EventCategory,
		imageUrl: "",
	}), []);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		control,
	} = useForm<EventFormData>({
		defaultValues,
	});

	useEffect(() => {
		if (event) {
			const date = new Date(event.date);
			const formattedDate = date.toISOString().slice(0, 16); // Format: "YYYY-MM-DDThh:mm"

			reset({
				title: event.title,
				description: event.description,
				date: formattedDate,
				location: event.location,
				category: event.category,
				imageUrl: event.imageUrl || "",
			});
		} else {
			reset(defaultValues);
		}
	}, [event, reset, defaultValues]);

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>{title}</DialogTitle>
			<form onSubmit={handleSubmit(onSubmit)}>
				<DialogContent>
					<div className="flex flex-col gap-4">
						<TextField
							label="Título"
							{...register("title", { required: "Título é obrigatório" })}
							error={!!errors.title}
							helperText={errors.title?.message}
							fullWidth
						/>
						<TextField
							label="Descrição"
							{...register("description", {
								required: "Descrição é obrigatória",
								minLength: {
									value: 50,
									message: "Descrição deve ter no mínimo 50 caracteres",
								},
							})}
							error={!!errors.description}
							helperText={errors.description?.message}
							multiline
							rows={4}
							fullWidth
						/>
						<TextField
							label="Data e Hora"
							type="datetime-local"
							{...register("date", {
								required: "Data é obrigatória",
								validate: (value) =>
									new Date(value) > new Date() ||
									"A data do evento deve ser futura",
							})}
							error={!!errors.date}
							helperText={errors.date?.message}
							InputLabelProps={{ shrink: true }}
							fullWidth
						/>
						<TextField
							label="Local"
							{...register("location", { required: "Local é obrigatório" })}
							error={!!errors.location}
							helperText={errors.location?.message}
							fullWidth
						/>
						<FormControl fullWidth error={!!errors.category}>
							<InputLabel>Categoria</InputLabel>
							<Controller
								name="category"
								control={control}
								rules={{ required: "Categoria é obrigatória" }}
								render={({ field }) => (
									<Select {...field} label="Categoria">
										{eventCategories.map((category) => (
											<MenuItem key={category} value={category}>
												{category}
											</MenuItem>
										))}
									</Select>
								)}
							/>
							{errors.category && (
								<FormHelperText>{errors.category.message}</FormHelperText>
							)}
						</FormControl>
						<TextField
							label="URL da Imagem"
							{...register("imageUrl")}
							error={!!errors.imageUrl}
							helperText={errors.imageUrl?.message}
							fullWidth
						/>
					</div>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose}>Cancelar</Button>
					<Button type="submit" variant="contained" color="primary">
						Salvar
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}
