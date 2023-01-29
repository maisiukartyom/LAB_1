export const formatDate = (strDate) => {
    let output = '';
	if (strDate == '') {
		output = "-"
	} else {
		let date = new Date(strDate);
		output = date.toLocaleDateString("ru-RU", { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
	}

	return output;
}

export const getStatus = (completeDate) => {
    let status = "В процессе!";

	if (Date.parse(completeDate) - Date.now() < 0) 
		status = "Время вышло!";

	if (completeDate == '') {
		status = 'Бессрочно!';
	}

	return status;
}