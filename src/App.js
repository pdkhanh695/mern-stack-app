import React, { useState, useContext } from "react";
import { Switch, Route } from "react-router-dom";
import ApolloClient from "apollo-boost";
import { gql } from "apollo-boost";
import Navigation from "./components/navigation";
import Register from "./pages/auth/Register";
import PasswordUpdate from "./pages/auth/PasswordUpdate";
import Profile from "./pages/auth/Profile";
import CompleteRegistration from "./pages/auth/CompleteRegistration";
import Login from "./pages/auth/Login";
import { ApolloProvider } from "@apollo/react-hooks";
import { ToastContainer } from "react-toastify";

import { AuthContext } from "./context/authContext";

import PrivateRoute from "./components/PrivateRoute";

import Post from "./pages/post/Post";

// import components
import Home from "./pages/Home";

const App = () => {
  const { state } = useContext(AuthContext);
  //destructure to make it easier
  const { user } = state;
  console.log("the value of state: ", state);
  console.log("the value of user: ", user);
  const client = new ApolloClient({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
    request: (operation) => {
      operation.setContext({
        headers: {
          authToken: user ? user.token : "", // if user is not '' => sent user token
        },
      });
    },
  });

  return (
    <ApolloProvider client={client}>
      <Navigation />
      <ToastContainer />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route
          exact
          path="/complete-registration"
          component={CompleteRegistration}
        />
        <PrivateRoute
          exact
          path="/password/update"
          component={PasswordUpdate}
        />
        <PrivateRoute exact path="/profile" component={Profile} />
        <PrivateRoute exact path="/post/create" component={Post} />
      </Switch>
    </ApolloProvider>
  );
};
export default App;
