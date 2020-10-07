"use strict";

const path = require("path");
const { JsonDb } = require("@sbesson/json-db");

const { PatientQueue } = require("./patients-queue/patient-queue");
const { patientQueueJsonSchema } = require("./patients-queue/patient-queue.json-schema");

class PatientsQueueStore {
	constructor({ configLoader }) {
		const directory = configLoader.getValue("storage.databaseDirectory");
		this.config = configLoader.getValue("patientsQueue");
		this.structureJsonDb = {
			jsonSchema: patientQueueJsonSchema,
			searchIndex: [
				"patient.name", "patient.firstName", "patient.school", "medicalInformation.doctor",
			],
		};

		this.jsonDb = new JsonDb(path.join(directory, "patients-queue"));

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
		}
	}

	search({ query, search }) {
		return this.jsonDb.collection.search({ query, search });
	}

	get(id) {
		return PatientQueue.createById({
			jsonDb: this.jsonDb, id, recallDuration: this.config.recallDuration,
		});
	}

	async insert({ patientQueue }) {
		return await PatientQueue.createNew({
			jsonDb: this.jsonDb, recallDuration: this.config.recallDuration, patientQueue,
		});
	}

	async update({ id, patientQueue: patientQueueUpdate }) {
		const patientQueue = PatientQueue.createById(
			{ jsonDb: this.jsonDb, id, recallDuration: this.config.recallDuration },
		);
		if (!patientQueue) {
			throw new Error("patientNotfound");
		}
		return await patientQueue.update(patientQueueUpdate);
	}
}

module.exports = { PatientsQueueStore };
