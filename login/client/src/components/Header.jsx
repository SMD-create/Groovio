
import './Header.css';
const Header = () => {
  return (
    <div className="header-container">
      {}
      <h1>Groovio</h1>
      {
    <nav>
        <button>Home</button>
        <button>Search</button>
        <button>Your Library</button>
        <button>Create Playlist</button>
    </nav>
    }
    </div>
  );
};

export default Header;