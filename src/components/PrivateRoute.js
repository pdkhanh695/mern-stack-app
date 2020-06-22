import React, { useContext, useState, useEffect } from "react";
import { Route, Link } from "react-router-dom";

import { AuthContext } from "../context/authContext";
import LoadingToRedirect from "./LoadingToRedirect";

// ...rest: the rest of props
const PrivateRoute = ({ ...rest }) => {
  const { state } = useContext(AuthContext);
  const [user, setUser] = useState(false);

  useEffect(() => {
    // useEffect to make sure we have user
    if (state.user) {
      setUser(true); // Set state when have user
    }
  }, [state.user]);

  // write function to return nav link
  const navLinks = () => (
    <nav>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link className="nav-link" to="/profile">
            Profile
          </Link>
        </li>
      </ul>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link className="nav-link" to="/password/update">
            Password
          </Link>
        </li>
      </ul>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link className="nav-link" to="/post/create">
            Post
          </Link>
        </li>
      </ul>
    </nav>
  );

  const renderContent = () => (
    <div className="container-fluid pt-5">
      <div className="row">
        <div className="col-md-3">{navLinks()}</div>
        <div className="col-md-9">
          <Route {...rest} />
        </div>
      </div>
    </div>
  );

  return user ? renderContent() : <LoadingToRedirect path="/login " />;
};

export default PrivateRoute;
