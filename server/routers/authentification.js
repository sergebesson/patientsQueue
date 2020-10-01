"use strict";

const express = require("express");
const expressBasicAuth = require("express-basic-auth");

async function authentificationRouterFactory({ usersStore }) {
	// eslint-disable-next-line new-cap
	const router = express.Router();

	router.use(expressBasicAuth({
		authorizer: (login, password) => usersStore.checkAuthentification({ login, password }),
		challenge: true,
	}));
	router.use((request, response, next) => {
		usersStore.loginUser = request.auth.user;
		next();
	});

	return router;
}

module.exports = { authentificationRouterFactory };
