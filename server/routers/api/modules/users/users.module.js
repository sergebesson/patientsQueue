"use strict";

const express = require("express");

const { sendUsersListWithPagination } = require("./users.middleware");

const authorizedRoutes = {
	admin: [ "/?", "/[^/]+" ],
	all: [ "/me" ],
};

function routerFactory({ stores: { usersStore } }) {
	// eslint-disable-next-line new-cap
	const router = express.Router();

	router.get("/me", (request, response, next) => {
		const loginUser = usersStore.loginUser;
		if (loginUser === null) {
			return next(new Error("GET /me, loginUser not set"));
		}
		response.status(200).json(loginUser.jsonPublic);
	});

	router.get("/", sendUsersListWithPagination({ usersStore }));

	router.head("/:login", (request, response) => {
		const user = usersStore.getUserByLogin({ login: request.params.login });
		if (user === null) {
			return response.sendStatus(404);
		}
		response.sendStatus(204);
	});

	router.get("/:login", (request, response) => {
		const user = usersStore.getUserByLogin({ login: request.params.login });
		if (user === null) {
			return response.status(404).json({
				status: 404,
				error_description: "Not Found",
			});
		}
		response.status(200).json(user.jsonPrivate);
	});

	router.post("/", (request, response, next) => usersStore.insert({
		login: request.body.login,
		password: request.body.password,
		name: request.body.name,
		active: request.body.active,
		description: request.body.description,
	})
		.then((user) => response.status(201).json(user.jsonPrivate))
		.catch((error) => error.message === "alreadyExists" ?
			response.status(400).json({
				status: 400,
				error_description: "Bad Request",
				errors: [ { errorCode: "alreadyExists", message: "user already exists" } ],
			}) :
			next(error),
		),
	);

	router.patch("/:login", (request, response, next) => usersStore.update({
		login: request.params.login,
		password: request.body.password,
		name: request.body.name,
		active: request.body.active,
		description: request.body.description,
	})
		.then((user) => response.status(200).json(user.jsonPrivate))
		.catch((error) => error.message === "userNotfound" ?
			response.status(404).json({
				status: 404,
				error_description: "Not Found",
			}) :
			next(error),
		),
	);

	router.delete("/:login", (request, response, next) => usersStore.delete({
		login: request.params.login,
	})
		.then(() => response.sendStatus(204))
		.catch((error) => {
			if (error.message === "userNotfound") {
				return response.status(404).json({
					status: 404,
					error_description: "Not Found",
				});
			}
			if (error.message === "unauthorized") {
				return response.status(401).json({
					status: 401,
					error_description: "Unauthorized",
				});
			}

			next(error);
		}),
	);

	return router;
}

module.exports = {
	authorizedRoutes,
	routerFactory,
};
