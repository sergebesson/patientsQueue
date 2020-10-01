"use strict";

const _ = require("lodash");
const moment = require("moment");
const uniqid = require("uniqid");

class PatientQueue {
	static async createNew({ jsonDb, patientQueue: {
		patient,
		medicalInformation = {},
		availability = "",
		visibleBy = "ALL",
		additionalInformation = "",
	} }) {
		const dates = {
			creation: new Date().toISOString(),
			recall: PatientQueue.getValue(this.config.recallDuration),
		};
		const { document: patientQueue } = await this.jsonDb.insert({
			dates, patient, medicalInformation, availability, visibleBy, additionalInformation,
			reminders: [], state: { type: "in-queue" },
		});

		return new PatientQueue({ jsonDb, patientQueue });
	}

	static createById({ jsonDb, id }) {
		const patientQueue = jsonDb.collection.getById(id);
		if (patientQueue) {
			return new PatientQueue({ jsonDb, patientQueue });
		}
	}

	static generateReminderDate(recallDuration) {
		return moment().add(recallDuration).toISOString(true).split("T")[0];
	}

	constructor({ jsonDb, patientQueue }) {
		this.jsonDb = jsonDb;
		this.patientQueue = patientQueue;
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
		this.patientQueue = {
			...this.patientQueue,
			..._.omitBy({
				patient,
				medicalInformation,
				availability,
				visibleBy,
				additionalInformation,
			}, _.isUndefined),
		};
		await this.jsonDb.update(this.patientQueue);
		return this;
	}

	async remind() {
		if (this.patientQueue.state.type !== "in-queue") {
			throw new Error("STATE_NOT_IN-QUEUE");
		}
		this.patientQueue.dates.reminder = PatientQueue.generateReminderDate();
		await this.jsonDb.update(this.patientQueue);
		return this;
	}

	async addContact(contact) {
		if (this.patientQueue.state.type !== "in-queue") {
			throw new Error("STATE_NOT_IN-QUEUE");
		}
		contact._id = uniqid.process();
		this.patientQueue.contacts.unshift(contact);
		this.patientQueue.dates.reminder = PatientQueue.generateReminderDate();
		await this.jsonDb.update(this.patientQueue);
		return this;
	}

	async putProcessed(description) {
		if (this.patientQueue.state.type !== "in-queue") {
			throw new Error("STATE_NOT_IN-QUEUE");
		}
		this.patientQueue.state.type = "processed";
		this.patientQueue.description = description;
		await this.jsonDb.update(this.patientQueue);
		return this;
	}

	async putAbandoned(description) {
		if (this.patientQueue.state.type !== "in-queue") {
			throw new Error("STATE_NOT_IN-QUEUE");
		}
		this.patientQueue.state.type = "processed";
		this.patientQueue.description = description;
		await this.jsonDb.update(this.patientQueue);
		return this;
	}
}

module.exports = { PatientQueue };
