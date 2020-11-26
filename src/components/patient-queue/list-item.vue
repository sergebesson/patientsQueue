<template>
	<div class="patient-queue-list-item">
		<md-subheader v-if="header" class="md-primary">
			<div class="infinite-list-cell selectIcon"></div>
			<div class="infinite-list-cell date">Créé le</div>
			<div class="infinite-list-cell date">prochain<br />contact</div>
			<div class="infinite-list-cell">nom</div>
			<div class="infinite-list-cell">email</div>
			<div class="infinite-list-cell date">age</div>
			<div class="infinite-list-cell class">classe</div>
			<div class="infinite-list-cell reason-request">motif</div>
		</md-subheader>
		<md-list-item v-else
			v-on="$listeners"
			:class="{ warning: patientQueue.isLate, current: isCurrent}"
			:disabled="isCurrent"
		>
			<div class="infinite-list-cell selectIcon"></div>
			<div class="infinite-list-cell date">
				{{ patientQueue.dates.creation | dateTimeToDate }}
			</div>
			<div class="infinite-list-cell date">
				{{ patientQueue.dates.reminder | dateToDuration }}
				<md-tooltip>{{ patientQueue.dates.reminder | dateToDate }}</md-tooltip>
			</div>
			<div class="infinite-list-cell">{{ patientQueue.patient.fullName }}</div>
			<div class="infinite-list-cell">{{ patientQueue.patient.email }}</div>
			<div class="infinite-list-cell date">
				{{ patientQueue.patient.date_of_birth | dateToAge }}
				<md-tooltip>{{ patientQueue.patient.date_of_birth | dateToDate }}</md-tooltip>
			</div>
			<div class="infinite-list-cell class">{{ patientQueue.patient.class }}</div>
			<div class="infinite-list-cell reason-request">
				{{ patientQueue.medical_information.reason_request_label }}
			</div>
		</md-list-item>
	</div>
</template>

<script>
import dateFilters from "../../filters/date";

export default {
	name: "PatientQueueListItem",
	props: {
		header: { type: Boolean, default: false },
		patientQueue: { type: Object },
		isCurrent: { type: Boolean, default: false },
	},
	filters: dateFilters,
};
</script>

<style lang="scss">
.patient-queue-list-item {
	.date {
		max-width: 80px;
	}

	.class {
		max-width: 80px;
	}

	.reason-request {
		max-width: 80px;
	}

	.selectIcon {
		$size: 8px;
		max-width: $size;
		min-width: $size;
		height: $size;
		border: 1px solid rgba(0,0,0,0.25);
		border-radius: 50%;
	}

	.md-subheader .selectIcon {
		border: none;
	}

	.current {
		.selectIcon {
			background-color: rgba(0,0,0,0.50);
		}

		button[disabled] {
			color:rgba(0,0,0,0.87);
			font-weight: bolder;
		}
	}
}
</style>
