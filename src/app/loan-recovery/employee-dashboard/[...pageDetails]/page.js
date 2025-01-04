import "./employee-dashboard.css";
import { notFound } from "next/navigation";
import EmployeeDashboardMain from "./Employeedashboardmain";
import { fetchEmployeeTasks, paginationDetails, taskOverallDetails, fetchEmployeeData } from "../../../api/backend/employee-dashboard";

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
  const employeedata = await fetchEmployeeData(id);

  return <EmployeeDashboardMain id={id} username={employeedata.username} pageno={pageno} vehicleData={vehicleData} paginationData={paginationData} tasksData={tasksData} employeedata={employeedata} />;
}
