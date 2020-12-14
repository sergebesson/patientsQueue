
<template>
	<md-content class="spinner-k2000 md-primary">
		<div v-show="this.animate" :style="{ animationDuration: `${ this.duration }s` }" />
	</md-content>
</template>

<script>
export default {
	name: "SpinnerK2000",
	props: {
		animate: { type: Boolean, default: true },
		duration: { type: Number, default: 2 },
	},
};
</script>

<style lang="scss">

.spinner-k2000 {
	$right: 30px;
	$left: 20px;
	position: relative;
	margin: 0px $right 0px $left;
	width: calc(100% - #{$right + $left});
	z-index: 10;

	div {
		position: absolute;
		background-color: inherit;
		border-radius: 50%;
		animation: {
			name: spinner-k2000;
			duration: 2s;
			iteration-count: infinite;
			timing-function: ease-in-out;
			delay: 0s;
		};
	}
}

@keyframes spinner-k2000 {
	0% {
		left: 0%;
		width: 10px;
		height: 3px;
		top: 2px;
	}
	25% {
		width: 50px;
		height: 8px;
		top: 0px;
	}
	50% {
		left: 100%;
		width: 10px;
		height: 3px;
		top: 2px;
	}
	75% {
		width: 50px;
		height: 8px;
		top: 0px;
	}
	100% {
		left: 0%;
		width: 10px;
		height: 3px;
		top: 2px;
	}
}
</style>
