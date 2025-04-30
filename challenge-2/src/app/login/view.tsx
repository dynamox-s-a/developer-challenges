import { Button, Paper, TextField, Typography } from "@mui/material";
import Image from "next/image";
import type { LoginFormProps } from "./types";

export default function LoginForm({
	handleSubmit,
	register,
	errors,
	isSubmitting,
	onSubmit,
	loginError,
}: LoginFormProps) {
	return (
		<div className="min-h-screen flex flex-col md:flex-row items-center justify-center md:items-stretch md:justify-normal">
			<div className="hidden md:flex w-full md:w-1/2 bg-primary-50 flex-col justify-center items-center p-8 md:p-12 gap-6">
				<div className="mb-6">
					<Image
						src="/logo-dynamox.png"
						alt="Logo Dynamox"
						width={154}
						height={64}
					/>
				</div>
				<Typography
					style={{
						fontSize: "1.2rem",
						fontWeight: "bold",
						color: "var(--color-primary-500)",
					}}
				>
					Sistema de Gestão de Eventos
					<br />
					Organize, acompanhe e gerencie todos os seus eventos em um só lugar.
				</Typography>
			</div>

			<div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white p-6 md:p-12 min-h-[60vh] md:min-h-0">
				<Paper elevation={3} className="p-6 md:p-8 w-full max-w-md">
					<Typography
						variant="h5"
						style={{
							marginBottom: "1rem",
							color: "var(--color-primary-500)",
							fontWeight: "bold",
						}}
					>
						Acesse sua conta
					</Typography>
					{loginError && (
						<Typography color="error" align="center" sx={{ mb: 2 }}>
							{loginError}
						</Typography>
					)}
					<form
						className="flex flex-col gap-4"
						onSubmit={handleSubmit(onSubmit)}
						noValidate
					>
						<TextField
							label="E-mail"
							{...register("email")}
							type="email"
							variant="outlined"
							fullWidth
							error={!!errors.email}
							helperText={errors.email?.message}
							required
						/>
						<TextField
							label="Senha"
							{...register("senha")}
							type="password"
							variant="outlined"
							fullWidth
							error={!!errors.senha}
							helperText={errors.senha?.message}
							required
						/>
						<Button
							type="submit"
							variant="contained"
							fullWidth
							disabled={isSubmitting}
							style={{
								background: "var(--color-primary)",
							}}
						>
							Entrar
						</Button>
					</form>
				</Paper>
			</div>
		</div>
	);
}
