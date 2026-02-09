import "./Header.css";

const Header = ({ userName = "Sanavi" }) => {
  return (
    <div className="header">
      <div className="header-welcome">
        
      </div>

      <div className="header-actions">
        <div className="search-box">
        <span className="search-icon">
  <i className="fi fi-bs-search"></i>
</span>

          <input type="text" placeholder="Search" className="search-input" />
        </div>

        <button className="icon-button">
         <i className="fi fi-ss-bell"></i>
        </button>



        <button className="icon-button">
          <i className="fi fi-rs-settings"></i>
        </button>

       <div className="user-avatar">
          <i className="fi fi-ss-user"></i>
      </div>

      </div>
    </div>
  );
};

export default Header;
