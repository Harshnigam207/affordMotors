import "./loginpage.css";
import Loginform from "./loginform";

export default function login() {
  return (
    <>
      <div className="login_page_container">
        <div className="rounded-edge login_image_div"></div>
        <Loginform />
      </div>
    </>
  );
}
