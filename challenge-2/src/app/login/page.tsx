import LoginController from "./controller";
import { AuthRedirect } from "@/components/auth-redirect";

export default function LoginPage() {
	return (
		<>
			<AuthRedirect />
			<LoginController />
		</>
	);
}
