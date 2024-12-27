import Link from "next/link";
import "./Pagination.css";
export default function Pagination({ pagination, id, username, pageNo, lastPage }) {
  return (
    <footer>
      <center>
        <ul className="pagination1 mt-4 mb-4">
          <Link href={`/loan-recovery/employee-dashboard/${id.toString()}/${username}/1`}>
            <li className="page-item1">
              <span className="material-icons page-link1">keyboard_double_arrow_left</span>
            </li>
          </Link>
          {pageNo > 1 ? (
            <Link href={`/loan-recovery/employee-dashboard/${id.toString()}/${username}/${pageNo - 1}`}>
              <li className="page-item1">
                <span className="material-icons page-link1">arrow_back</span>
              </li>
            </Link>
          ) : null}

          {pagination.map((page) => {
            return (
              <Link key={page.index_number} href={`/loan-recovery/employee-dashboard/${id.toString()}/${username}/${page.value}`}>
                <li className="page-item1" style={{ backgroundColor: page.color, cursor: page.cursor }}>
                  <span className="page-link1">{page.value}</span>
                </li>
              </Link>
            );
          })}
          {pageNo < lastPage ? (
            <Link href={`/loan-recovery/employee-dashboard/${id.toString()}/${username}/${parseInt(pageNo) + 1}`}>
              <li className="page-item1">
                <span className="material-icons page-link1">arrow_forward</span>
              </li>
            </Link>
          ) : null}
          <Link href={`/loan-recovery/employee-dashboard/${id.toString()}/${username}/${lastPage}`}>
            <li className="page-item1">
              <span className="material-icons page-link1">keyboard_double_arrow_right</span>
            </li>
          </Link>
        </ul>
      </center>
    </footer>
  );
}
