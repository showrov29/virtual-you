import fs from "fs";

export default async function handler(req, res) {
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
