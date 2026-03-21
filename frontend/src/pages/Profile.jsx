import "./Profile.css";

const Profile = () => {
  return (
    <div className="profile-page">
      <h1 className="page-title profile-title">Profile</h1>

      <div className="profile-container">
        
        {/* User Banner */}
        <div className="profile-banner">
          <div className="profile-user-info">
            <div className="user-avatar-large"></div>
            <div className="user-details-text">
              <h2>Alexa Rawles</h2>
              <p>alexarawles@gmail.com</p>
            </div>
          </div>
          <button className="btn-edit-profile">Edit</button>
        </div>

        {/* Profile Form */}
        <div className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" defaultValue="Alexa Rawles" className="form-control" />
            </div>
            <div className="form-group">
              <label>Country</label>
              <div className="select-wrapper">
                <select className="form-control" defaultValue="Sri Lanka">
                  <option value="Sri Lanka">Sri Lanka</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="India">India</option>
                </select>
                <i className="fi fi-rr-angle-small-down select-icon"></i>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Gender</label>
              <div className="select-wrapper">
                <select className="form-control" defaultValue="Female">
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
                <i className="fi fi-rr-angle-small-down select-icon"></i>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Language</label>
              <div className="select-wrapper">
                <select className="form-control" defaultValue="English">
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
                <i className="fi fi-rr-angle-small-down select-icon"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Email Section */}
        <div className="email-section">
          <h3>My email Address</h3>
          
          <div className="email-card">
            <div className="email-icon">
              <i className="fi fi-sr-envelope"></i>
            </div>
            <div className="email-details-text">
              <p className="email-address">alexarawles@gmail.com</p>
              <p className="email-time">1 month ago</p>
            </div>
          </div>

          <button className="btn-add-email">
            +Add Email Address
          </button>
        </div>

        {/* Action Bottom */}
        <div className="profile-actions">
          <button className="btn-save-changes">Save Changes</button>
        </div>

      </div>
    </div>
  );
};

export default Profile;
