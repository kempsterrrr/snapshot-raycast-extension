import { List, ActionPanel, Action, useNavigation } from "@raycast/api";
import { getProposals } from "./utils";
import { DetailView } from "./detail";
import { VoteView } from "./vote";

export const Proposals = ({ space }: { space: string }) => {
  const { isLoading, data } = getProposals(space);
  return (
    <List isShowingDetail isLoading={isLoading}>
      {!isLoading
        ? (data as any).data.proposals.map((item: any, index: number) => (
            <List.Item
              key={index}
              title={item.title}
              actions={<Actions link={item.link} item={item} />}
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
};

const Actions = ({ link, item }: { link: string; item: any }) => {
  const { push } = useNavigation();
  return (
    <ActionPanel>
      <Action.OpenInBrowser url={link} />
      <Action title="Detail View" onAction={() => push(<DetailView item={item} />)} />
      {item.state === "active" && <Action title="Vote" onAction={() => push(<VoteView proposal={item} />)} />}
    </ActionPanel>
  );
};
