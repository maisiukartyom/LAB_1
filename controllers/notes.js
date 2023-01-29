import fs from 'fs'
const notesDB = "notes.json";
const __dirname = process.cwd()
import { getStatus } from './helpers.js';

function GetNote(noteId) {
	let content = fs.readFileSync(notesDB, "utf8");
	let notes = JSON.parse(content);
	let note = null;

	for (var i = notes.length - 1; i >= 0; i--) {
		if (notes[i].id == noteId) {
			note = notes[i];
			break;
		}
	}

	return note;
}

export const GetNotes =() => {
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

function RewriteNotes(notes) {
	let data = JSON.stringify(notes);
	fs.writeFileSync("notes.json", data);
}


export const filterNotes = (req, res) => {
    if(!req.body) return res.sendStatus(400);
	let notes = GetNotes();
	let status = req.body.status;
	let filtredNotes = [];

	if (status == 'Все') {
		filtredNotes = notes;
	} else {
		if (status == 'Завершено!') {
			filtredNotes = notes.filter(note => note.complete);
		} else {
			filtredNotes = notes.filter(note => getStatus(note.date) == status && !note.complete);
		}
	}

	console.log(status);
	console.log(filtredNotes);

	res.render("MainPage.hbs", 
	{
		tableVisible: filtredNotes.length > 0,
		notes: filtredNotes
	});
}

export const completeNote = (req, res) => {
    
	if(!req.body) return res.sendStatus(400);
	let notes = GetNotes();
	let id = req.body.id;

	for (var i = notes.length - 1; i >= 0; i--) {
		if (notes[i].id == id) {
			notes[i].complete = req.body.complete == 'on';
			console.log(notes[i]);
			break;
		}
	}

	RewriteNotes(notes);
	res.redirect("/details?id=" + id);
}

export const saveNote = (req, res) => {
    if(!req.body) return res.sendStatus(400);

	let notes = GetNotes();
	let note = {
		id: req.body.id,
		title: req.body.title,
		content: req.body.content,
		date: req.body.date,
		complete: false
	};

	if (note.id == '0') {
		 
	    let maxId = Math.max.apply(Math, notes.map(function(o) {
	    	return o.id;
	    }));

	    if (maxId == Infinity) {
	    	maxId = 0;
	    }

	    note.id = maxId + 1;
	    notes.push(note);

	    if (!fs.existsSync(__dirname + '/files/' + note.id)) {
	    	fs.mkdir(__dirname + '/files/' + note.id, {recursive: true}, (err) => {
	    		if (err) throw err;
	    	});
	    }	    

	} else {
		for (var i = notes.length - 1; i >= 0; i--) {
			if (notes[i].id == note.id) {
				notes[i].title = note.title;
				notes[i].content = note.content;
				notes[i].date = note.date;
				break;
			}
		}	
	}
	
	RewriteNotes(notes);
	res.redirect("/details?id=" + note.id);
}

export const deleteNote = (req, res) => {
    let id = req.query.id;
    let notes = GetNotes();
    let index = -1;

    for(var i = 0; i < notes.length; i++) {
        if(notes[i].id == id){
            index = i;
            break;
        }
    }

    if(index > -1){
        notes.splice(index, 1)[0];
        RewriteNotes(notes);

        // fs.unlinkSync(__dirname + '/files/' + id, err => {
        // 	if (err) return console.error(err);
        // });

        res.redirect("/");
    } else {
        res.status(404).send();
    }
}

export const editNote = (req, res) => {
    let note = GetNote(req.query.id);

	if (note != null) {
		res.render("EditDetails.hbs", {
			note: note
		});
	} else {
		res.status(404).send();
	}
}

export const newNote = (req, res) => {
    let note = {
		id: 0,
		title: "",
		content: "",
		date: "",
		complete: false
	};

	res.render("EditDetails.hbs", 
	{
		note: note
	});
}

export const detailsNote = (req, res) => {
    let note = GetNote(req.query.id);
	let files = [];

	if (fs.existsSync(__dirname + '/files/' + req.query.id)) {
		files = fs.readdirSync(__dirname + '/files/' + req.query.id);
	}
	 
	console.log(files);

	if (note != null) {
		res.render("details.hbs", 
		{
			note: note,
			files: files,
			showTable: files.length > 0,
			showDate: note.date != ''
		});
	} else {
		res.status(404).send();
	}
}