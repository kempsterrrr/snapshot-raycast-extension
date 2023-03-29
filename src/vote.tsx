import { useEffect, useState } from "react";
import { Detail, Action, ActionPanel, Form } from "@raycast/api";
import qrcode from "qrcode";
import os from "os";
import path from "path";
import { JsonRpcFetchFunc, Web3Provider } from "@ethersproject/providers";
import fetch from "node-fetch";
import NodeWalletConnect from "@walletconnect/node";
import snapshot from "@snapshot-labs/snapshot.js";

export const VoteView = ({ proposal, spaceId }: { proposal: any; spaceId: string }) => {
  const [markdown, setMarkdown] = useState(`Welcome to snapshot voting`);
  const [walletConnector, setWalletConnector] = useState<NodeWalletConnect>();
  const [accounts, setAccounts] = useState<string[]>();
  const [params, setParams] = useState<any>();
  const [vote, setVote] = useState("1");

  const hub = "https://hub.snapshot.org";
  const client = new snapshot.Client712(hub);

  const web3: JsonRpcFetchFunc = async (method, params) => {
    const url = "https://mainnet.infura.io/v3/9266966958d84ce3b27d57274daad542";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: method,
        params: params,
      }),
    };
    const response = await fetch(url, options);
    const data: any = await response.json();
    if (data.error) {
      throw new Error(data.error.message);
    }
    return data.result;
  };

  function createConnector() {
    const wConnector = new NodeWalletConnect(
      {
        bridge: "https://bridge.walletconnect.org", // Required
      },
      {
        clientMeta: {
          description: "This is snapshot extension on raycast",
          url: "https://developerdao.com",
          icons: ["https://nodejs.org/static/images/logo.svg"],
          name: "snapshot",
        },
      }
    );
    console.log("create connect runs");
    setWalletConnector(wConnector);
  }

  function createSession() {
    walletConnector?.createSession().then(() => {
      console.log("crete session working");
      // get uri for QR Code modal
      const uri = walletConnector.uri;
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
      }
    });
  }

  function getAccounts() {
    walletConnector?.on("connect", (error, payload) => {
      if (error) {
        throw error;
      }
      const { accounts } = payload.params[0];
      console.log("Accounts", payload);
      setParams(payload.params);
      setAccounts(accounts);
    });
  }

  async function castVote() {
    try {
      await client.vote(await web3("", params), accounts![0], {
        space: spaceId,
        proposal: proposal.id,
        type: "single-choice",
        choice: vote,
        reason: "Choice 1 make lot of sense",
        app: "my-app",
      });
    } catch (e) {
      console.log("Voting error: ", e);
    }
  }

  useEffect(() => {
    createConnector();
  }, []);

  useEffect(() => {
    createSession();
  }, [walletConnector]);

  useEffect(() => {
    getAccounts();
  }, [walletConnector]);

  return accounts?.length ? (
    <Form
      actions={
        <ActionPanel>
          <Action title="cast vote" onAction={() => castVote()} />
        </ActionPanel>
      }
    >
      <Form.Dropdown id="vote" title="Cast Vote" value={vote} onChange={setVote}>
        {proposal.choices.map((choice: string, index: number) => (
          <Form.Dropdown.Item key={index} value={`${index + 1}`} title={choice} />
        ))}
      </Form.Dropdown>
    </Form>
  ) : (
    <Detail markdown={markdown} />
  );
};

// const Actions = ({ item, vote }: { item: any; vote: string }) => {
//   return (
//     <ActionPanel>
//       <Action.OpenInBrowser
//         title="Submit vote"
//         url={`https://snapshot.org/#/${item.space.id}/proposal/${item.id}?choice=${vote}`}
//       />
//     </ActionPanel>
//   );
// };
