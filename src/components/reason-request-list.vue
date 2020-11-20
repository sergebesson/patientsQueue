<template>
	<div class="reason-request-list">
		<infinite-list
			:items="store.reasonsRequest"
			item-key="id"
			:loading-data="false"
			label-empty-list="Aucun motif trouvé"
			dense
		>
			<template #header>
				<div>motif de la demande</div>
			</template>
			<template #before-items>
				<spinner-k2000 class="spinner-update" v-show="showSpinner"/>
			</template>
			<template #first-item>
				<md-field md-inline>
					<label>Veuillez saisir un motif</label>
					<md-input v-model="newReasonRequestLabel" @keyup.enter="create()"/>
				</md-field>
				<md-button class="md-icon-button"
					:disabled="newReasonRequestLabel === ''"
					@click="create()"
				>
					<md-icon>add</md-icon>
				</md-button>
			</template>
			<template #item="{ item: reasonRequest }">
				<md-field md-inline>
					<label>Veuillez saisir un motif</label>
					<md-input v-model="reasonRequest.label" @change="update(reasonRequest)" />
				</md-field>
				<md-button class="md-icon-button" @click="reasonRequestToDelete = reasonRequest">
					<md-icon>delete_outline</md-icon>
				</md-button>
			</template>
		</infinite-list>
		<md-dialog-confirm
			:md-active.sync="deletionConfirmation"
			md-title="Confirmer la suppression"
			:md-content="confirmMessage"
			md-confirm-text="Oui"
			md-cancel-text="Non"
			@md-confirm="remove"
		/>
	</div>
</template>

<script>
import { reasonsRequestStore } from "../stores/reasons-request.store";
import InfiniteList from "./infinite-list.vue";
import SpinnerK2000 from "./spinner-k2000";

export default {
	name: "ReasonRequestList",
	components: { InfiniteList, SpinnerK2000 },
	data: () => ({
		store: reasonsRequestStore,
		reasonRequestToDelete: null,
		newReasonRequestLabel: "",
	}),
	computed: {
		deletionConfirmation: {
			get: (vm) => vm.reasonRequestToDelete !== null,
			set: function (value) {
				// eslint-disable-next-line no-invalid-this
				this.reasonRequestToDelete = value ? this.reasonRequestToDelete : null;
			},
		},
		confirmMessage: (vm) => {
			if (vm.reasonRequestToDelete) {
				return `Êtes vous sur de vouloir supprimer le motif <strong>${ vm.reasonRequestToDelete.label }</strong> ?`;
			}
		},
		showSpinner: (vm) => vm.store.loading ||
			vm.store.updating ||
			vm.store.deleting ||
			vm.store.creating,
	},
	created: async function () {
		await reasonsRequestStore.getReasonsRequest();
	},
	methods: {
		update: async function (reasonRequest) {
			await this.store.update(reasonRequest);
		},
		remove: async function () {
			await this.store.delete(this.reasonRequestToDelete.id);
		},
		create: async function () {
			await this.store.add(this.newReasonRequestLabel);
			this.newReasonRequestLabel = "";
		},
	},
};
</script>

<style lang="scss">
.reason-request-list {
	height: 100%;

	.spinner-update {
		top: -3px;
	}

	.md-field {
		margin: 0;
		padding: 0;
		min-height: 32px;

		&::after {
			content: none;
		}

		.md-input-action {
			top: 0;
		}

		label {
			top: 7px !important;
		}
	}
}
</style>
