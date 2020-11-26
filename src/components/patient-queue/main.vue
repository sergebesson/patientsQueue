<template>
	<transition name="fade">
		<div class="patient-queue-main">
			<patient-queue-list
				@click="updatePatientQueue"
				:currentPatientQueueId="patientQueueId"
			/>
			<transition
				name="patient-queue-detail"
				enter-active-class="animate__animated animate__bounceInRight"
				leave-active-class="animate__animated animate__bounceOutRight"
			>
				<patient-queue-detail
					v-if="patientQueueId"
					:patient-queue-id="patientQueueId"
					:topic="topic"
					@update:topic="updateTopic"
					@exit="exit"
				/>
			</transition>
		</div>
	</transition>
</template>

<script>
import patientQueueList from "../patient-queue/list.vue";
import patientQueueDetail from "../patient-queue/detail.vue";
export default {
	name: "PatientQueueMain",
	events: [ "change" ],
	components: { patientQueueList, patientQueueDetail },
	props: {
		patientQueueId: { type: String, required: false },
		topic: { type: String, default: "1" },
	},
	methods: {
		updatePatientQueue(patientQueue) {
			this.$router.push({
				name: this.$route.name,
				params: this.$route.params,
				query: { ...this.$route.query, "patient-queue-id": patientQueue.id, topic: "1" },
			});
		},
		updateTopic: function (topic) {
			this.$router.push({
				name: this.$route.name,
				params: this.$route.params,
				query: { ...this.$route.query, topic },
			});
		},
		exit: function () {
			this.$router.push({
				name: this.$route.name,
				params: this.$route.params,
			});
		},
	},
};
</script>

<style lang="scss">
.patient-queue-main {
	flex: 1;
	display: flex;
	overflow: hidden;

	.patient-queue-list {
		flex: 1;
	}

	.patient-queue-detail {
		transition: flex-basis .4s linear;
		flex-basis: 400px;

		&-enter, &-leave-to {
			flex-basis: 0;
		}

		.content {
			margin: 3px 3px 1px 10px;
			border-radius: 8px 8px 0 0px;
		}
	}
}
</style>
