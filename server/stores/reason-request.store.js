"use strict";

const path = require("path");
const EventEmitter = require("events");
const { JsonDb } = require("@sbesson/json-db");

class ReasonRequestStore extends EventEmitter {
	constructor({ configLoader }) {
		super();
		const directory = configLoader.getValue("storage.databaseDirectory");
		this.structureJsonDb = {
			jsonSchema: {
				type: "object",
				properties: {
					_id: { type: "string" },
					label: { type: "string" },
				},
				additionalProperties: false,
				required: [ "_id", "label" ],
			},
			searchIndex: [
				"label",
			],
		};

		this.jsonDb = new JsonDb(path.join(directory, "reason-request"));
	}

	async initialize() {
		try {
			await this.jsonDb.loadCollection();
		} catch (error) {
			if (error.code !== "ENOENT") {
				throw error;
			}
			await this.jsonDb.create(this.structureJsonDb);
		}
	}

	search({ query, search }) {
		return this.jsonDb.collection.search({ query, search });
	}

	get(_id) {
		return this.jsonDb.collection.getById(_id);
	}

	async insert(label) {
		const { document: reasonRequest } = await this.jsonDb.insert({ label });
		this.emit("insert", reasonRequest);
		return reasonRequest;
	}

	async update(_id, label) {
		const { document: reasonRequest } = await this.jsonDb.update({ _id, label });
		this.emit("update", reasonRequest);
		return reasonRequest;
	}

	async delete(_id) {
		await this.jsonDb.delete(_id);
		this.emit("delete", _id);
	}
}

module.exports = { ReasonRequestStore };
