import { useFetch } from "@raycast/utils";
import { Proposal } from "./types";

// const SNAPSHOT_ENDPOINT = `https://hub.snapshot.org/graphql`;
const SNAPSHOT_ENDPOINT = `https://testnet.snapshot.org/graphql`;

// export const ProposalBaseUrl = "https://snapshot.org/#/";
export const ProposalBaseUrl = "https://testnet.snapshot.org/#/";

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
  const typeData = data as Proposal[];
  return { isLoading, data: typeData, error };
};

export const getSnapshotSpaces = () => {
  const { isLoading, data, error } = useFetch("https://testnet.snapshot.org/api/explore", {
    keepPreviousData: false,
  });
  // console.log("fetching spaces: ", data);
  return { isLoading, data, error };
};
