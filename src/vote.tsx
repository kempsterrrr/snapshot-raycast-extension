import { useEffect, useState } from "react";
import { SignClient } from "@walletconnect/sign-client";
import { Detail, Action, ActionPanel, Form } from "@raycast/api";
import qrcode from "qrcode";
import os from "os";
import path from "path";

export const VoteView = ({ proposal }: { proposal: any }) => {
  const [signClient, setSignClient] = useState<any>();
  const [sessions, setSessions] = useState<any>([]);
  const [accounts, setAccounts] = useState<any>([]);
  const [markdown, setMarkdown] = useState(`Welcome to snapshot voting`);
  const [vote, setVote] = useState("1");

  async function createClient() {
    try {
      const client = await SignClient.init({
        projectId: "73737107d548a7031fe753269a8ee6b4",
      });
      setSignClient(client);
      console.log("create client run");
    } catch (err) {
      console.log(err);
    }
  }

  function castVote(id: number, proposal: any) {
    console.log("id", id);
    console.log("proposal", proposal);
  }

  async function handleConnect() {
    if (!signClient) throw Error("Cannot connect. Sign client not created");
    try {
      const proposalNamespace = {
        eip155: {
          chains: ["eip155:1"],
          methods: ["eth_sign"],
          events: ["accountsChanged"],
        },
      };
      const { uri, approval } = await signClient.connect({
        requiredNamespaces: proposalNamespace,
      });
      console.log("uri: ", uri);
      if (uri) {
        const tempDir = os.tmpdir();
        const imagePath = path.join(tempDir, "qrcode.png");
        qrcode.toFile(imagePath, uri, { width: 300 }, (error) => {
          if (error) {
            console.log(error.message);
          } else {
            console.log("QR Code saved");
            setMarkdown(`![QR Code](${imagePath}) ${uri}`);
          }
        });
        const sessionNamespace = await approval();
        onSessionConnect(sessionNamespace);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function onSessionConnect(session: any) {
    if (!session) throw Error("session doesn't exist");
    try {
      setSessions(session);
      setAccounts(session.namespaces.eip155.accounts[0].slice(9));
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (!signClient) {
      createClient();
    }
  }, [signClient]);

  useEffect(() => {
    if (signClient) {
      handleConnect();
    }
  }, [signClient]);

  return accounts.length ? (
    <Form actions={<Actions item={proposal} vote={vote} />}>
      //{" "}
      <Form.Dropdown id="vote" title="Cast Vote" value={vote} onChange={setVote}>
        //{" "}
        {proposal.choices.map((choice: string, index: number) => (
          <Form.Dropdown.Item key={index} value={`${index + 1}`} title={choice} />
        ))}
      </Form.Dropdown>
    </Form>
  ) : (
    <Detail markdown={markdown} />
  );
};

// import { Form, Action, ActionPanel } from "@raycast/api";
// import { useState } from "react";

// export const Vote = ({ proposal }: { proposal: any }) => {
//   const [vote, setVote] = useState("1");
//   return (
//     <Form actions={<Actions item={proposal} vote={vote} />}>
//       <Form.Dropdown id="vote" title="Cast Vote" value={vote} onChange={setVote}>
//         {proposal.choices.map((choice: string, index: number) => (
//           <Form.Dropdown.Item key={index} value={`${index + 1}`} title={choice} />
//         ))}
//       </Form.Dropdown>
//     </Form>
//   );
// };

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
