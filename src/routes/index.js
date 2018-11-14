
import Dashboard from '../views/Dashboard/Dashboard.js';
import Components from '../views/Components/Components.js';
import DashboardMobile from '../views/Dashboard/DashboardMobile/DashboardMobile.js';

const indexRoutes = [
  { path: "/Components", component: Components },
  { path: "/m/", component: DashboardMobile },
  { path: "/", component: Dashboard }
];


export default indexRoutes;