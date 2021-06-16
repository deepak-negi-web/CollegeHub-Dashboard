import React from "react";
import { Route, Switch } from "react-router-dom";
import { Home, CategoryListing, CollegeListing, CourseListing } from "../Views";
export default function Main() {
  return (
    <main>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/categories" exact component={CategoryListing} />
        <Route path="/courses" exact component={CourseListing} />
        <Route path="/colleges" exact component={CollegeListing} />
      </Switch>
    </main>
  );
}
