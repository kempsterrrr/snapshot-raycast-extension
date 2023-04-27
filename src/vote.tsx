import { useEffect, useState } from "react";
import { Detail, Action, ActionPanel, Form } from "@raycast/api";
import qrcode from "qrcode";
import Web3 from "web3";
import { HttpProvider } from "web3-providers";
import os from "os";
import path from "path";
import { JsonRpcFetchFunc, Web3Provider } from "@ethersproject/providers";
import fetch from "node-fetch";
import NodeWalletConnect from "@walletconnect/node";
import snapshot from "@snapshot-labs/snapshot.js";
import { Wallet } from "@ethersproject/wallet";

export const VoteView = ({ proposal, spaceId }: { proposal: any; spaceId: string }) => {
  const [markdown, setMarkdown] = useState(`Welcome to snapshot voting`);
  const [walletConnector, setWalletConnector] = useState<NodeWalletConnect>();
  const [accounts, setAccounts] = useState<string[]>();
  const [params, setParams] = useState<any>();
  const [vote, setVote] = useState("1");

  // const hub = "https://hub.snapshot.org";
  const hub = "https://testnet.hub.snapshot.org";
  const client = new snapshot.Client712(hub);
  console.log("client: ", client);

  // const JsonRpc: JsonRpcFetchFunc = async () => {
  //   const url = "https://mainnet.infura.io/v3/3805867acca24d4188b7e2e14df6f39b";
  //   const options = {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       jsonrpc: "2.0",
  //       id: 1,
  //       method: method,
  //       params: params,
  //     }),
  //   };
  //   console.log("Methods: %d and Params: %s", method, params);
  //   const response = await fetch(url, options);
  //   const data: any = await response.json();
  //   if (data.error) {
  //     throw new Error(data.error.message);
  //   }
  //   console.log("data.result: ", data.result);
  //   return data.result;
  // };

  // const web3 = new Web3Provider(JsonRpc);
  // const web3 = new Web3Provider(JsonRpc);

  // const web3Provider = new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/3805867acca24d4188b7e2e14df6f39b");
  const provider = snapshot.utils.getProvider("1");
  const web3 = new Web3Provider(provider);
  console.log("Provider: ", provider);

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
    const voteResult = await client.vote(web3, "0x38D9cFf58D233AF0B9c1434EEDE012009D23c971", {
      space: spaceId,
      proposal: proposal.id,
      timestamp: Date.now(),
      type: "single-choice",
      choice: vote,
      reason: "Choice 1 make lot of sense",
      app: "snapshot-extension",
    });
    console.log("voteResult: ", voteResult);
  }

  useEffect(() => {
    createConnector();
  }, []);

  useEffect(() => {
    setMarkdown(`Welcome to snapshot voting`);
    createSession();
  }, [walletConnector]);

  useEffect(() => {
    getAccounts();
  }, [walletConnector]);

  useEffect(() => {
    if (accounts?.length) {
      console.log("Account", accounts[0]);
    }
  }, [accounts]);

  return accounts?.length ? (
    <Form
      actions={
        <ActionPanel>
          <Action
            title="cast vote"
            onAction={() => {
              castVote();
              console.log("voting");
            }}
          />
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
    <Detail
      actions={
        <ActionPanel>
          <Action.CopyToClipboard title="copy qrcode" content={markdown.split(" ")[2]} />
        </ActionPanel>
      }
      markdown={markdown}
    />
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
