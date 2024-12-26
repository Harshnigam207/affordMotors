import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href="/loan-recovery/login" className="btn btn-dark">
        Click to go to login page.
      </Link>
    </div>
  );
}
