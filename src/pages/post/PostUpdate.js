import React, { useState, useMemo, useEffect } from "react";
import { toast } from "react-toastify";
import { useLazyQuery, useQuery, useMutation } from "@apollo/react-hooks";
import { SINGLE_POST } from "../../graphql/queries";
import { POST_UPDATE } from "../../graphql/mutations";
import omitDeep from "omit-deep";
import { useParams } from "react-router-dom";
import FileUpload from "../../components/forms/FileUpload";

const PostUpdate = () => {
  const [values, setValues] = useState({
    content: "",
    image: {
      url: "",
      public_id: "",
    },
  });
  const [getSinglePost, { data: singlePost }] = useLazyQuery(SINGLE_POST);
  const [postUpdate] = useMutation(POST_UPDATE);

  const [loading, setLoading] = useState(false);
  //router
  const { postid } = useParams(); //params.postid
  const { content, image } = values;
  useMemo(() => {
    if (singlePost) {
      setValues({
        ...values,
        _id: singlePost.singlePost._id,
        content: singlePost.singlePost.content,
        image: omitDeep(singlePost.singlePost.image, ["__typename"]), //remove typename from image
      });
    }
  }, [singlePost]);

  useEffect(() => {
    getSinglePost({ variables: { postId: postid } });
  }, []);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);
    postUpdate({ variables: { input: values } });
    setLoading(false);
    toast.success("Post Updated");
  };
  const updateForm = () => (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={handleChange}
        name="content"
        rows="10"
        className="md-textarea form-control"
        placeholder="Write something..."
        maxLength="150"
        disabled={loading}
      ></textarea>

      <button
        className="btn btn-primary"
        type="submit"
        disabled={loading || !content}
      >
        Post
      </button>
    </form>
  );
  return (
    <div className="container p-5">
      {loading ? <h4 className="text-danger">Loading...</h4> : <h4>Update</h4>}
      <FileUpload
        values={values}
        loading={loading}
        setValues={setValues}
        setLoading={setLoading}
        singleUpload={true}
      />
      {updateForm()}
    </div>
  );
};

export default PostUpdate;
