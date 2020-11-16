<template>
	<div class="patient-queue-menu" v-on="$listeners">
		<md-toolbar class="md-transparent" md-elevation="0">
			<span class="md-title">Menu</span>
		</md-toolbar>
		<md-list>
			<md-list-item :to="{ name: 'patient-queue' }">
				Liste des patients en file d'attente
			</md-list-item>
			<md-list-item :to="{ name: 'reason-request' }">
				gestion des raisons de la demande
			</md-list-item>
		</md-list>
	</div>
</template>

<script>
export default {
	name: "PatientQueueMenu",
};
</script>

<style lang="scss">

.patient-queue-menu {
	height: 100%;
}

</style>
