import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";
import ApolloClient from "apollo-boost";
import { gql } from "apollo-boost";
import Navigation from "./components/navigation";
import Register from "./pages/auth/Register";
import CompleteRegistration from "./pages/auth/CompleteRegistration";
import Login from "./pages/auth/Login";
import { ApolloProvider } from "@apollo/react-hooks";
import { ToastContainer } from "react-toastify";

// import components
import Home from "./pages/Home";

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
});

const App = () => {
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
      </Switch>
    </ApolloProvider>
  );
};
export default App;
