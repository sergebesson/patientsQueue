
<template>
	<md-content class="spinner-k2000 md-primary">
		<div v-show="animate" :style="{ animationDuration: `${ duration }s` }" />
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

<style>
.spinner-k2000 {
	position: relative;
	margin: 0px 30px 0px 20px;
	width: calc(100% - 50px);
}

.spinner-k2000 div {
	position: absolute;
	background-color: inherit;
	border-radius: 50%;
	animation-name: k2000;
	animation-duration: 2s;
	animation-iteration-count: infinite;
	animation-timing-function: ease-in-out;
	animation-delay: 0s;
}

@keyframes k2000 {
	0% {
		left: 0%;
		width: 10px;
		height: 3px;
	}
	25% {
		width: 50px;
		height: 8px;
	}
	50% {
		left: 100%;
		width: 10px;
		height: 3px;
	}
	75% {
		width: 50px;
		height: 8px;
	}
	100% {
		left: 0%;
		width: 10px;
		height: 3px;
	}
}
</style>
