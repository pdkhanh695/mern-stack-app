import React, { useState, useEffect, useMemo, Fragment } from "react";
import { toast } from "react-toastify";
import { useQuery, useMutation } from "@apollo/react-hooks"; // use mutation to update profile| use Query to query to the profile
// useMemo ~= useEffect
import { gql } from "apollo-boost";
import omitDeep from "omit-deep";
import { USER_UPDATE } from "../../graphql/mutations";
import { PROFILE } from "../../graphql/queries";

const Profile = () => {
  const [values, setValues] = useState({
    // put the object in the state
    username: "",
    name: "",
    email: "",
    about: "",
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const { data } = useQuery(PROFILE);

  useMemo(() => {
    if (data) {
      console.log(data.profile);
      setValues({
        username: data.profile.username,
        name: data.profile.name,
        email: data.profile.email,
        about: data.profile.about,
        images: omitDeep(data.profile.images, ["__typename"]), // because this type send __typename when sending to server
      });
    }
  }, [data]); // whenever you run query and change data => useMemo will run

  // mutation
  const [userUpdate] = useMutation(USER_UPDATE, {
    update: ({ data }) => {
      console.log("USER UPDATE MUTATION", data);
      toast.success("Profile updated");
    },
  });

  // destructure data if you don't want to set values.image || values.name ...
  const { username, name, email, about, images } = values;

  //write a function return a JSX
  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log(values);
    //return;
    setLoading(true);
    userUpdate({ variables: { input: values } });
    setLoading(false);
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImageChange = () => {};

  const profileUpdateForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label> UserName </label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={handleChange}
          className="form-control"
          placeholder="UserName"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label> Name </label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={handleChange}
          className="form-control"
          placeholder="Name"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label> Email </label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          className="form-control"
          placeholder="Email"
          disabled
        />
      </div>

      <div className="form-group">
        <label> Image </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="form-control"
          placeholder="Image"
        />
      </div>
      <div className="form-group">
        <label> About </label>
        <textarea
          name="about"
          value={about}
          onChange={handleChange}
          className="form-control"
          placeholder="About"
          disabled={loading}
        />
      </div>
      <button
        className="btn btn-primary"
        type="submit"
        disabled={!email || loading}
      >
        {" "}
        Submit{" "}
      </button>
    </form>
  );

  return <div className="container p-5">{profileUpdateForm()}</div>;
};

export default Profile;
