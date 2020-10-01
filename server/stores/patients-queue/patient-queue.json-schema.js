"use strict";

const datesJsonSchema = {
	type: "object",
	properties: {
		creation: { type: "string", format: "date-time" },
		reminder: { type: "string", format: "date" },
	},
	additionalProperties: false,
	required: [ "creation", "reminder" ],
};

const patientJsonSchema = {
	type: "object",
	properties: {
		name: { type: "string" },
		firstName: { type: "string" },
		dateOfBirth: { type: "string", format: "date" },
		school: { type: "string" },
		class: { type: "string" },
		phoneNumbers: {
			type: "array",
			items: { type: "string", pattern: "^(0|\\+33)[1-9]([-. ]?[0-9]{2}){4}$" },
		},
	},
	additionalProperties: false,
	required: [ "name" ],
};

const medicalInformationJsonSchema = {
	type: "object",
	properties: {
		requestFrom: { type: "string" },
		requestFor: { type: "string" },
		doctor: { type: "string" },
	},
	additionalProperties: false,
};

const visibleByJsonSchema = {
	anyOf: [ {
		type: "array",
		items: {
			type: "object",
			properties: {
				login: { type: "string" },
				name: { type: "string" },
			},
			additionalProperties: false,
			required: [ "login", "name" ],
		},
	}, {
		const: "ALL",
	} ],
};

const contactsJsonSchema = {
	type: "array",
	items: {
		type: "object",
		properties: {
			_id: { type: "string" },
			date: { type: "string", format: "date-time" },
			information: { type: "string" },
		},
		additionalProperties: false,
		required: [ "_id", "date", "information" ],
	},
};

const stateJsonSchema = {
	type: "object",
	properties: {
		type: { type: "string", enum: [ "in-queue", "processed", "abandoned" ] },
		description: { type: "string" },
	},
	additionalProperties: false,
	required: [ "type" ],
};

const patientQueueJsonSchema = {
	type: "object",
	properties: {
		_id: { type: "string" },
		dates: datesJsonSchema,
		patient: patientJsonSchema,
		medicalInformation: medicalInformationJsonSchema,
		availability: { type: "string" },
		visibleBy: visibleByJsonSchema,
		additionalInformation: { type: "string" },
		contacts: contactsJsonSchema,
		state: stateJsonSchema,
	},
	additionalProperties: false,
	required: [ "_id", "dates", "patient", "visibleBy", "state" ],
};

module.exports = { patientQueueJsonSchema };
