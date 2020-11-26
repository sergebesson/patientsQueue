import Vue from "vue";
import VueRouter from "vue-router";
import PatientQueueMain from "./components/patient-queue/main.vue";
import ReasonRequestList from "./components/reason-request-list.vue";

Vue.use(VueRouter);

const routes = [ {
	name: "home",
	path: "/",
	redirect: "/patient-queue",
}, {
	name: "patient-queue",
	path: "/patient-queue",
	component: PatientQueueMain,
	props: (route) => ({
		patientQueueId: route.query["patient-queue-id"],
		tabs: route.query.tabs,
	}),
}, {
	name: "reason-request",
	path: "/reason-request",
	component: ReasonRequestList,
} ];

// const routes = [
// 	{
// 		path: "/",
// 		name: "Home",
// 		component: Home,
// 	},
// 	{
// 		path: "/about",
// 		name: "About",
// 		// route level code-splitting
// 		// this generates a separate chunk (about.[hash].js) for this route
// 		// which is lazy-loaded when the route is visited.
// 		component: () =>
// 			import(/* webpackChunkName: "about" */ "../views/About.vue"),
// 	},
// ];

const router = new VueRouter({
	routes,
});

export default router;
