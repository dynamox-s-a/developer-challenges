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
	const formatDateToLocal = useMemo(() => {
		return (date: Date) => {
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, "0");
			const day = String(date.getDate()).padStart(2, "0");
			const hours = String(date.getHours()).padStart(2, "0");
			const minutes = String(date.getMinutes()).padStart(2, "0");
			return `${year}-${month}-${day}T${hours}:${minutes}`;
		};
	}, []);

	const defaultValues = useMemo(
		() => ({
			title: "",
			description: "",
			date: "",
			location: "",
			category: "Outro" as EventCategory,
			imageUrl: "",
		}),
		[],
	);

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
			reset({
				...event,
				date: formatDateToLocal(new Date(event.date)),
			});
		} else {
			reset(defaultValues);
		}
	}, [event, reset, defaultValues, formatDateToLocal]);

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
							data-testid="event-title"
							sx={{
								locale: "pt-BR",
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
							data-testid="event-description"
							fullWidth
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
						<TextField
							label="Data e Hora"
							type="datetime-local"
							data-testid="event-date"
							{...register("date", {
								required: "Data é obrigatória",
								validate: (value) => {
									const selectedDate = new Date(value);
									const now = new Date();
									now.setSeconds(0, 0);
									return (
										selectedDate >= now ||
										"A data do evento não pode ser no passado"
									);
								},
							})}
							error={!!errors.date}
							helperText={errors.date?.message}
							inputProps={{
								min: formatDateToLocal(new Date()),
							}}
							InputLabelProps={{
								shrink: true,
							}}
							fullWidth
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
						<TextField
							label="Local"
							{...register("location", { required: "Local é obrigatório" })}
							error={!!errors.location}
							helperText={errors.location?.message}
							fullWidth
							data-testid="event-location"
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
						<FormControl fullWidth error={!!errors.category}>
							<InputLabel
								data-testid="event-category"
								sx={{
									color: "var(--color-primary)",
									"&.Mui-focused": {
										color: "var(--color-primary)",
									},
								}}
							>
								Categoria
							</InputLabel>
							<Controller
								name="category"
								control={control}
								rules={{ required: "Categoria é obrigatória" }}
								render={({ field }) => (
									<Select
										{...field}
										label="Categoria"
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
										{eventCategories.map((category) => (
											<MenuItem
												data-testid={`event-category-${category}`}
												key={category}
												value={category}
											>
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
					</div>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={onClose}
						sx={{
							color: "var(--color-primary)",
						}}
					>
						Cancelar
					</Button>
					<Button
						type="submit"
						variant="contained"
						sx={{
							backgroundColor: "var(--color-primary)",
						}}
					>
						Salvar
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}
