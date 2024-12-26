import "./admin-dashboard.css";
import AdminDashboardMain from "./Admindashboardmain";
import { fetchEmployeeTasks, paginationDetails } from "../../../api/backend/employee-dashboard";

export default async function AdminDashboard({ params, searchParams }) {
  let { id } = await params;
  const { username, pageno } = await searchParams;
  const vehicleData = await fetchEmployeeTasks(id, pageno);
  const paginationData = await paginationDetails(id, pageno);

  return (
    <>
      <AdminDashboardMain id={id} username={username} pageno={pageno} vehicleData={vehicleData} paginationData={paginationData} />
    </>
  );
}
