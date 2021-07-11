import React from "react";
import { Route, Switch } from "react-router-dom";
import { useAuth } from "../../Providers";
import ProtectedRoute from "./ProtectedRoutes";
import {
  Home,
  CategoryListing,
  CollegeListing,
  CourseListing,
  Auth,
  CollegeForm,
} from "../Views";
export default function Main() {
  const { isAuthenticated } = useAuth();
  return (
    <main>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/admin-auth" exact component={Auth} />
        <ProtectedRoute
          path="/categories"
          exact
          component={CategoryListing}
          isAuthenticated={isAuthenticated}
        />
        <ProtectedRoute
          path="/courses"
          exact
          component={CourseListing}
          isAuthenticated={isAuthenticated}
        />
        <ProtectedRoute
          path="/colleges"
          exact
          component={CollegeListing}
          isAuthenticated={isAuthenticated}
        />
        <ProtectedRoute
          path="/colleges/:collegeId"
          exact
          component={CollegeForm}
          isAuthenticated={isAuthenticated}
        />
      </Switch>
    </main>
  );
}
