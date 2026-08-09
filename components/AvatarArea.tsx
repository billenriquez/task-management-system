"use client";

import React from "react";

interface AvatarAreaProps {
	name: string;
	img_src: string;
	//setOpen?: Dispatch<SetStateAction<boolean>>;
}

export default function AvatarArea({
	name,
	img_src /* , setOpen */,
}: AvatarAreaProps) {
	return (
		<div className="flex items-center">
			<p className="font-semibold text-sm text-black">{name}</p>
			<img
				src={img_src} // "https://static01.nyt.com/images/2019/11/08/world/08quebec/08quebec-superJumbo.jpg"
				className="object-cover btn- h-9 w-9 rounded-full mr-2 bg-gray-300"
				alt="User avatar"
			/>
		</div>
	);
}
