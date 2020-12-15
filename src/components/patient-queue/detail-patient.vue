<template>
	<form class="patient-queue-detail-patient" novalidate @submit.prevent="">
		<div class="md-layout md-gutter">
			<div class="md-layout-item">
				<md-field>
					<label>Prénom</label>
					<md-input name="first-name" v-model.trim="patient.first_name" />
				</md-field>
			</div>
			<div class="md-layout-item">
				<md-field>
					<label>Nom</label>
					<md-input name="last-name" v-model.trim="patient.last_name" />
				</md-field>
			</div>
		</div>

		<div class="md-layout md-gutter">
			<div class="md-layout-item">
				<md-field>
					<label>Date de naissance</label>
					<v-date-picker />
				</md-field>
			</div>
		</div>
	</form>
</template>

<script>
export default {
	name: "PatientQueueDetailPatient",
	props: {
		patientQueue: { type: Object, required: true },
	},
	data: function () {
		return {
			patient: this.patientQueue.patient,
		};
	},
};
</script>

<style lang="scss">

</style>
