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

  const fileResizeAnUpload = (event) => {
    // upload the image, get the Url back =>
    // First: Resize the image => install backage to resize the image
    // Search: npm i react-image-file-resizer
    let fileInput = false;
    if (event.target.files[0]) {
      fileInput = true;
    }
    if (fileInput) {
      Resizer.imageFileResizer(
        event.target.files[0],
        300,
        300,
        "JPEG",
        100,
        0,
        (uri) => {
          //console.log(uri);

          axios
            .post(
              `${process.env.REACT_APP_REST_ENDPOINT}/uploadimages`,
              { image: uri },
              {
                headers: {
                  authtoken: state.user.token,
                },
              }
            )
            .then((response) => {
              // after send the image => we revice the Url
              setLoading(false);
              console.log("CLOUDINARY UPLOAD", response);
              setValues({ ...values, images: [...images, response.data] }); // images: [url, public_id]
            })
            .catch((error) => {
              setLoading(false);
              console.log("CLOUDINARY UPLOAD FAILED", error);
            });
        },
        "base64"
      );
    }
  };

  const handleImageRemove = (id) => {
    setLoading(true);
    axios
      .post(
        `
        ${process.env.REACT_APP_REST_ENDPOINT}/removeimage
        `,
        {
          public_id: id,
        },
        {
          headers: {
            authtoken: state.user.token,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        let filterImages = images.filter((item) => {
          return item.public_id !== id; // when success function callback will delete image from imagesvalue
        });
        setValues({ ...values, images: filterImages });
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };
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

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-3">
          <div className="form-group">
            <label className="btn btn-outline-success">
              {" "}
              Upload Image
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={fileResizeAnUpload}
                className="form-control"
                placeholder="Image"
              />
            </label>
          </div>
        </div>
        <div className="col-md-9">
          {images.map((image) => (
            <img
              src={image.url}
              key={image.public_id}
              alt={image.public_id}
              style={{ height: "100px" }}
              className="float-right"
              onClick={() => handleImageRemove(image.public_id)}
            />
          ))}
        </div>
      </div>
      {profileUpdateForm()}
    </div>
  );
};

export default Profile;
