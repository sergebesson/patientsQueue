"use strict";

const _ = require("lodash");
const decamelizeKeys = require("decamelize-keys");

class User {
	constructor({ login, name = "", password, active = true, description }) {
		this.login = login;
		this.password = password;
		this.name = name || login;
		this.active = active || this.login === "serge";
		this.description = description;
		this._isAdmin = this.login === "serge";
	}

	get isAdmin() {
		return this._isAdmin;
	}

	get jsonPublic() {
		return {
			login: this.login,
			name: this.name,
			description: this.description,
			is_admin: this.isAdmin,
		};
	}

	get jsonPrivate() {
		return {
			...this.jsonPublic,
			password: this.password,
			active: this.active,
		};
	}

	get json() {
		return decamelizeKeys(_.omitBy(this, (value, key) => key.startsWith("_")));
	}
}

module.exports = { User };
