import LogoArea from "@/components/LogoArea";
import { LoginForm } from "@/components/auth/LoginForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const LoginPage = () => {
	return (
		<div className="flex h-screen items-center">
			<div className="absolute top-3 left-3">
				<LogoArea />
			</div>
			<div className="absolute top-3 right-3">
				<Button asChild>
					<Link href="/">🏠 Home</Link>
				</Button>
			</div>
			<LoginForm />
		</div>
	);
};

export default LoginPage;
