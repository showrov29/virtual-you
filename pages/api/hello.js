// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import fs from "fs";

export default async function handler(req, res) {
	// Enable CORS for all routes
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");

	if (req.method === "OPTIONS") {
		// Preflight request response
		res.status(200).end();
		return;
	}

	let name = new Date().toString();
	let x = `./public/${name}.mp3`;
	let flag = await synthesizeSpeech(`${req.body.text}....`, x);
	if (flag) {
		res.status(201).json({
			audioFile: `${name}.mp3`,
		});
	} else {
		res.status(400).json({
			message: "Error in generating audio",
		});
	}
}

async function synthesizeSpeech(text, audioFile) {
	return new Promise((resolve, reject) => {
		const speechConfig = sdk.SpeechConfig.fromSubscription(
			"e393bdcfd06d4a0ca0dd950da505eef0",
			"eastasia"
		);
		const audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioFile);

		speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";
		const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

		synthesizer.speakTextAsync(
			text,
			function (result) {
				if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
					console.log("Synthesis finished.");
					synthesizer.close();
					resolve(true);
				} else {
					console.error(
						"Speech synthesis canceled, " +
							result.errorDetails +
							"\nDid you set the speech resource key and region values?"
					);
					synthesizer.close();
					reject(false);
				}
			},
			function (err) {
				console.trace("Error - " + err);
				synthesizer.close();
				reject(false);
			}
		);

		console.log("Now synthesizing to: " + audioFile);
	});
}
