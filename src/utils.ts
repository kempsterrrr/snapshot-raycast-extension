import { useFetch } from "@raycast/utils";
import snapshot from "@snapshot-labs/snapshot.js";

const SNAPSHOT_ENDPOINT = `https://hub.snapshot.org/graphql`;

export const ProposalBaseUrl = "https://snapshot.org/#/";

// const hub = "https://hub.snapshot.org";
// const client = new snapshot.Client712(hub);

// const provide = new JsonRpcProvider("https://mainnet.infura.io/v3/cf55dddaff4d43e6992bc8a49bf097cc");
// const signer = provide.getSigner();

// export const castVote = async() => {
//   const receipt = await client.vote(signer, address, {
//     space: proposal.space.id

//   })
// }

export const getSpaces = (id: string) => {
  const { isLoading, data, error } = useFetch(SNAPSHOT_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `{
        spaces(
          first: 100
          ${id.length > 4 ? `where: {id: "${id}"}` : ""}
          orderDirection: desc
        ) {
          id
          name
          about
          network
          symbol
          strategies {
            name
            network
            params
          }
          admins
          moderators
          members
          filters {
            minScore
            onlyMembers
          }
          plugins
        }
    }`,
    }),
    keepPreviousData: true,
  });
  return { isLoading, data, error };
};

export const getProposals = (space: string) => {
  const { isLoading, data, error } = useFetch(SNAPSHOT_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: ` {
        proposals(where: {space:"${space}"} ) {
          id
          snapshot
          author
          title
          body
          link
          state
          choices
          scores
          space {
            id
          }
          strategies {
            name
          }
          symbol
        }
      }`,
    }),
    keepPreviousData: false,
  });
  return { isLoading, data, error };
};

export const getSnapshotSpaces = () => {
  const { isLoading, data, error } = useFetch("https://hub.snapshot.org/api/explore", {
    keepPreviousData: true,
  });
  // console.log("fetching spaces: ", data);
  return { isLoading, data, error };
};
