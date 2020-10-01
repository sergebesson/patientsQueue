"use strict";

const usersJsonSchema = {
	type: "object",
	properties: {
		login: { type: "string" },
		password: { type: "string", minLength: 4 },
		name: { type: "string" },
		active: { type: "boolean", default: true },
		description: { type: "string" },
	},
	additionalProperties: false,
	required: [ "login", "password", "name", "active" ],
};

module.exports = { usersJsonSchema };
