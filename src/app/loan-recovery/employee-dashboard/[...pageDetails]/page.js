import "./employee-dashboard.css";
import { notFound } from "next/navigation";
import EmployeeDashboardMain from "./Employeedashboardmain";
import { fetchEmployeeTasks, paginationDetails, taskOverallDetails } from "../../../api/backend/employee-dashboard";

export default async function EmployeeDashboard({ params }) {
  const { pageDetails } = await params;
  let [id, username, pageno] = pageDetails;
  pageno = parseInt(pageno);

  const vehicleData = await fetchEmployeeTasks(id, pageno);
  const paginationData = await paginationDetails(id, pageno);
  if (pageno > paginationData[4].value || pageno < 1) {
    notFound();
    return null;
  }
  const tasksData = await taskOverallDetails(id);

  return <EmployeeDashboardMain id={id} username={username} pageno={pageno} vehicleData={vehicleData} paginationData={paginationData} tasksData={tasksData} />;
}
