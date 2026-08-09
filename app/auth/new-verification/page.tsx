import LogoArea from "@/components/LogoArea";
import { NewVerificationForm } from "@/components/auth/NewVerificationForm";

const NewVerificationPage = () => {
	// return <NewVerificationForm />;
	return (
		<div className="flex h-screen items-center">
			<div className="absolute top-3 left-3">
				<LogoArea />
			</div>
			<NewVerificationForm />
		</div>
	);
};

export default NewVerificationPage;
