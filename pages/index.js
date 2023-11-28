import Image from "next/image";
import { Inter } from "next/font/google";
import axios from "axios";
const inter = Inter({ subsets: ["latin"] });
import { useEffect, useRef, useState } from "react";
import Chat from "./Components/Chat";

export default function Home() {
	const audioRef = useRef(null);
	const [textFormMe, setTextFromMe] = useState("");
	const [isListening, setIsListening] = useState(false);
	const [textFromAi, setTextFromAi] = useState();
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
			.post("http://localhost:3000/api/hello", {
				text: reply,
			})
			.then((response) => {
				console.log("🚀 ~ file: index.js:14 ~ .then ~ response:", response);

				// Assuming the API response contains the new audio file URL
				const newAudioFile = response.data.audioFile;

				// Update the audio element source
				updateAudioSource(newAudioFile);

				// Play the audio
				playAudio();
			});
	};
	const updateAudioSource = (newSrc) => {
		console.log("🚀 ~ file: index.js:32 ~ updateAudioSource ~ newSrc:", newSrc);
		audioRef.current.src = newSrc;
		console.log("audioRef", audioRef.current);
	};

	const playAudio = () => {
		if (audioRef.current) {
			audioRef.current.addEventListener("canplay", () => {
				audioRef.current.play();
			});
		}
	};

	const handleReply = async (message) => {
		//
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
				console.log("response", response);
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
		console.log("Audio has ended!");
	};

	return (
		<div>
			<div className="grid columns-2 grid-flow-col">
				<section className="bg-blue-300 h-screen">
					<div>
						<button
							onClick={() =>
								handleFetchAudio(
									"Hello , I am Julie , I am your speeking partner for now"
								)
							}>
							Start speeking.....
						</button>
					</div>
					{/* <img src={"https://picsum.photos/200"} alt="Logo" border="0" /> */}
				</section>
				<section className="h-screen flex items-center justify-center">
					<div className="bg-slate-200 h-3/4 my-10 w-3/5 shadow-sm shadow-cyan-400 rounded-md overflow-y-auto">
						{conversation &&
							conversation.map((item, index) => (
								<Chat key={index} text={item.text} role={item.role} />
							))}
					</div>
				</section>
			</div>

			<audio
				ref={audioRef}
				id="audioPlayer"
				onEnded={startListening}
				// controls
				autoPlay>
				<source src="/default.mp3" type="audio/mp3" />
			</audio>
		</div>
	);
}
