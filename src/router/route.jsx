import { HashRouter, Navigate, Route, Routes } from "react-router";
import Dashboard from "../pages/Dashboard";
import Standups from "../pages/Standups";
import Team from "../pages/Team";
import Vacations from "../pages/Vacations";
import Blockers from "../pages/Blockers";
import Error from "../pages/Error";

function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/standups" element={<Standups />} />
        <Route path="/team" element={<Team />} />
        <Route path="/vacations" element={<Vacations />} />
        <Route path="/blockers" element={<Blockers />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </HashRouter>
  );
}

export default AppRouter