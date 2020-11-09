"use strict";

const _ = require("lodash");
const { camelCaseDeep, snakeCaseDeep } = require("../../services/change-case.service");

class PatientsQueueMiddleware {
	constructor({ patientsQueueStore }) {
		this.patientsQueueStore = patientsQueueStore;
	}

	sendPatientQueueListWithPagination(request, response) {
		const search = request.query.search;
		const pageSize = request.query.page_size;
		const page = request.query.page;
		const states = request.query.state;

		const query = (patientQueue) => {
			const stateEqual = states
				.filter((state) => state !== "reminder-reached")
				.includes(patientQueue.state.type);

			const stateReminderReached =
				states.includes("reminder-reached") &&
				patientQueue.state.type === "in-queue" &&
				new Date(patientQueue.dates.reminder).getTime() < Date.now();

			return stateEqual || stateReminderReached;
		};
		const patientsQueue = _.orderBy(
			this.patientsQueueStore.search({ query, search }),
			[ "dates.reminder", "dates.creation" ], [ "asc", "asc" ],
		)
			.map((patientQueue) => PatientsQueueMiddleware._patientQueueJsonForApi(patientQueue));
		const begin = pageSize * (page - 1);
		const end = begin + pageSize;

		response.status(200).json({
			page: page,
			page_size: pageSize,
			total_pages: Math.ceil(patientsQueue.length / pageSize),
			total_patients_queue: patientsQueue.length,
			patients_queue: _.slice(patientsQueue, begin, end),
		});
	}

	sendPatientQueue(request, response) {
		const patientQueue = this.patientsQueueStore.get(request.params.id);
		if (!patientQueue) {
			return response.status(404).json({
				status: 404,
				error_description: "Not Found",
			});
		}
		response.status(200).json(
			PatientsQueueMiddleware._patientQueueJsonForApi(patientQueue.json),
		);
	}

	async createPatientQueue(request, response, next) {
		try {
			const patientQueue = await this.patientsQueueStore.insert({
				patientQueue: PatientsQueueMiddleware._getPatientQueueFromBody(request.body),
			});
			response.status(201).json(
				PatientsQueueMiddleware._patientQueueJsonForApi(patientQueue.json),
			);
		} catch (error) {
			return next(error);
		}
	}

	async updatePatientQueue(request, response, next) {
		try {
			const patientQueue = await this.patientsQueueStore.update({
				id: request.params.id,
				patientQueue: PatientsQueueMiddleware._getPatientQueueFromBody(request.body),
			});
			response.status(200).json(
				PatientsQueueMiddleware._patientQueueJsonForApi(patientQueue.json),
			);
		} catch (error) {
			return error.message === "patientNotfound" ?
				response.status(404).json({
					status: 404,
					error_description: "Not Found",
				}) :
				next(error);
		}
	}

	sendContacts(request, response) {
		const patientQueue = this.patientsQueueStore.get(request.params.id);
		if (!patientQueue) {
			return response.status(404).json({
				status: 404,
				error_description: "Not Found",
			});
		}
		response.status(200).json(patientQueue.contacts.map((contact) => camelCaseDeep(contact)));
	}

	async createContact(request, response, next) {
		const patientQueue = this.patientsQueueStore.get(request.params.id);
		if (!patientQueue) {
			return response.status(404).json({
				status: 404,
				error_description: "Not Found",
			});
		}

		try {
			const contact = await patientQueue.addContact({
				type: request.body.type,
				date: request.body.date,
				information: request.body.information,
			});
			response.status(201).json(camelCaseDeep(contact));
		} catch (error) {
			if (error.message === "STATE_NOT_IN-QUEUE") {
				return response.status(401).json({
					status: 401,
					error_description: "Unauthorized",
					errors: [ {
						codeError: "stateNotInQueue",
						messageError: "patient not in state IN-QUEUE",
					} ],
				});
			}
			return next(error);
		}
	}

	async remind(request, response, next) {
		const patientQueue = this.patientsQueueStore.get(request.params.id);
		if (!patientQueue) {
			return response.status(404).json({
				status: 404,
				error_description: "Not Found",
			});
		}

		try {
			response.status(200).json(
				PatientsQueueMiddleware._patientQueueJsonForApi((await patientQueue.remind()).json),
			);
		} catch (error) {
			if (error.message === "STATE_NOT_IN-QUEUE") {
				return response.status(401).json({
					status: 401,
					error_description: "Unauthorized",
					errors: [ {
						codeError: "stateNotInQueue",
						messageError: "patient not in state IN-QUEUE",
					} ],
				});
			}
			return next(error);
		}
	}

	async putProcessed(request, response, next) {
		const patientQueue = this.patientsQueueStore.get(request.params.id);
		if (!patientQueue) {
			return response.status(404).json({
				status: 404,
				error_description: "Not Found",
			});
		}

		try {
			response.status(200).json(
				PatientsQueueMiddleware._patientQueueJsonForApi(
					(await patientQueue.putProcessed(request.body.description)).json,
				),
			);
		} catch (error) {
			if (error.message === "STATE_NOT_IN-QUEUE") {
				return response.status(401).json({
					status: 401,
					error_description: "Unauthorized",
					errors: [ {
						codeError: "stateNotInQueue",
						messageError: "patient not in state IN-QUEUE",
					} ],
				});
			}
			return next(error);
		}
	}

	async putAbandoned(request, response, next) {
		const patientQueue = this.patientsQueueStore.get(request.params.id);
		if (!patientQueue) {
			return response.status(404).json({
				status: 404,
				error_description: "Not Found",
			});
		}

		try {
			response.status(200).json(
				PatientsQueueMiddleware._patientQueueJsonForApi(
					(await patientQueue.putAbandoned(request.body.description)).json,
				),
			);
		} catch (error) {
			if (error.message === "STATE_NOT_IN-QUEUE") {
				return response.status(401).json({
					status: 401,
					error_description: "Unauthorized",
					errors: [ {
						codeError: "stateNotInQueue",
						messageError: "patient not in state IN-QUEUE",
					} ],
				});
			}
			return next(error);
		}
	}

	static _patientQueueJsonForApi(patientQueue) {
		return snakeCaseDeep(_.omit(patientQueue, [ "contacts" ]));
	}

	static _getPatientQueueFromBody(body) {
		return {
			patient: camelCaseDeep(body.patient),
			medicalInformation: camelCaseDeep(body.medical_information),
			availability: body.availability,
			visibleBy: camelCaseDeep(body.visible_by),
			additionalInformation: body.additional_information,
		};
	}
}

module.exports = {
	PatientsQueueMiddleware,
};
