<template>
	<div class="patient-queue-search">
		<md-field md-inline md-clearable>
			<label>Rechercher...</label>
			<md-input v-model.trim="search" :disabled="store.updatingList"></md-input>
		</md-field>
		<spinner-k2000 :animate="searchInProgress || store.updatingList" />
	</div>
</template>

<script>
import _ from "lodash";
import SpinnerK2000 from "../spinner-k2000";
import { patientsQueueStore } from "../../stores/patients-queue.store";

export default {
	name: "PatientQueueSearch",
	components: { SpinnerK2000 },
	data: () => ({
		store: patientsQueueStore,
		search: "",
		searchInProgress: false,
	}),
	watch: {
		search: _.debounce(function () {
			/* eslint-disable no-invalid-this */
			if (this.search === this.store.search) {
				return;
			}
			this.searchInProgress = true;
			this.store.search = this.search;
			/* eslint-enable no-invalid-this */
		}, 1000),
		"store.loadingList": function (loading) {
			this.searchInProgress = this.searchInProgress && loading;
		},
	},
	created: function () {
		this.search = this.store.search;
	},
};
</script>

<style lang="scss">

.patient-queue-search {
	margin-top: -16px;

	.md-field {
		margin: 0 0 0 16px;
		width: calc(100% - 16px);
	}

	.spinner-k2000 {
		$offset: 5px;
		background-color: white !important;
		margin: -$offset 0 $offset 0;
	}
}

</style>
