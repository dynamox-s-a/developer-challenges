import useAuth from './useAuth';

export default function UserCard() {
  const auth = useAuth();
  const { logout, user } = auth!;
  const { name, email, id } = user;
  return (
    <div id="userCard">
      <p>User Card</p>
      <h3>{name}</h3>
      <p>{email}</p>
      <p>{id}</p>
      <button type="button" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
