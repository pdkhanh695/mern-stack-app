import React from "react";
import Image from "./forms/Image";
import { Link } from "react-router-dom";

const UserCard = ({ user }) => {
  const { username, images, about } = user; //to make easy to use
  return (
    <div className="text-center" style={{ minHeight: "375px" }}>
      <Image image={images[0]} />
      <div className="card-body">
        <Link to={`/user/${username}`}>
          {" "}
          <h4 className="text-primary"> @{username}</h4>
        </Link>
        <hr />
        <small> {about}</small>
      </div>
    </div>
  );
};

export default UserCard;
