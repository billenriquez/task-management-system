import React from "react";
import logoPic from "@/public/images/efi-logo.png";
import Image from "next/image";

export default function LogoArea() {
	return (
		<div className="py-1 px-5">
			<Image src={logoPic} alt={"Brand logo"} height={48} width={220} />
		</div>
	);
}
