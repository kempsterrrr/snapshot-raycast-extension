import { Action, ActionPanel, Form, Icon, List } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { useState, useEffect } from "react";

const SNAPSHOT_ENDPOINT = `https://hub.snapshot.org/graphql`;

// Creating a new query-client which we will use
// in our QueryClientProvider that can be accessed
// from anywhere in the app.

export default function Command() {
  const { isLoading, data } = useFetch(`https://hub.snapshot.org/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: ` {
        proposals(where: {space:"devdao.eth"} ) {
          snapshot
          author
          title
          link
          state
          choices
          scores
          strategies {
            name
          }
          symbol
        }
      }`,
    }),
    keepPreviousData: false,
  });

  return (
    <List isShowingDetail isLoading={isLoading}>
      {!isLoading
        ? data.data.proposals.map((item, index) => (
            <List.Item
              key={index}
              title={item.title}
              actions={<Actions item={item} />}
              subtitle={item.state}
              icon={{
                source: "../assets/extension_icon.png",
              }}
              detail={
                <List.Item.Detail
                  // markdown={`# ${item.title}`}
                  metadata={
                    <List.Item.Detail.Metadata>
                      <List.Item.Detail.Metadata.Label
                        title="Strategy"
                        text={`${item.strategies[0].name} ${item.symbol}`}
                      />
                      <List.Item.Detail.Metadata.Label title="State" text={item.state} />
                      <List.Item.Detail.Metadata.Label title="Author" text={item.author} />
                      <List.Item.Detail.Metadata.Label title="Start Date" text={item.author} />
                      <List.Item.Detail.Metadata.Separator />
                    </List.Item.Detail.Metadata>
                  }
                />
              }
            />
          ))
        : null}
    </List>
  );
}

function Actions(props: { item }) {
  return (
    <ActionPanel title={props.item.title}>
      <ActionPanel.Section>{props.item.link && <Action.OpenInBrowser url={props.item.link} />}</ActionPanel.Section>
      <ActionPanel.Section>
        {props.item.link && (
          <Action.CopyToClipboard
            content={props.item.link}
            title="Copy Link"
            shortcut={{ modifiers: ["cmd"], key: "." }}
          />
        )}
      </ActionPanel.Section>
    </ActionPanel>
  );
}
