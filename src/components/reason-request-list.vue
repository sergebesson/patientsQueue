<template>
	<infinite-list
		class="reason-request-list"
		:items="store.reasonsRequest"
		item-key="id"
		:loading-data="store.loading"
		label-empty-list="Aucun motif trouvé"
		:with-items-divider="false"
		dense
	>
		<template #header>
			<div>motif de la demande</div>
		</template>
		<template #item="{ item: reasonRequest }">
			<div>{{ reasonRequest.label }}</div>
		</template>
	</infinite-list>
</template>

<script>
import { reasonsRequestStore } from "../stores/reasons-request.store";
import InfiniteList from "./infinite-list.vue";

export default {
	name: "ReasonRequestList",
	components: { InfiniteList },
	data: () => ({
		store: reasonsRequestStore,
	}),
	created: async function () {
		await reasonsRequestStore.getReasonsRequest();
	},
};
</script>
