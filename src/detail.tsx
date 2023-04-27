import { Detail } from "@raycast/api";

export const DetailView = ({ item }: { item: any }) => {
  return <Detail markdown={item.body} />;
};
