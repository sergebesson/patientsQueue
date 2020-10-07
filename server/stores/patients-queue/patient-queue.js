"use strict";

const _ = require("lodash");
const moment = require("moment");
const uniqid = require("uniqid");

class PatientQueue {
	static async createNew({ jsonDb, recallDuration, patientQueue: {
		patient,
		medicalInformation = {},
		availability = "",
		visibleBy = "ALL",
		additionalInformation = "",
	} }) {
		const dates = {
			creation: new Date().toISOString(),
			reminder: PatientQueue.generateReminderDate(recallDuration),
		};
		const { document: patientQueue } = await jsonDb.insert({
			dates, patient, medicalInformation, availability, visibleBy, additionalInformation,
			contacts: [], state: { type: "in-queue" },
		});

		return new PatientQueue({ jsonDb, patientQueue });
	}

	static createById({ jsonDb, id, recallDuration }) {
		const patientQueue = jsonDb.collection.getById(id);
		if (patientQueue) {
			return new PatientQueue({ jsonDb, patientQueue, recallDuration });
		}
	}

	static generateReminderDate(recallDuration) {
		return moment().add(recallDuration).toISOString(true).split("T")[0];
	}

	constructor({ jsonDb, patientQueue, recallDuration }) {
		this.jsonDb = jsonDb;
		this.patientQueue = patientQueue;
		this._recallDuration = recallDuration;
	}

	get recallDuration() {
		return this._recallDuration;
	}
	set recallDuration(recallDuration) {
		this._recallDuration = recallDuration;
	}

	get patient() {
		return this.patientQueue.patient;
	}
	set patient(patient) {
		this.patientQueue.patient = patient;
	}

	get medicalInformation() {
		return this.patientQueue.medicalInformation;
	}
	set medicalInformation(medicalInformation) {
		this.patientQueue.medicalInformation = medicalInformation;
	}

	get availability() {
		return this.patientQueue.availability;
	}
	set availability(availability) {
		this.patientQueue.availability = availability;
	}

	get visibleBy() {
		return this.patientQueue.visibleBy;
	}
	set visibleBy(visibleBy) {
		this.patientQueue.visibleBy = visibleBy;
	}

	get additionalInformation() {
		return this.patientQueue.additionalInformation;
	}
	set additionalInformation(additionalInformation) {
		this.patientQueue.additionalInformation = additionalInformation;
	}

	get dates() {
		return this.patientQueue.dates;
	}

	get contacts() {
		return this.patientQueue.contacts;
	}

	get state() {
		return this.patientQueue.state;
	}

	get json() {
		return this.patientQueue;
	}

	async update({
		patient,
		medicalInformation,
		availability,
		visibleBy,
		additionalInformation,
	}) {
		this.patientQueue = _.merge(
			this.patientQueue,
			_.omitBy({
				patient,
				medicalInformation,
				availability,
				visibleBy,
				additionalInformation,
			}, _.isUndefined),
		);
		await this.jsonDb.update(this.patientQueue);
		return this;
	}

	async remind() {
		if (this.patientQueue.state.type !== "in-queue") {
			throw new Error("STATE_NOT_IN-QUEUE");
		}
		this.patientQueue.dates.reminder = PatientQueue.generateReminderDate(this._recallDuration);
		await this.jsonDb.update(this.patientQueue);
		return this;
	}

	async addContact(contact) {
		if (this.patientQueue.state.type !== "in-queue") {
			throw new Error("STATE_NOT_IN-QUEUE");
		}
		contact._id = uniqid.process();
		this.patientQueue.contacts.unshift(contact);
		this.patientQueue.dates.reminder = PatientQueue.generateReminderDate(this._recallDuration);
		await this.jsonDb.update(this.patientQueue);
		return contact;
	}

	async putProcessed(description) {
		if (this.patientQueue.state.type !== "in-queue") {
			throw new Error("STATE_NOT_IN-QUEUE");
		}
		this.patientQueue.state.type = "processed";
		this.patientQueue.state.description = description;
		await this.jsonDb.update(this.patientQueue);
		return this;
	}

	async putAbandoned(description) {
		if (this.patientQueue.state.type !== "in-queue") {
			throw new Error("STATE_NOT_IN-QUEUE");
		}
		this.patientQueue.state.type = "abandoned";
		this.patientQueue.state.description = description;
		await this.jsonDb.update(this.patientQueue);
		return this;
	}
}

module.exports = { PatientQueue };
