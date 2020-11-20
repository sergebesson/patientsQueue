"use strict";

const _ = require("lodash");
const express = require("express");
const { camelCaseDeep } = require("../../services/change-case.service");

const authorizedRoutes = {
	admin: [ "/?", "/[^/]+" ],
};

function routerFactory({ stores: { reasonRequestStore } }) {
	const router = express.Router(); // eslint-disable-line new-cap

	router.get("/", (request, response) => {
		response.status(200).json(
			camelCaseDeep(
				_.sortBy(reasonRequestStore.search({}), ({ label }) => label.toUpperCase()),
			),
		);
	});

	router.get("/:id", (request, response) => {
		const reasonRequest = reasonRequestStore.get(request.params.id);
		if (!reasonRequest) {
			return response.status(404).json({
				status: 404,
				error_description: "Not Found",
			});
		}
		response.status(200).json(camelCaseDeep(reasonRequest));
	});

	router.post("/", (request, response, next) => reasonRequestStore.insert(request.body.label)
		.then((reasonRequest) => response.status(201).json(camelCaseDeep(reasonRequest)))
		.catch(next),
	);

	router.patch("/:id", (request, response, next) => reasonRequestStore.update(
		request.params.id, request.body.label,
	)
		.then((reasonRequest) => response.status(200).json(camelCaseDeep(reasonRequest)))
		.catch((error) => error.message === "notExist" ?
			response.status(404).json({
				status: 404,
				error_description: "Not Found",
			}) :
			next(error),
		),
	);

	router.delete("/:id", (request, response, next) => reasonRequestStore.delete(request.params.id)
		.then(() => response.sendStatus(204))
		.catch((error) => error.message === "notExist" ?
			response.status(404).json({
				status: 404,
				error_description: "Not Found",
			}) :
			next(error),
		),
	);

	return router;
}

module.exports = {
	authorizedRoutes,
	routerFactory,
};
