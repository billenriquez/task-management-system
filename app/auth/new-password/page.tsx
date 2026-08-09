import LogoArea from "@/components/LogoArea";
import { NewPasswordForm } from "@/components/auth/NewPasswordForm";

const NewPasswordPage = () => {
	//return <NewPasswordForm />;
	return (
		<div className="flex h-screen items-center">
			<div className="absolute top-3 left-3">
				<LogoArea />
			</div>
			<NewPasswordForm />
		</div>
	);
};

export default NewPasswordPage;
