<template>
	<div class="patients-queue">
		<loader v-if="!meStore.name" />
		<md-app md-waterfall md-mode="fixed" v-else class="md-elevation-10">
			<md-app-toolbar class="md-primary md-dense">
				<md-button class="md-icon-button" @click="showMenu = true">
					<md-icon>menu</md-icon>
				</md-button>
				<span class="md-title">
					List d'attente patients
				</span>
				<div class="md-toolbar-section-end">
					<patient-queue-profile />
				</div>
			</md-app-toolbar>
			<md-app-drawer :md-active.sync="showMenu" md-swipeable>
				<patient-queue-menu @click="showMenu = false"/>
			</md-app-drawer>
			<md-app-content>
				<router-view />
			</md-app-content>
		</md-app>

		<error />
	</div>
</template>

<script>
import { meStore } from "./stores/me.store";
import Loader from "./components/loader";
import Error from "./components/error";
import PatientQueueProfile from "./components/patient-queue/profile";
import PatientQueueMenu from "./components/patient-queue/menu.vue";

export default {
	name: "PatientsQueue",
	components: { Loader, Error, PatientQueueProfile, PatientQueueMenu },
	data: () => ({
		showMenu: false,
		meStore,
	}),
	created: async function () {
		await meStore.loadMe();
	},
};
</script>

<style lang="scss">

$md-theme-default-primary: #448aff;
$md-theme-default-accent: #ff5252;

* {
	scrollbar-width: thin;
}

html, body {
	height: 100%;
	overflow: hidden;
}

.infinite-list {
	$border-color: gainsboro;
	$header-color: rgba($md-theme-default-primary, 10%);

	border: 1px solid $border-color;
	border-radius: 20px 20px 0 0;
	overflow: hidden;

	.md-divider {
		background-color: $border-color;
	}

	&-header {
		background-color: $header-color;
	}

	&-item:nth-child(2n) {
		background-color: $header-color;
	}

	.warning {
		background-color: rgba($md-theme-default-accent, 10%);
	}
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
