import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LayoutAdmin from './componentsAdmin/layoutAdmin'
import LayoutClient from './componentsClient/layoutClient'
import LogInClient from './componentsClient/logInClient'
import SignUpClient from './componentsClient/signUpClient'
import Page404 from './componentsClient/Page404'
import Welcome from './componentsClient/welcome';
import HomeClient from './componentsClient/homeClient';
import DashboardAdmin from './componentsAdmin/dashboardAdmin';
import DashboardAdmin222 from './componentsAdmin/dashboardAdmin222';
import Varification from './componentsClient/varification';
import LogoutClient from './componentsClient/logoutClient';
import BiomechanicalAss from './componentsClient/BiomechanicalAss';
import Calibration from './componentsClient/Calibration';
import CalibrationVideo from './componentsClient/CalibrationVideo';
import H_statement from './componentsClient/h_statement';
import HealthForm from './componentsClient/healthForm';
import OutCome from './componentsClient/OutCome';
import Reports from './componentsClient/Reports';
import ExplanatoryV from './componentsClient/explanatoryV';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<LayoutAdmin />}>
          <Route index element={<DashboardAdmin />} />
          <Route path='/admin/admin222' element={<DashboardAdmin222 />} />
        </Route>

        <Route path="/" element={<LayoutClient />}>
          <Route index element={<Welcome />} />
          <Route path="/signup" element={<SignUpClient />} />
          <Route path="/varification" element={<Varification />} />
          <Route path="/login" element={<LogInClient />} />
          <Route path="/logout" element={<LogoutClient />} />
          <Route path="/homeClient" element={<HomeClient />} />
          <Route path="/explanatoryV" element={<ExplanatoryV />} />
          <Route path="/biomechanicalAss" element={<BiomechanicalAss />} />
          <Route path="/calibration" element={<Calibration />} />
          <Route path="/calibrationVideo" element={<CalibrationVideo />} />
          <Route path="/h_statement" element={<H_statement />} />
          <Route path="/healthForm" element={<HealthForm />} />
          <Route path="/outCome" element={<OutCome />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/*" element={<Page404 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes