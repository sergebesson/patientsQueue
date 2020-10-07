"use strict";

const express = require("express");

const { PatientsQueueMiddleware } = require("./patients-queue.middleware");

const authorizedRoutes = {
	all: [
		"/?", "/[^/]+",
		"/[^/]+/contacts/?", "/[^/]+/contacts/[^/]+",
		"/[^/]+/remind",
		"/[^/]+/put_processed",
		"/[^/]+/put_abandoned",
	],
};

function routerFactory({ patientsQueueStore }) {
	// eslint-disable-next-line new-cap
	const router = express.Router();
	const patientsQueueMiddleware = new PatientsQueueMiddleware({ patientsQueueStore });

	router.get("/",
		(request, response) => patientsQueueMiddleware
			.sendPatientQueueListWithPagination(request, response),
	);

	router.get("/:id",
		(request, response) => patientsQueueMiddleware.sendPatientQueue(request, response),
	);

	router.post("/",
		(request, response, next) => patientsQueueMiddleware
			.createPatientQueue(request, response, next),
	);

	router.patch("/:id",
		(request, response, next) => patientsQueueMiddleware
			.updatePatientQueue(request, response, next),
	);

	router.get("/:id/contacts", (request, response) => patientsQueueMiddleware
		.sendContacts(request, response));

	router.post("/:id/contacts", (request, response, next) => patientsQueueMiddleware
		.createContact(request, response, next));

	router.post("/:id/remind", (request, response, next) => patientsQueueMiddleware
		.remind(request, response, next));

	router.post("/:id/put_processed", (request, response, next) => patientsQueueMiddleware
		.putProcessed(request, response, next));

	router.post("/:id/put_abandoned", (request, response, next) => patientsQueueMiddleware
		.putAbandoned(request, response, next));

	return router;
}

module.exports = {
	authorizedRoutes,
	routerFactory,
};
