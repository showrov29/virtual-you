import Image from "next/image";
import { Inter } from "next/font/google";
import axios from "axios";
const inter = Inter({ subsets: ["latin"] });
import { useEffect, useRef, useState } from "react";

export default function Home() {
	const audioRef = useRef(null);
	const [transcription, setTranscription] = useState("");
	const [isListening, setIsListening] = useState(false);
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
				console.log("response", response.data.google.generated_text);
			})
			.catch((err) => {
				console.log("err", err);
			});
		console.log("Audio has ended!");
	};

	return (
		<div>
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
