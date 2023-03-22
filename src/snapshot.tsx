import { useState, useEffect } from "react";
import { Action, ActionPanel, List, useNavigation } from "@raycast/api";
import { getSnapshotSpaces } from "./utils";
import { SnapshotSpaceType } from "./types";
import { Proposals } from "./proposals";

// Creating a new query-client which we will use
// in our QueryClientProvider that can be accessed
// from anywhere in the app.
export default function Command() {
  const [searchSpace, setSearchSpace] = useState("");
  const [spaces, setSpaces] = useState<SnapshotSpaceType[]>([]);
  const [isDataLoading, setDataLoading] = useState(true);

  const { isLoading, data } = getSnapshotSpaces();

  function extractObjects(obj: any) {
    setDataLoading(true);
    const arrspaces: SnapshotSpaceType[] = [];
    Object.keys(obj).forEach((key) => {
      arrspaces.push({ ...obj[key], id: key });
    });

    setDataLoading(false);
    setSpaces(
      arrspaces.filter((space) => space.followers && space.followers > 0).sort((a, b) => b.followers - a.followers)
    );
  }

  useEffect(() => {
    if (!isLoading) {
      extractObjects((data as any).spaces);
    }
  }, [data, isLoading]);

  useEffect(() => {
    if (searchSpace.length > 0) {
      const filteredSpaces = spaces.filter(
        (space) =>
          space.name.toLocaleLowerCase().includes(searchSpace.toLocaleLowerCase()) ||
          space.id.toLocaleLowerCase().includes(searchSpace.toLocaleLowerCase())
      );
      console.log(filteredSpaces);
      setSpaces(filteredSpaces);
    } else {
      extractObjects((data as any).spaces);
    }
  }, [searchSpace, data]);

  return (
    <List isShowingDetail isLoading={isDataLoading} searchText={searchSpace} onSearchTextChange={setSearchSpace}>
      {!isDataLoading
        ? spaces?.slice(0, 100).map((item: SnapshotSpaceType) => (
            <List.Item
              key={item.id}
              title={item.name}
              actions={<Actions space={item.id} />}
              subtitle={item.id}
              icon={{
                source: "../assets/extension_icon.png",
              }}
              detail={
                <List.Item.Detail
                  // markdown={`# ${item.title}`}
                  metadata={
                    <List.Item.Detail.Metadata>
                      <List.Item.Detail.Metadata.Label title="Followers" text={`${item.followers}`} />
                      {/* <List.Item.Detail.Metadata.Label title="Symbol" text={item.symbol} /> */}
                      {/* <List.Item.Detail.Metadata.Label title="About" text={item.about} /> */}
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
