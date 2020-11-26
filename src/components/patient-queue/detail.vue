<template>
	<div class="patient-queue-detail">
		<md-card class="content"
			:class="{ 'md-primary': !patientQueue.isLate, 'md-accent': patientQueue.isLate }"
			v-if="patientQueue"
		>
			<md-card-header>
				<div class="title">
					<transition enter-active-class="animate__animated animate__flash" mode="out-in">
						<div class="md-title" :key="patientQueue.id">
							{{ patientQueue.patient.fullName }}
						</div>
					</transition>
					<md-button @click="$emit('exit')" class="md-icon-button">
						<md-icon>close</md-icon>
					</md-button>
				</div>
				<div class="md-subhead md-layout">
					<div class="md-layout-item">{{ stateLabel }}</div>
					<div class="md-layout-item">
						Créé le {{ patientQueue.dates.creation | dateTimeToDate }}
					</div>
					<div class="md-layout-item">
						doit rappeler dans {{ patientQueue.dates.reminder | dateToDuration }}
						<md-tooltip>{{ patientQueue.dates.reminder | dateToDate }}</md-tooltip>
					</div>
				</div>
				<spinner-k2000 :animate="patientsQueueStore.loadingPatientQueue"/>
			</md-card-header>
			<md-card-content>
				<md-tabs md-elevation="3" md-alignment="fixed"
					:md-active-tab="topic"
					@md-changed="onTopicChange"
				>
					<md-tab id="patient" md-label="patient">
						<p>patient</p>
						<p> prtuieropu tioperzu oerzu hoeruhy tkl rguomeu gteriopu oer or</p>
						<p> repzut orizeyu oeru ouer uoero gerou goruioer oig orzeu gopiz</p>
						<p> repzut orizeyu oeru ouer uoero gerou goruioer oig orzeu gopiz</p>
						<p> repzut orizeyu oeru ouer uoero gerou goruioer oig orzeu gopiz</p>
						<p> repzut orizeyu oeru ouer uoero gerou goruioer oig orzeu gopiz</p>
						<p> repzut orizeyu oeru ouer uoero gerou goruioer oig orzeu gopiz</p>
						<p> repzut orizeyu oeru ouer uoero gerou goruioer oig orzeu gopiz</p>
						<p> repzut orizeyu oeru ouer uoero gerou goruioer oig orzeu gopiz</p>
					</md-tab>
					<md-tab id="medicalInformation" md-label="medical">medicalInformation</md-tab>
					<md-tab id="contacts" md-label="contacts">contacts</md-tab>
					<md-tab id="others" md-label="autres">others</md-tab>
				</md-tabs>
			</md-card-content>
		</md-card>
	</div>
</template>

<script>
import "animate.css/animate.min.css";
import dateFilters from "../../filters/date";
import { patientsQueueStore } from "../../stores/patients-queue.store";
import SpinnerK2000 from "../spinner-k2000";

export default {
	name: "PatientQueueDetail",
	event: [ "update:topic", "exit" ],
	components: { SpinnerK2000 },
	props: {
		patientQueueId: { type: String, required: true },
		topic: { type: String, default: "patient" },
	},
	data: () => ({
		patientsQueueStore,
		patientQueue: null,
	}),
	watch: {
		patientQueueId: {
			handler: async function () {
				this.patientQueue = await patientsQueueStore.getPatientQueue(this.patientQueueId);
			},
			immediate: true,
		},
	},
	computed: {
		stateLabel: (vm) => vm.stateLabelTranslate[vm.patientQueue.state.type],
	},
	filters: dateFilters,
	created: function () {
		this.stateLabelTranslate = {
			"in-queue": "en cours",
			processed: "traité",
			abandoned: "abandonné",
		};
	},
	methods: {
		onTopicChange: function (topic) {
			if (this.topic !== topic) {
				this.$emit("update:topic", topic);
			}
		},
	},
};
</script>

<style lang="scss">
.patient-queue-detail .content {
	display: flex;
	flex-direction: column;
	height: 100%;
	transition: background-color 1s;

	.md-card-header {

		.title {
			display: flex;

			.md-title {
				flex: 1;
			}
		}


		.md-subhead {
			opacity: 1;
		}

		.spinner-k2000 {
			background-color: white;
			margin: 0 10px 0 0;
			width: calc(100% - 10px);

			div {
				margin-top: 5px;
			}
		}
	}

	.md-card-content {
		flex: 1;
		min-height: 300px;

		.md-tabs {
			height: 100%;
			min-height: 100%;

			.md-tabs-content {
				height: auto !important;
				flex: 1;

				.md-tabs-container {
					height: 100%;

					.md-tab {
						height: 100%;
						overflow-y: auto;
					}
				}
			}
		}
	}
}
</style>
