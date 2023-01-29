import express from 'express'
import bodyParser from 'body-parser';
import hbs from 'hbs'
import fs from "fs-extra"
import multer from 'multer'
import { deleteFile, downloadFile, uploadFile } from './controllers/Files.js';
import { formatDate, getStatus } from './controllers/Helpers.js';
const notesDB = "notes.json";

import { filterNotes, completeNote, saveNote, newNote, deleteNote, editNote, detailsNote} from "./controllers/notes.js";

const __dirname = process.cwd()

const app = express();
const urlParser = bodyParser.urlencoded({extended: false});
const upload = multer({ dest: __dirname + '/files/temp'});

app.use(express.static(__dirname + '/public'));
app.set("view engine", "hbs");

hbs.registerPartials(__dirname + '/views/partials')
hbs.registerHelper("completionStatus", getStatus);
hbs.registerHelper("printDate", formatDate);

app.post('/deleteFile', urlParser, deleteFile);
app.post('/downloadFile', urlParser, downloadFile);
app.post('/uploadFile', upload.single('myFile'), uploadFile);

app.post("/filter", urlParser, filterNotes);
app.post("/complete", urlParser, completeNote);
app.post("/save", urlParser, saveNote);
app.post("/new", urlParser, newNote);

app.get("/delete", deleteNote);
app.get("/edit", editNote);
app.get("/details", detailsNote);
app.get("/", (req, res) => {
	let notes = GetNotes()

	res.render("MainPage.hbs", 
	{
		tableVisible: notes.length > 0,
		notes: notes
	});
});

app.listen(3000);

const GetNotes = () => {
	let data = "";
	let notes = [];

	try {
		data = fs.readFileSync(notesDB, "utf8");
	} catch(error) {
		console.error(error);	
	}

	try {
		notes = JSON.parse(data);
	} catch(error) {
		console.error(error);
		fs.writeFileSync(notesDB, '[]');
		notes = [];
	}

	return notes;
}
