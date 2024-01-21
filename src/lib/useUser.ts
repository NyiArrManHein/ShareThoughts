import useSWR, { KeyedMutator } from "swr";
import { User } from "./models";

const fetcher = (url: RequestInfo | URL) =>
  fetch(url).then((res) => res.json());

export default function useUser() {
  const {
    data,
    error,
    isLoading,
    mutate,
  }: {
    data: { user: User | undefined; isLoggedIn: boolean; message: string };
    error: any;
    isLoading: boolean;
    mutate: KeyedMutator<any>;
  } = useSWR("/api/users/getcookie", fetcher);

  return {
    data: data,
    isLoading,
    isError: error,
    mutateUser: mutate,
  };
}
