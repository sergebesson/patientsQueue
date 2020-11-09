"use strict";

const path = require("path");
const { JsonDb } = require("@sbesson/json-db");

const { PatientQueue } = require("./patients-queue/patient-queue");
const { patientQueueJsonSchema } = require("./patients-queue/patient-queue.json-schema");

class PatientsQueueStore {
	constructor({ configLoader, logger }) {
		const directory = configLoader.getValue("storage.databaseDirectory");
		this.config = configLoader.getValue("patientsQueue");
		this.logger = logger;
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

	async initialize({ stores: { reasonRequestStore } }) {
		try {
			await this.jsonDb.loadCollection();
		} catch (error) {
			if (error.code !== "ENOENT") {
				throw error;
			}
			await this.jsonDb.create(this.structureJsonDb);
		}

		reasonRequestStore.on(
			"update", (reasonRequest) => this.updateAllReasonRequest(reasonRequest),
		);
		this.reasonRequestStore = reasonRequestStore;
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
		this.updateReasonRequestLabel(patientQueue);
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
		this.updateReasonRequestLabel(patientQueueUpdate);
		return await patientQueue.update(patientQueueUpdate);
	}

	updateReasonRequestLabel(patientQueue) {
		if (patientQueue.medicalInformation.reasonRequestId) {
			patientQueue.medicalInformation.reasonRequestLabel =
				this.reasonRequestStore.get(patientQueue.medicalInformation.reasonRequestId).label;
		}
	}

	updateAllReasonRequest(reasonRequest) {
		this.jsonDb.collection.find(
			{ medicalInformation: { reasonRequestId: reasonRequest._id } },
		).forEach(async(patientQueue) => {
			try {
				await this.update({
					id: patientQueue._id,
					patientQueue: {
						medicalInformation: { reasonRequestLabel: reasonRequest.label },
					},
				});
			} catch (error) {
				this.logger.log(
					"error",
					`PatientsQueueStore::updateAllReasonRequest - Impossible de mettre a jour le patient queue '${ patientQueue._id }'`,
					error,
				);
			}
		});

	}
}

module.exports = { PatientsQueueStore };
