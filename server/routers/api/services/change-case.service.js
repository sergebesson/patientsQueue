"use strict";

const _ = require("lodash");
const { camelCase, snakeCase } = require("change-case");

function changeCaseDeep(changeFunction, value) {
	if (_.isPlainObject(value)) {
		return _.chain(value)
			.mapKeys((valueOfObject, key) => changeFunction(key))
			.mapValues((valueOfObject) => changeCaseDeep(changeFunction, valueOfObject))
			.value();
	}

	if (Array.isArray(value)) {
		return value.map((valueOfArray) => changeCaseDeep(changeFunction, valueOfArray));
	}

	return value;
}

function camelCaseDeep(value) {
	return changeCaseDeep(camelCase, value);
}

function snakeCaseDeep(value) {
	return changeCaseDeep(snakeCase, value);
}

module.exports = {
	camelCaseDeep,
	snakeCaseDeep,
};
