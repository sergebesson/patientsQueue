import moment from "moment";

const DATABASE_DATE_FORMAT = "YYYY-MM-DD";
const DISPLAY_DATE_FORMAT = "D MMM YYYY";

function dateToDate(date) {
	return moment(date, DATABASE_DATE_FORMAT).format(DISPLAY_DATE_FORMAT);
}

function dateTimeToDate(dateTime) {
	return moment(dateTime).format(DISPLAY_DATE_FORMAT);
}

function dateToDuration(date) {
	const momentDate = moment(date, DATABASE_DATE_FORMAT);
	return `${ momentDate < Date.now() ? "-" : "" } ${ momentDate.fromNow(true) }`;
}

function dateToAge(date) {
	const age = moment.duration(Date.now() - moment(date, DATABASE_DATE_FORMAT));
	return `${ age.years() } an${ age.years() > 1 ? "s" : "" }${ age.years() < 20 && age.months() > 0 ? ` ${ age.months() }` : "" }`;
}

export default {
	dateToDate,
	dateTimeToDate,
	dateToDuration,
	dateToAge,
};
