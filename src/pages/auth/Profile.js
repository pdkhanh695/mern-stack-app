import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  Fragment,
} from "react";
import { toast } from "react-toastify";
import { useQuery, useMutation } from "@apollo/react-hooks"; // use mutation to update profile| use Query to query to the profile
// useMemo ~= useEffect
import { gql } from "apollo-boost";
import omitDeep from "omit-deep";
import { USER_UPDATE } from "../../graphql/mutations";
import { PROFILE } from "../../graphql/queries";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import UserProfile from "../../components/forms/UserProlife";
import FileUpload from "../../components/forms/FileUpload";

const Profile = () => {
  const { state } = useContext(AuthContext);
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
      //console.log(data.profile);
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

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-12 text-center pb-3 ">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>Profile</h4>
          )}
        </div>
        <FileUpload
          setValues={setValues}
          setLoading={setLoading}
          values={values}
          loading={loading}
        />
      </div>
      <UserProfile
        {...values}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        loading={loading}
      />
    </div>
  );
};

export default Profile;
