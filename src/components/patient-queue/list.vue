<template>
	<infinite-list
		class="patient-queue-list"
		:items="patientsQueueStore.patientsQueue"
		item-key="id"
		:loading-data="patientsQueueStore.loadingList"
		label-empty-list="Aucun patient trouvé"
		@next-page="patientsQueueStore.nextPage()"
		dense
	>
		<template #header>
			<patient-queue-list-item header/>
		</template>

		<template #item="{ item: patientQueue }">
			<patient-queue-list-item
				:patientQueue="patientQueue"
				:isCurrent="currentPatientQueueId === patientQueue.id"
				@click="$emit('click', patientQueue)"
			/>
		</template>
	</infinite-list>
</template>

<script>
import { patientsQueueStore } from "../../stores/patients-queue.store";
import InfiniteList from "../infinite-list";
import PatientQueueListItem from "./list-item";

export default {
	name: "PatientQueueList",
	components: { InfiniteList, PatientQueueListItem },
	events: [ "click" ],
	props: {
		currentPatientQueueId: { type: String },
	},
	data: () => ({
		patientsQueueStore,
	}),
	created: async function () {
		await patientsQueueStore.getPatientsQueue();
	},
};
</script>
