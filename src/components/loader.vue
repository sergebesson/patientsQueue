
<template>
	<transition name="fade">
		<div id="loader"><spinner-k2000 /></div>
	</transition>
</template>

<script>

import SpinnerK2000 from "./spinner-k2000.vue";

export default {
	name: "Loader",
	components: { SpinnerK2000 },
	mounted: function () {
		const loader = document.getElementById("loader");
		loader.parentNode.removeChild(loader);
	},
};
</script>

<style lang="scss">
#loader {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100%;
	z-index: 10;

	.spinner-k2000 {
		max-width: 800px;
	}
}
</style>
