export type PublicationItemProps = {
  title: string;
  authors: string[];
  conference: string;
  type: "journal" | "proceedings" | string;
  award?: string | null;
  link_acm?: string;
  link_ieee?: string;
  link_project?: string;
  link_pdf?: string;
  link_us_patent?: string;
  link_youtube?: string;
  link_arxiv?: string;
  link_github?: string;
  link_image?: string;
  abstract?: string;
  featured: boolean;
};

export type PublicationItemList = {
  publications: PublicationItemProps[];
};
