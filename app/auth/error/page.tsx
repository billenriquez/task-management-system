import LogoArea from "@/components/LogoArea";
import { ErrorCard } from "@/components/auth/ErrorCard";

const AuthErrorPage = () => {
	//return <ErrorCard />;
	return (
		<div className="flex h-screen items-center">
			<div className="absolute top-3 left-3">
				<LogoArea />
			</div>
			<ErrorCard />;
		</div>
	);
};

export default AuthErrorPage;
