import "./employee-dashboard.css";
import EmployeeDashboardMain from "./Employeedashboardmain";
import { fetchEmployeeTasks, paginationDetails, taskOverallDetails } from "../../../api/backend/employee-dashboard";

export default async function EmployeeDashboard({ params, searchParams }) {
  let { id } = await params;
  const { username, pageno } = await searchParams;
  const vehicleData = await fetchEmployeeTasks(id, pageno);
  const paginationData = await paginationDetails(id, pageno);
  const tasksData = await taskOverallDetails(id);

  return (
    <>
      <EmployeeDashboardMain id={id} username={username} pageno={pageno} vehicleData={vehicleData} paginationData={paginationData} tasksData={tasksData} />
    </>
  );
}
