import "./Header.css";

const Header = () => {
  return (
    <div className="header">
      <div className="header-actions">
        <div className="search-box">
          <span className="search-icon">
            <i className="fi fi-bs-search"></i>
          </span>
          <input type="text" placeholder="Search" className="search-input" />
        </div>
        <div className="user-avatar" style={{backgroundColor: '#D15886', color: "white", fontWeight: "bold", marginLeft: "10px"}}>
          S
        </div>
      </div>
    </div>
  );
};

export default Header;
