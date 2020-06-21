import React, { useContext, Fragment } from "react";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import Image from "./Image";

const FileUpload = ({ setValues, setLoading, values, loading }) => {
  const { state } = useContext(AuthContext);
  const fileResizeAnUpload = (event) => {
    // upload the image, get the Url back =>
    // First: Resize the image => install backage to resize the image
    // Search: npm i react-image-file-resizer
    setLoading(true);
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
              const { images } = values;
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
        const { images } = values;
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
  return (
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
        {values.images.map((image) => (
          <Image
            image={image}
            key={image.public_id}
            handleImageRemove={handleImageRemove}
          />
        ))}
      </div>
    </div>
  );
};

export default FileUpload;
