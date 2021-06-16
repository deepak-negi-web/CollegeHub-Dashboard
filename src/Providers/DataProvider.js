import React from "react";
import {
  split,
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import { SubscriptionClient } from "subscriptions-transport-ws";

export const DataProvider = ({ children }) => {
  const wssClient = new SubscriptionClient(
    process.env.REACT_APP_DATAHUB_SUBSCRIPTIONS_URL,
    {
      reconnect: true,
      connectionParams: {
        headers: {
          "content-type": "application/json",
          "x-hasura-admin-secret": process.env.REACT_APP_DATAHUB_ADMIN_SECRET,
        },
      },
    }
  );
  const wssLink = new WebSocketLink(wssClient);
  const authLink = new ApolloLink((operation, forward) => {
    operation.setContext(({ _, headers }) => ({
      headers: {
        ...headers,
        "x-hasura-admin-secret": process.env.REACT_APP_DATAHUB_ADMIN_SECRET,
      },
    }));
    return forward(operation);
  });
  const httpLink = createHttpLink({
    uri: `${process.env.REACT_APP_DATAHUB_URL}`,
  });

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wssLink,
    authLink.concat(httpLink)
  );

  const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
