<template>
	<div class="infinite-list">
		<template v-if="$slots.header">
			<md-subheader class="infinite-list-header md-primary" >
				<slot name="header" />
			</md-subheader>
			<md-divider v-if="withHeaderDivider" />
		</template>

		<md-list
			@scroll="onScroll"
			class="infinite-list-items" :class="mdListClass"
			:md-expand-single="mdExpandSingle"
		>

			<transition-group name="infinite-list-transition">
				<div v-for="item in items" :key="item[itemKey]" class="infinite-list-item">
					<md-list-item>
						<slot name="item" :item="item" />
					</md-list-item>
					<md-divider v-if="withItemsDivider" />
				</div>
			</transition-group>

			<div v-show="loadingData" class="spinner">
				<slot name="spinner">
					<spinner-k2000 />
				</slot>
			</div>

			<md-list-item v-if="!loadingData && items.length === 0">
				<slot name="empty-list" >
					<span class="md-caption">{{ labelEmptyList }}</span>
				</slot>
			</md-list-item>

		</md-list>

	</div>
</template>

<script>

import _ from "lodash";
import SpinnerK2000 from "./spinner-k2000";

export default {
	name: "InfiniteList",
	components: { SpinnerK2000 },
	props: {
		items: { type: Array, required: true },
		itemKey: { type: String, require: true },
		loadingData: { type: Boolean, require: true },
		labelEmptyList: { type: String, default: "Liste vide" },
		withHeaderDivider: { type: Boolean, default: true },
		withItemsDivider: { type: Boolean, default: true },
		dense: { type: Boolean, default: false },
		lineStyle: {
			type: String,
			validator: (value) => [ "simple", "double", "triple" ].includes(value),
			default: "simple",
		},
		mdExpandSingle: { type: Boolean, default: false },
		throttleTimeToScroll: { type: Number, default: 50 },
		nbOfPixelsBeforeAddingToScroll: { type: Number, default: 10 },
	},
	computed: {
		mdListClass: function () {
			return {
				"md-dense": this.dense,
				"md-double-line": this.lineStyle === "double",
				"md-triple-line": this.lineStyle === "triple",
			};
		},
	},
	created: function () {
		this.onScroll = _.throttle((event) => {
			const target = event.target;
			if (target.offsetHeight +
					target.scrollTop +
					this.nbOfPixelsBeforeAddingToScroll >= target.scrollHeight) {
				this.$emit("next-page");
			}
		}, this.throttleTimeToScroll);
	},
	mounted: function () {
		if (this.$slots.header) {
			this.addSizeOfTheScrollBarToTheRightPaddingOfTheHeaderElement();
		}
	},
	methods: {
		addSizeOfTheScrollBarToTheRightPaddingOfTheHeaderElement() {
			const headerElement = this.$el.querySelector(".md-subheader");
			const listElement = this.$el.querySelector(".md-list");
			const childElement = this.$el.querySelector(".md-list > *");
			const padding = parseInt(
				getComputedStyle(headerElement).getPropertyValue("padding-right"), 10,
			) +
				listElement.offsetWidth -
				childElement.offsetWidth;

			headerElement.style.paddingRight = `${ padding }px`;
		},
	},
};
</script>

<style>
	.infinite-list {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.infinite-list .md-divider {
		min-height: 1px;
	}

	.infinite-list .md-list {
		overflow-y: scroll;
		scroll-snap-type: y mandatory;
		height: 100%;
		padding: 0px;
	}

	.infinite-list .md-subheader,
	.infinite-list .md-list .md-list-item {
		display: flex;
		flex-wrap: wrap;
	}

	.infinite-list .md-subheader > div,
	.infinite-list .md-list .md-list-item .md-list-item-content > div {
		flex: 1 1;
		font-size: 14px;
	}

	.infinite-list-transition-enter, .infinite-list-transition-leave-to {
		opacity: 0;
		transform: translateY(-100px);
	}
	.infinite-list-transition-leave-active {
		position: absolute;
	}
	.infinite-list-item {
		scroll-snap-align: start;
		transition: all 0.5s;
	}

	.infinite-list .spinner {
		padding: 10px 0px;
		min-height: 25px;
	}
</style>
