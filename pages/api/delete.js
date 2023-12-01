import fs from "fs";
const allowCors = (fn) => async (req, res) => {
	res.setHeader("Access-Control-Allow-Credentials", true);
	res.setHeader("Access-Control-Allow-Origin", "*");
	// another common pattern
	// res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET,OPTIONS,PATCH,DELETE,POST,PUT"
	);
	res.setHeader(
		"Access-Control-Allow-Headers",
		"X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
	);
	if (req.method === "OPTIONS") {
		res.status(200).end();
		return;
	}
	return await fn(req, res);
};
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
module.exports = allowCors(handler);
