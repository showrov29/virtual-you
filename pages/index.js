import Image from "next/image";
import { Inter } from "next/font/google";
import axios from "axios";
const inter = Inter({ subsets: ["latin"] });
import { useEffect, useRef, useState } from "react";
import Chat from "./Components/Chat";
import Typed from "typed.js";

export default function Home() {
	const audioRef = useRef(null);
	const [textFormMe, setTextFromMe] = useState("");
	const [isListening, setIsListening] = useState(false);
	const [isPreparingReply, setIsPreaparingReply] = useState(false);
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [conversation, setConversation] = useState([]);
	const startListening = () => {
		let recognition;
		recognition = new window.webkitSpeechRecognition();
		recognition.lang = "en-US";
		recognition.interimResults = true;

		recognition.onstart = () => {
			setIsListening(true);
			console.log("Speech recognition service has started");
		};

		recognition.onresult = (event) => {
			const transcript = event.results[0][0].transcript;
			console.log("Transcript:", transcript);

			if (event.results[0].isFinal) {
				console.log("Got Final Result:", transcript);
				setIsListening(false);
				setConversation((prev) => [
					...prev,
					{ text: transcript, role: "user" },
				]);
				transcript !== "" ? handleReply(transcript) : startListening();

				// setConversation((prev) => [...prev, transcript]);
				// handleReply(transcript);
			}

			// console.log("Full Conversation:", fullConversation.join(" "));
		};

		recognition.onend = () => {
			setIsListening(false);

			console.log("Speech recognition ended.");
		};

		recognition.onerror = (error) => {
			console.error("Speech recognition error:", error);
			setIsListening(false);
		};

		recognition.start();
	};

	const handleFetchAudio = async (reply) => {
		console.log("🚀 ~ file: index.js:14 ~ handleFetchAudio ~ reply:", reply);
		await axios
			.post("/api/hello", {
				text: reply,
			})
			.then(async (response) => {
				console.log("🚀 ~ file: index.js:14 ~ .then ~ response:", response);

				// Assuming the API response contains the new audio file URL
				const newAudioFile = response.data.audioFile;

				// Update the audio element source
				await updateAudioSource(newAudioFile);
				setIsPreaparingReply(false);
				// Play the audio
				await playAudio();
			});
	};
	const updateAudioSource = (newSrc) => {
		console.log("🚀 ~ file: index.js:32 ~ updateAudioSource ~ newSrc:", newSrc);
		audioRef.current.src = newSrc;
		console.log("audioRef", audioRef.current);
	};

	const playAudio = () => {
		audioRef.current.addEventListener("loadedmetadata", () => {
			console.log("audioRef duration", audioRef.current.duration);
			if (audioRef.current.duration > 0) {
				audioRef.current.play();
				setIsSpeaking(true);
			} else {
				startListening();
			}
		});
		// if (audioRef.current) {
		// 	audioRef.current.addEventListener("canplay", () => {
		// 		audioRef.current.play();
		// 		setIsSpeaking(true);
		// 	});
		// } else {
		// 	console.log("audio can not be played");
		// }
	};

	const handleReply = async (message) => {
		//

		setIsPreaparingReply(true);
		await axios
			.post(
				"https://api.edenai.run/v2/text/chat",

				{ text: message, providers: "google", temperature: 1 },
				{
					headers: {
						Authorization:
							"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZjlkY2I0NzctZWIzYy00MTUxLWE0NDEtNWYwODQxYTFhOWVmIiwidHlwZSI6ImFwaV90b2tlbiJ9.R2RN8vEHoRxvy9GU2qoZ8x5v3kfU5zixtUWeipFxLjw",
					},
				}
			)
			.then((response) => {
				if (
					response.data.google.generated_text === "" ||
					response.data.google.generated_text === "\n" ||
					response.data.google.generated_text === " \n" ||
					response.data.google.generated_text === " \r\n" ||
					response.data.google.generated_text === "\r\n"
				) {
					startListening();
				}
				response.data.google.generated_text.length > 1 &&
					handleFetchAudio(response.data.google.generated_text);
				setConversation((prev) => [
					...prev,
					{ text: response.data.google.generated_text, role: "bot" },
				]);
				console.log("response", response.data.google.generated_text);
			})
			.catch((err) => {
				console.log("err", err);
			});
	};

	const el = useRef(null);
	useEffect(() => {
		const typed = new Typed(el.current, {
			strings: ["Click here to start or restart the conversation"],
			loop: true,
			backSpeed: 50,
			backDelay: 2000,
			typeSpeed: 80,
			startDelay: 1000,
		});
		return () => {
			// Destroy Typed instance during cleanup to stop animation
			typed.destroy();
		};
	}, []);
	// useEffect(() => {
	// 	audioRef.current.addEventListener("loadedmetadata", () => {
	// 		console.log("audioRef duration", audioRef.current.duration);
	// 		if (audioRef.current.duration > 0) {
	// 			audioRef.current.play();
	// 		} else {
	// 			startListening();
	// 		}
	// 	});
	// });
	return (
		<div>
			<div className="flex flex-row items-center justify-between px-36">
				<section className="h-screen w-1/2 pt-10">
					<div>
						<h1 className="text-4xl font-bold mb-2 text-purple-600">
							{(isListening && "Listning...") ||
								(isSpeaking && "Speaking...") ||
								(isPreparingReply && "Preparing Reply...")}
						</h1>
						<button
							className=" bg-purple-600 w-48 h-24 text-white font-bold py-2 px-4 rounded-full"
							onClick={() =>
								handleFetchAudio(
									"Hello , I am Julie , I am your speeking partner for now"
								)
							}>
							<span ref={el} />
						</button>

						<div className="mt-10">
							<h1 className="font-bold text-2xl text-purple-600 mb-3">Note:</h1>
							This is still under development and using free api and free
							resources. If it get stuck try to restart it by clicking the Start
							button
						</div>
					</div>
					{/* <img src={"https://picsum.photos/200"} alt="Logo" border="0" /> */}
				</section>
				<section className="h-screen w-1/2 overflow-scroll pt-5 bg-neutral-200">
					<div className="overflow-y-auto">
						{conversation &&
							conversation.map((item, index) => (
								<Chat
									key={index}
									text={item.text}
									role={item.role}
									// time={new Date().toLocaleTimeString()}
								/>
							))}
						{/* <div
							className={`${
								true ? " justify-start" : " justify-end"
							} flex my-10 px-6 font-extrabold rounded-xl py-3 w-1/2 mx-10`}>
							<span ref={el} />
						</div> */}
					</div>
				</section>
			</div>

			<audio
				ref={audioRef}
				id="audioPlayer"
				onEnded={() => {
					console.log(audioRef.current.src);
					axios
						.post("/api/delete", {
							name: audioRef.current.src.split("/")[3].split(".")[0] + ".mp3",
						})
						.then((response) => {
							console.log("response", response.data);
						})
						.catch((error) => {
							console.log("error", error);
						});
					setIsSpeaking(false);
					startListening();
				}}
				// controls
				autoPlay>
				<source src="/default.mp3" type="audio/mp3" />
			</audio>
		</div>
	);
}
