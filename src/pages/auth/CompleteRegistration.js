import React, { useState, useEffect, useContext } from "react";
import { auth } from "../../firebase";

import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import AuthForm from "../../components/forms/AuthForm";

const USER_CREATE = gql`
  mutation userCreate {
    userCreate {
      username
      email
    }
  }
`; // parse USER_CREATE as an argument

const CompeleteRegistration = () => {
  const { dispatch } = useContext(AuthContext); // useContext
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  let history = useHistory();

  useEffect(() => {
    setEmail(window.localStorage.getItem("emailForRegistration"));
  }, [history]); // this function will run when: didmount & the value of history change

  const [userCreate] = useMutation(USER_CREATE);

  const handleSubmit = async (e) => {
    //
    e.preventDefault();
    setLoading(true);
    // validation
    if (!email || !password) {
      toast.error("Email and password is required");
      return;
    }
    try {
      const result = await auth.signInWithEmailLink(
        email,
        window.location.href
      );
      if (result.user.emailVerified) {
        // First: remove email from local storage
        window.localStorage.removeItem("emailForRegistration");
        let user = auth.currentUser;
        await user.updatePassword(password);

        // dispatch user with token and email
        // then redirect
        const idTokenResult = await user.getIdTokenResult();
        dispatch({
          type: "LOGGED_IN_USER",
          payload: {
            email: user.email,
            token: idTokenResult.token,
          },
        });

        // make api request to save/update user in mongoDB
        userCreate();

        history.push("/profile");
      }
      //console.log("Email:", email);
      //console.log("Link:", window.location.href);
      //console.log("Result:", result);
    } catch (error) {
      console.log("Register complete error", error.message);
      setLoading(false);
      toast.error("error.message");
    }
  };

  return (
    <div className=" container p-5">
      {loading ? (
        <h4 className="text-danger">Loading...</h4>
      ) : (
        <h4>Complete your registration</h4>
      )}
      <AuthForm
        email={email}
        loading={loading}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
        showPasswordInput="true"
      />
    </div>
  );
};

export default CompeleteRegistration;
