import { Form, Action, ActionPanel } from "@raycast/api";
import { useState } from "react";

export const Vote = ({ proposal }: { proposal: any }) => {
  const [vote, setVote] = useState("1");
  return (
    <Form actions={<Actions item={proposal} vote={vote} />}>
      <Form.Dropdown id="vote" title="Cast Vote" value={vote} onChange={setVote}>
        {proposal.choices.map((choice: string, index: number) => (
          <Form.Dropdown.Item key={index} value={`${index + 1}`} title={choice} />
        ))}
      </Form.Dropdown>
    </Form>
  );
};

const Actions = ({ item, vote }: { item: any; vote: string }) => {
  return (
    <ActionPanel>
      <Action.OpenInBrowser
        title="Submit vote"
        url={`https://snapshot.org/#/${item.space.id}/proposal/${item.id}?choice=${vote}`}
      />
    </ActionPanel>
  );
};
