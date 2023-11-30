import React, { useEffect, useRef } from "react";
import Typed from "typed.js";

export default function Chat(props) {
	const { text, role, time } = props;
	const el = useRef(null);
	useEffect(() => {
		const typed = new Typed(el.current, {
			strings: [text],
			typeSpeed: 50,
			backSpeed: 50,
			loop: false,
			showCursor: false,
		});
		return () => {
			typed.destroy();
		};
	}, []);
	return (
		<div>
			<div className={`chat ${role === "bot" ? "chat-start" : "chat-end"}`}>
				<div className="chat-image avatar">
					<div className="w-10 rounded-full">
						<img
							alt="Tailwind CSS chat bubble component"
							src={`${
								role !== "bot"
									? "https:/picsum.photos/200"
									: "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
							}`}
						/>
					</div>
				</div>
				<div className="chat-header capitalize">
					{role}
					<time className="text-xs opacity-50">{time}</time>
				</div>
				<div className="chat-bubble">
					<span ref={el} />
				</div>
				{/* <div className="chat-footer opacity-50">Delivered</div> */}
			</div>
			{/* <div className={`chat ${role === "bot" ? "chat-start" : "chat-end"}`}>
				<div className="chat-image avatar">
					<div className="w-10 rounded-full">
						<img
							alt="Tailwind CSS chat bubble component"
							src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
						/>
					</div>
				</div> */}
			{/* <div className="chat-header">
					Anakin
					<time className="text-xs opacity-50">12:46</time>
				</div>
				<div className="chat-bubble">I hate you!</div>
				<div className="chat-footer opacity-50">Seen at 12:46</div> */}
			{/* </div> */}
		</div>
	);
}
