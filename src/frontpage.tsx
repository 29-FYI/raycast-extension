import { useEffect, useState } from "react";
import fetch from "node-fetch";
import url from "url";

import { ActionPanel, List, OpenInBrowserAction, showToast, ToastStyle } from "@raycast/api";

type Link = {
  headline: string;
  url: string;
};

const LinkItem = (props: { number: number; link: Link }) => (
  <List.Item
    key={props.number}
    title={props.link.headline}
    icon={props.number + ".png"}
    accessoryTitle={"(" + url.parse(props.link.url).hostname + ")"}
    actions={
      <ActionPanel>
        <OpenInBrowserAction url={props.link.url} />
      </ActionPanel>
    }
  />
);

const Command = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLinks = async () => {
      fetch("https://api.29.fyi")
        .then((resp) => resp.json() as Promise<Link[]>)
        .then((links) => setLinks(links))
        .catch((err) => setError(err))
        .finally(() => setLoading(false));
    };
    fetchLinks();
  }, []);

  if (error) {
    showToast(ToastStyle.Failure, "Failed loading links", error.message);
  }

  return (
    <List isLoading={loading} searchBarPlaceholder="Filter by headline...">
      {links.map((link, index) => (
        <LinkItem number={index + 1} link={link} />
      ))}
    </List>
  );
};

export default Command;
