import { useFetch } from "@raycast/utils";

const SNAPSHOT_ENDPOINT = `https://hub.snapshot.org/graphql`;

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
          snapshot
          author
          title
          link
          state
          choices
          scores
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
