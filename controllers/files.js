import fs from 'fs'
const __dirname = process.cwd()

export const deleteFile = (req, res) => {
    if(!req.body) return res.sendStatus(400);
	let file = __dirname + '/files/' + req.body.fileName;
	console.log(file);
	if (fs.existsSync(file)) {
		fs.unlinkSync(file, err => {
			if (err) return console.error(err);
			console.log("deleted" + file);
		});
	}

	res.redirect('back');
}

export const downloadFile = (req, res) => {
    if(!req.body) return res.sendStatus(400);
	let file = __dirname + '/files/' + req.body.fileName;

	if (fs.existsSync(file)) {
		console.log("download" + file);
		res.download(file);
	}
}

export const uploadFile = (req, res) => {
    console.log(req.file);

	if (!fs.existsSync(__dirname + '/files/' + req.body.id)) {
		fs.mkdirSync(__dirname + '/files/' + req.body.id, {recursive: true});
    }

	fs.rename(req.file.path, __dirname + '/files/' + req.body.id + '/' + req.file.originalname, function(err) {
		if (err) throw err;

		if (fs.existsSync(req.file.path)) {
			fs.remove(req.file.path, err => {
				if (err) return console.error(err);
		});
		}
	});

	res.redirect('back');
}