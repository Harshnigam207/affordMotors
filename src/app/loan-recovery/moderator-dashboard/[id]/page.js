export default async function ModeratorDashboard({ params, searchParams }) {
  const { id } = await params;
  const { username } = await searchParams;
  return (
    <div>
      <h1>Moderator Dashboard</h1>
      <h2>Id : {id}</h2>
      <h2>Username : {username}</h2>
    </div>
  );
}
