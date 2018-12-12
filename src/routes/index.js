
import Dashboard from '../views/Dashboard/Dashboard.js';
import Components from '../views/Components/Components.js';
import DashboardMobile from '../views/Dashboard/DashboardMobile/DashboardMobile.js';

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
 
const indexRoutes = [
  { path: "/Components", component: Components },
  { path: "/", component: isMobile ? DashboardMobile : Dashboard }
];

export default indexRoutes;