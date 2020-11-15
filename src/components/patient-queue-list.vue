<template>
	<infinite-list
		class="patient-queue-list"
		:items="patientsQueueStore.patientsQueue"
		item-key="id"
		:loading-data="patientsQueueStore.loading"
		label-empty-list="Aucun patient trouvé"
		@next-page="patientsQueueStore.nextPage()"
		:with-header-divider="true"
		:with-items-divider="false"
		dense
		line-style="simple"
	>
		<template #header>
			<div>
				<div>prochain contact</div>
				<div>nom</div>
				<div>age</div>
				<div>class</div>
				<div>raison</div>
				<!-- <div>information</div> -->
			</div>
		</template>
		<template #item="{ item: patientQueue }">
			<div @click="onClick(patientQueue)">
				<div>{{ patientQueue.dates.reminder }}</div>
				<div>
					{{ patientQueue.patient.first_name }} {{ patientQueue.patient.name }}
				</div>
				<div>{{ patientQueue.patient.date_of_birth }}</div>
				<div>{{ patientQueue.patient.class }}</div>
				<div>{{ patientQueue.medical_information.reason_request_label }}</div>
			</div>
		</template>
	</infinite-list>
</template>

<script>
import { patientsQueueStore } from "../stores/patients-queue.store";
import InfiniteList from "./infinite-list";

export default {
	name: "PatientQueueList",
	components: { InfiniteList },
	data: () => ({
		patientsQueueStore,
	}),
	created: async function () {
		await patientsQueueStore.getPatientsQueue();
	},
	methods: {
		onClick: function (patientQueue) {
			console.log(patientQueue);
		},
	},
};
</script>

<style lang="scss">

.patient-queue-list {
	border: 1px solid gainsboro;
	border-radius: 20px 20px 0 0;
	overflow: hidden;

	.md-divider {
		background-color: gainsboro;
	}

	.infinite-list-header {
		background-color: ghostwhite;
	}

	.infinite-list-items {
		background-color: white;
	}

	.infinite-list-item:nth-child(2n) {
		background-color: ghostwhite;
	}
}

</style>
