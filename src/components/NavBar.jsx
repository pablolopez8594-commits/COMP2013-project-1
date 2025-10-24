export default function NavBar({  username = "User" }) {
  return (
    <nav className="NavBar">
      <div className="NavDiv NavUser">Hello, {username}</div>

      <div className="NavDiv NavTitle">
        <h2>Groceries App</h2>
      </div>

    </nav>
  );
}