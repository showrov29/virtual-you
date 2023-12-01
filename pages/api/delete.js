import fs from "fs";

export default async function handler(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");

	if (req.method === "OPTIONS") {
		// Preflight request response
		res.status(200).end();
		return;
	}
	const fileName = `./public/${req.body.name}`;
	const filePath = decodeURIComponent(fileName);
	console.log("🚀 ~ file: delete.js:6 ~ handler ~ filePath:", filePath);
	if (fs.existsSync(filePath)) {
		fs.unlinkSync(filePath);
		console.log("File deleted successfully");
	} else {
		console.log("File not found, cannot delete");
	}
	res.status(201).json({
		audioFile: `${req.body.name}`,
	});
}
