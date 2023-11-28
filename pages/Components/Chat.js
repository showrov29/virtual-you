import React from "react";

export default function Chat(props) {
	const { text, role } = props;
	return (
		<div>
			<div className="mx-8 my-3">
				<h1 className={`${role === "user" ? "text-right" : "text-left"} `}>
					{text}
				</h1>
			</div>
		</div>
	);
}
