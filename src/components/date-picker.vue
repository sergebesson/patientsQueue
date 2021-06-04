<template>
	<date-pick
		:value="value" @input="$emit('input', $event)"
		displayFormat="DD/MM/YYYY"
		:mobileBreakpointWidth="5000"
		:isDateDisabled="(date) => date > new Date()"
		:selectableYearRange="yearRange"
		nextMonthCaption="Mois suivant"
		prevMonthCaption="Mois précédent"
		:weekdays="['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']"
		:months="['Janvier', 'Février', 'Mars', 'Avril','Mai', 'Juin',
			'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']"
	>
		<template v-slot:default="slotProps">
			<slot v-bind="slotProps" />
		</template>
	</date-pick>
</template>

<script>
import DatePick from "vue-date-pick";

const NB_YEARS = 60;

export default {
	name: "DatePicker",
	components: { DatePick },
	props: {
		value: { type: String, required: true },
	},
	methods: {
		yearRange: () => {
			const lastYear = new Date().getFullYear();
			const years = [];
			for (let i = lastYear - NB_YEARS; i <= lastYear; i++) {
				years.push(i);
			}
			return years;
		},
	},
};
</script>

<style lang="scss">
$vdpColor: var(--md-theme-default-primary);
@import 'vue-date-pick/src/vueDatePick.scss';

.vdpWithInput {
	width: 100%;
}

.vdpComponent {
	font-size: 9px;

	.vdpInnerWrap {
		min-width: 0;
		max-width: none;

		.vdpTable {
			width: auto;

			.vdpHeadCell {
				padding: 0;
			}

			.vdpRow {
				.vdpCell {
					padding: 0;
				}
			}
		}
	}
}
</style>
