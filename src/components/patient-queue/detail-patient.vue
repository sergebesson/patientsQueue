<template>
	<form class="patient-queue-detail-patient" novalidate @submit.prevent="">
		<md-field>
			<label>Prénom</label>
			<md-input name="first-name" v-model.trim="patient.first_name" />
		</md-field>
		<md-field>
			<label>Nom</label>
			<md-input name="last-name" v-model.trim="patient.last_name" />
		</md-field>

		<date-picker v-model="patient.date_of_birth">
			<template v-slot:default="{inputValue, toggle, open, processUserInput}">
				<md-field>
					<label>
						Date de naissance
						<span class="age">{{ patient.date_of_birth | dateToAge }}</span>
					</label>
					<md-input name="date-of-birth"
						:value="inputValue"
						@input="processUserInput($event)"
						@focus="toggle"
						@click="open"
					/>
				</md-field>
			</template>
		</date-picker>

		<md-field>
			<label>Ecole</label>
			<md-input name="school" v-model.trim="patient.school" />
		</md-field>
		<md-field>
			<label>Classe</label>
			<md-input name="class" v-model.trim="patient.class" />
		</md-field>

		<md-field>
			<label>Téléphone</label>
			<md-input name="phoneNumber" type="tel" v-model.trim="patient.phone_number" />
		</md-field>
		<md-field>
			<label>Email</label>
			<md-input name="email" type="email" v-model.trim="patient.email" />
		</md-field>

	</form>
</template>

<script>
import DatePicker from "../date-picker";
import dateFilters from "../../filters/date";

export default {
	name: "PatientQueueDetailPatient",
	components: { DatePicker },
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
		opacity: .6;
		font-style: italic;
		&::before {
			content: "(";
		}
		&::after {
			content: ")";
		}
	}
}
</style>
