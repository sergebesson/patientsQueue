<template>
	<profile-menu :name="meStore.name">
		<md-divider />
		<md-menu-item href="/api" target="_blank">
			<md-icon>api</md-icon>
			<span>api</span>
		</md-menu-item>
	</profile-menu>
</template>

<script>
import ProfileMenu from "../profile-menu";
import { meStore } from "../../stores/me.store";

export default {
	components: { ProfileMenu },
	name: "PatientQueueProfile",
	data: () => ({
		meStore,
	}),
};
</script>
