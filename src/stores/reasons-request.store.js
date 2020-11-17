import axios from "axios";
import { eventBus, eventName } from "../eventBus";

// eslint-disable-next-line no-unused-vars
const reasonsRequestStore = {
	configuration: {
		apiUrl: "api/reason-request",
		apiMethod: "get",
	},
	state: {
		reasonsRequest: [],
		loading: false,
	},
	get reasonsRequest() {
		return this.state.reasonsRequest;
	},
	get loading() {
		return this.state.loading;
	},

	// Méthode
	async getReasonsRequest() {
		try {
			this.state.loading = true;
			const { data: reasonsRequest } = await axios({
				method: this.configuration.apiMethod, url: this.configuration.apiUrl,
			});
			this.state.reasonsRequest = reasonsRequest;
		} catch (error) {
			eventBus.$emit(eventName.ERROR, "Impossible de récupérer la liste des motifs de la requête", error);
		} finally {
			this.state.loading = false;
		}
	},
};

export { reasonsRequestStore };
