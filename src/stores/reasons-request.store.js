import axios from "axios";
import { eventBus, eventName } from "../eventBus";

// eslint-disable-next-line no-unused-vars
const reasonsRequestStore = {
	configuration: {
		apiUrl: "api/reason-request",
	},
	state: {
		reasonsRequest: [],
		loading: false,
		updating: false,
		deleting: false,
		creating: false,
	},
	get reasonsRequest() {
		return this.state.reasonsRequest;
	},
	get loading() {
		return this.state.loading;
	},
	get updating() {
		return this.state.updating;
	},
	get deleting() {
		return this.state.deleting;
	},
	get creating() {
		return this.state.creating;
	},

	// Méthode
	async getReasonsRequest() {
		try {
			this.state.loading = true;
			const { data: reasonsRequest } = await axios({
				method: "get", url: this.configuration.apiUrl,
			});
			this.state.reasonsRequest = reasonsRequest;
		} catch (error) {
			eventBus.$emit(eventName.ERROR, "Impossible de récupérer la liste des motifs de la requête", error);
		} finally {
			this.state.loading = false;
		}
	},

	async update({ id, label }) {
		try {
			this.state.updating = true;
			await axios({
				method: "patch", url: `${ this.configuration.apiUrl }/${ id }`, data: { label },
			});
		} catch (error) {
			eventBus.$emit(eventName.ERROR, `Impossible de modifier le motif de la requête (${ id })`, error);
		} finally {
			this.state.updating = false;
		}
		await this.getReasonsRequest();
	},

	async delete(id) {
		try {
			this.state.deleting = true;
			await axios({ method: "delete", url: `${ this.configuration.apiUrl }/${ id }` });
		} catch (error) {
			eventBus.$emit(eventName.ERROR, `Impossible de supprimer le motif de la requête (${ id })`, error);
		} finally {
			this.state.deleting = false;
		}
		await this.getReasonsRequest();
	},

	async add(label) {
		try {
			this.state.creating = true;
			await axios({ method: "post", url: `${ this.configuration.apiUrl }`, data: { label } });
		} catch (error) {
			eventBus.$emit(eventName.ERROR, `Impossible de créer le motif de la requête (${ label })`, error);
		} finally {
			this.state.creating = false;
		}
		await this.getReasonsRequest();
	},
};

export { reasonsRequestStore };
