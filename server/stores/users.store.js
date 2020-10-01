"use strict";

const _ = require("lodash");
const path = require("path");
const { safeCompare } = require("express-basic-auth");
const { JsonDb } = require("@sbesson/json-db");

const { User } = require("./users/user");
const { usersJsonSchema } = require("./users/user.json-schema");

class UsersStore {
	constructor({ configLoader }) {
		const directory = configLoader.getValue("storage.databaseDirectory");
		this.structureJsonDb = {
			idName: "login",
			jsonSchema: usersJsonSchema,
			searchIndex: [ "login", "name", "description" ],
		};

		this.jsonDb = new JsonDb(path.join(directory, "users"));

		this._loginUser = null;
		this._usersExpressBasicAuth = null;
	}

	async initialize() {
		try {
			await this.jsonDb.loadCollection();
		} catch (error) {
			if (error.code !== "ENOENT") {
				throw error;
			}
			await this.jsonDb.create(this.structureJsonDb);
			await this.jsonDb.insert({
				login: "serge",
				password: "achanger",
				name: "Serge Besson",
				active: true,
				description: "Administrateur",
			});
		}
	}

	set loginUser(login) {
		const user = this.jsonDb.collection.getById(login);
		if (!user) {
			throw new Error(`loginUser - utilisateur ${ login } inconnu`);
		}
		this._loginUser = new User(user);
	}
	get loginUser() {
		return this._loginUser;
	}

	checkAuthentification({ login: loginInput, password: passwordInput }) {
		return _.some(
			this.jsonDb.collection.find({ active: true }),
			({ login, password }) =>
				// eslint-disable-next-line no-bitwise
				safeCompare(loginInput, login) & safeCompare(passwordInput, password),
		);
	}

	search({ query, search }) {
		return this.jsonDb.collection.search({ query, search })
			.map((user) => new User(user).jsonPrivate);
	}

	getUserByLogin({ login }) {
		const user = this.jsonDb.collection.getById(login);
		if (!user) {
			return null;
		}
		return new User(user);
	}

	async insert(userInfos) {
		const { document: user } = await this.jsonDb.insert(new User(userInfos).json);
		return new User(user);
	}

	async update(userUpdateInfos) {
		const userInfos = this.jsonDb.collection.getById(userUpdateInfos.login);
		if (!userInfos) {
			throw new Error("userNotfound");
		}
		const user = new User({ ...userInfos, ..._.omitBy(userUpdateInfos, _.isUndefined) });
		const { document: userUpdate } = await this.jsonDb.update(user.json);
		return new User(userUpdate);
	}

	async delete({ login }) {
		const userInfos = this.jsonDb.collection.getById(login);
		if (!userInfos) {
			throw new Error("userNotfound");
		}
		if (new User(userInfos).isAdmin) {
			throw new Error("unauthorized");
		}
		await this.jsonDb.delete(login);
	}
}

module.exports = { UsersStore };
