<template>
	<div class="patients-queue">
		<loader v-if="!meStore.name" />
		<md-app md-waterfall md-mode="fixed" v-else class="md-elevation-10">
			<md-app-toolbar class="md-primary md-dense">
				<span class="md-title">List d'attente patients</span>
				<div class="md-toolbar-section-end">
					<patient-queue-profile />
				</div>
			</md-app-toolbar>
			<md-app-content>
				<patient-queue-list />
			</md-app-content>
		</md-app>

		<error />
	</div>
</template>

<script>
import { meStore } from "./stores/me.store";
import Loader from "./components/loader";
import Error from "./components/error";
import PatientQueueList from "./components/patient-queue-list";
import PatientQueueProfile from "./components/patient-queue-profile";

export default {
	name: "PatientsQueue",
	components: { Loader, Error, PatientQueueList, PatientQueueProfile },
	data: () => ({
		meStore,
	}),
	created: async function () {
		await meStore.loadMe();
	},
};
</script>

<style lang="scss">

* {
	scrollbar-width: thin;
}

html, body {
	height: 100%;
	overflow: hidden;
}

.patients-queue {
	@extend html;

	.md-app {
		$margin: 10px;
		margin: $margin;
		height: calc(100% - #{$margin * 2});
	}

	.md-app-content {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
}

</style>
