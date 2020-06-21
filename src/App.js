import React, { useState, useContext } from "react";
import { Switch, Route } from "react-router-dom";
import ApolloClient from "apollo-boost";
import { gql } from "apollo-boost";
import Navigation from "./components/navigation";
import Register from "./pages/auth/Register";
import PasswordUpdate from "./pages/auth/PasswordUpdate";
import PasswordForgot from "./pages/auth/PasswordForgot";
import Profile from "./pages/auth/Profile";
import CompleteRegistration from "./pages/auth/CompleteRegistration";
import Login from "./pages/auth/Login";
import { ApolloProvider } from "@apollo/react-hooks";
import { ToastContainer } from "react-toastify";

import { AuthContext } from "./context/authContext";

import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";

import Post from "./pages/post/Post";
import Home from "./pages/Home";
import Users from "./pages/Users";
import SigleUser from "./pages/SingleUser";

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
        <Route exact path="/users" component={Users} />
        <PublicRoute exact path="/register" component={Register} />
        <PublicRoute exact path="/login" component={Login} />
        <Route exact path="/password/forgot" component={PasswordForgot} />
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
        <Route exact path="/user/:username" component={SigleUser} />
      </Switch>
    </ApolloProvider>
  );
};

export default App;
