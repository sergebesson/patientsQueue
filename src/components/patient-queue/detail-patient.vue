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
				<v-date-picker v-model="patient.date_of_birth" ref="calendar"
					:model-config="{ type: 'string', mask: 'YYYY-MM-DD' }"
					:masks="{ input: 'D MMM YYYY' }"
				>
					<template v-slot="{ inputValue, togglePopover }">
						<md-field>
							<label>Date de naissance</label>
							<md-input readonly name="date-of-birth"
								:value="inputValue"
								@focus="togglePopover({placement: 'auto-start'})"
							/>
						</md-field>
					</template>
				</v-date-picker>
			</div>
			<div class="md-layout-item age">
				<span>{{ patient.date_of_birth | dateToAge }}</span>
			</div>
		</div>

		<div class="md-layout md-gutter">
			<div class="md-layout-item">
				<md-field>
					<label>Ecole</label>
					<md-input name="school" v-model.trim="patient.school" />
				</md-field>
			</div>
			<div class="md-layout-item">
				<md-field>
					<label>Classe</label>
					<md-input name="class" v-model.trim="patient.class" />
				</md-field>
			</div>
		</div>

		<div class="md-layout md-gutter">
			<div class="md-layout-item">
				<md-field>
					<label>Téléphone</label>
					<md-input name="phoneNumber" type="tel" v-model.trim="patient.phone_number" />
				</md-field>
			</div>
			<div class="md-layout-item">
				<md-field>
					<label>Email</label>
					<md-input name="email" type="email" v-model.trim="patient.email" />
				</md-field>
			</div>
		</div>

	</form>
</template>

<script>
import VDatePicker from "v-calendar/lib/components/date-picker.umd";
import dateFilters from "../../filters/date";

export default {
	name: "PatientQueueDetailPatient",
	components: { VDatePicker },
	filters: dateFilters,
	props: {
		patientQueue: { type: Object, required: true },
	},
	computed: {
		patient: (vm) => vm.patientQueue.patient,
	},
};
</script>

<style lang="scss">
.patient-queue-detail-patient {

	.age {
		display: flex;
		flex-direction: column;
		justify-content: center;
		opacity: .6;
	}
}
</style>
