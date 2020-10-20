<template>
	<div class="patients-queue">
		<loader v-if="!meStore.name" />
		<error />

		<md-app md-waterfall md-mode="fixed" v-show="meStore.name" class="md-elevation-10">
			<md-app-toolbar class="md-primary md-dense">
				<span class="md-title">List d'attente patients</span>
				<div class="md-toolbar-section-end">
					<profile-menu v-if="meStore.name" :name="meStore.name">
						<md-divider />
						<md-menu-item href="/api" target="_blank">
							<md-icon>api</md-icon>
							<span>api</span>
						</md-menu-item>
					</profile-menu>
				</div>
			</md-app-toolbar>
			<md-app-content>
				<patient-queue-list />
			</md-app-content>
		</md-app>
	</div>
</template>

<script>
import { meStore } from "./stores/me.store";
import Loader from "./components/loader";
import Error from "./components/error";
import ProfileMenu from "./components/profile-menu";
import PatientQueueList from "./components/patient-queue-list";

export default {
	name: "PatientsQueue",
	components: { Loader, Error, ProfileMenu, PatientQueueList },
	data: () => ({
		meStore,
	}),
	created: async function () {
		await meStore.loadMe();
	},
};
</script>

<style>
* {
	scrollbar-width: thin;
}

html, body, .patients-queue {
	height: 100%;
	overflow: hidden;
}

.patients-queue .md-app {
	margin: 10px;
	height: calc(100% - 20px);
}

.patients-queue .md-app-content {
	height: 100%;
	display: flex;
	flex-direction: column;
}
</style>
