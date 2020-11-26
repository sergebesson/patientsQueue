import _ from "lodash";
import axios from "axios";
import moment from "moment";
import { eventBus, eventName } from "../eventBus";
import { configurationStore } from "./configuration.store";

const patientsQueueStore = {
	configuration: {
		pageSize: 30,
		apiUrl: "api/patients-queue",
		apiMethod: "get",
	},
	state: {
		page: 1,
		totalPages: 1,
		search: "",
		patientsQueue: [],
		loadingList: false,
		updatingList: false,
		loadingPatientQueue: false,
	},
	// page
	get page() {
		return this.state.page;
	},
	async nextPage() {
		if (this.state.loadingList || this.state.page >= this.state.totalPages) {
			return;
		}
		await this.getPatientsQueue(this.state.page + 1);
	},
	// total pages
	get totalPages() {
		return this.state.totalPages;
	},
	// search
	get search() {
		return this.state.search;
	},
	set search(search) {
		this.state.search = search;
		this.getPatientsQueue();
	},
	// PatientsQueue
	get patientsQueue() {
		return this.state.patientsQueue;
	},
	// pageSize
	get pageSize() {
		return this.configuration.pageSize;
	},
	// loadingList
	get loadingList() {
		return this.state.loadingList;
	},
	// updatingList
	get updatingList() {
		return this.state.updatingList;
	},
	// loadingPatientQueue
	get loadingPatientQueue() {
		return this.state.loadingPatientQueue;
	},

	// Méthode
	async getPatientsQueue(page = 1) {
		try {
			this.state.loadingList = true;
			const params = {
				page_size: this.pageSize,
				page,
			};
			if (this.state.search !== "") {
				params.search = this.state.search;
			}
			const { data, config: { params: { search = "" } } } = await axios({
				method: this.configuration.apiMethod, url: this.configuration.apiUrl, params,
			});
			if (search !== this.state.search) {
				/* search a été modifié pendant la requête, on ne tient pas compte de cette requête
				   et on reste en loading */
				return;
			}
			const patientsQueue = data.patients_queue.map(this._computeAttributsPatientQueue);
			this.state.page = data.page;
			this.state.totalPages = data.total_pages;
			this.state.patientsQueue = this.state.page === 1 ?
				patientsQueue :
				this.state.patientsQueue.concat(patientsQueue);
		} catch (error) {
			eventBus.$emit(eventName.ERROR, "Impossible de récupérer la liste des patients", error);
		} finally {
			this.state.loadingList = false;
		}
	},

	async update() {
		this.state.updatingList = true;
		try {
			const params = {
				page: 1,
				page_size: this.state.page * this.pageSize,
			};
			if (this.state.search !== "") {
				params.search = this.state.search;
			}
			const { data: {
				total_patients_queue: totalPatientsQueue, patients_queue: patientsQueue,
			} } =
				await axios({
					method: this.configuration.apiMethod, url: this.configuration.apiUrl, params,
				});

			this.state.page = Math.ceil(patientsQueue.length / this.pageSize);
			this.state.totalPages = Math.ceil(totalPatientsQueue / this.pageSize);
			this.state.patientsQueue = patientsQueue;
		} finally {
			this.state.updatingList = false;
		}
	},

	async getPatientQueue(patientQueueId) {
		try {
			this.state.loadingPatientQueue = true;
			const { data: patientQueue } = await axios({
				method: "get", url: `${ this.configuration.apiUrl }/${ patientQueueId }`,
			});
			return this._computeAttributsPatientQueue(patientQueue);
		} catch (error) {
			eventBus.$emit(
				eventName.ERROR, `Impossible de récupérer le patient ${ patientQueueId }`, error,
			);
		} finally {
			this.state.loadingPatientQueue = false;
		}
	},

	_computeAttributsPatientQueue(patientQueue) {
		return _.merge(patientQueue, {
			patient: {
				fullName: `${ patientQueue.patient.first_name} ${patientQueue.patient.last_name}`,
			},
			isLate:	moment(patientQueue.dates.reminder, "YYYY-MM-DD") < Date.now(),
		});
	},
};

eventBus.$on(eventName.CONFIGURATION_LOADED, () => {
	patientsQueueStore.configuration.pageSize = configurationStore
		.getValue("pageSize", patientsQueueStore.configuration.pageSize);
});

export { patientsQueueStore };
