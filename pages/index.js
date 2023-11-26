import Image from "next/image";
import { Inter } from "next/font/google";
import axios from "axios";
const inter = Inter({ subsets: ["latin"] });
import { useEffect, useRef } from "react";

export default function Home() {
	const audioRef = useRef(null);

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

	const handleEnded = async () => {
		// handleFetchAudio("ok this is it");

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
				onEnded={handleEnded}
				// controls
				autoPlay>
				<source src="/default.mp3" type="audio/mp3" />
			</audio>
		</div>
	);
}
