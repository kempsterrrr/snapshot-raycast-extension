import { useState } from "react";
import { Action, ActionPanel, List, useNavigation } from "@raycast/api";
import { getSpaces } from "./utils";
import { space } from "./types";
import { Proposals } from "./proposals";

// Creating a new query-client which we will use
// in our QueryClientProvider that can be accessed
// from anywhere in the app.
export default function Command() {
  const [searchSpace, setSearchSpace] = useState("");

  const { isLoading: isSpaceLoading, data: spaceData } = getSpaces(searchSpace);

  return (
    <List isShowingDetail isLoading={isSpaceLoading} onSearchTextChange={setSearchSpace}>
      {!isSpaceLoading
        ? spaceData.data.spaces.map((item: space) => (
            <List.Item
              key={item.id}
              title={item.name}
              actions={<Actions space={item.id} />}
              subtitle={item.symbol}
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
                      <List.Item.Detail.Metadata.Label title="Symbol" text={item.symbol} />
                      <List.Item.Detail.Metadata.Label title="About" text={item.about} />
                      {/* <List.Item.Detail.Metadata.Label title="Start Date" text={item.author} /> */}
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

function Actions({ space }: { space: string }) {
  const { push } = useNavigation();

  return (
    <ActionPanel>
      <Action title="Push" onAction={() => push(<Proposals space={space} />)} />
    </ActionPanel>
  );
}
