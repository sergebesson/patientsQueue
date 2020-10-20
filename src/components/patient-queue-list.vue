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
			<div>prochain contact attendu</div>
			<div>nom</div>
			<!--div> class </div-->
			<!--div> reasonRequestId </div-->
			<div>information</div>
		</template>
		<template #item="{ item: patientQueue }">
			<div>{{ patientQueue.dates.reminder }}</div>
			<div>
				{{ patientQueue.patient.first_name }} {{ patientQueue.patient.name }}
			</div>
			<div>{{ patientQueue.additional_information }}</div>
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
};
</script>

<style>
.patient-queue-list {
	border: 1px solid gainsboro;
	border-radius: 20px 20px 0 0;
	overflow: hidden;
}

.patient-queue-list .md-divider {
	background-color: gainsboro;
}

.patient-queue-list .infinite-list-header {
	background-color: ghostwhite;
}

.patient-queue-list .infinite-list-items {
	background-color: white;
}

.patient-queues-list .infinite-list-item:nth-child(2n) {
	background-color: ghostwhite;
}
</style>
