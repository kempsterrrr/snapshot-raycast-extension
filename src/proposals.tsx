import { List } from "@raycast/api";
import { getProposals } from "./utils";

export const Proposals = ({ space }: { space: string }) => {
  const { isLoading, data } = getProposals(space);
  return (
    <List isShowingDetail isLoading={isLoading}>
      {!isLoading
        ? (data as any).data.proposals.map((item: any, index: number) => (
            <List.Item
              key={index}
              title={item.title}
              //   actions={<Actions item={item} />}
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
