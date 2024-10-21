import type { Site, SocialObjects } from "./types";
import type { GiscusProps } from "@giscus/react";

export const SITE: Site = {
  website: "https://blog.erison.work",
  profile: "https://blog.erison.work", // TODO: I do not know why we need this
  author: "Erison Silva",
  desc: "It's my personal blog, here I'm posting techinical posts and things that I consider intersting to share.",
  title: "erison.work",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 3,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: false,
  editPost: {
    url: "https://github.com/shield-wall/erison-work/edit/master/src/content/blog",
    text: "Suggest Changes",
    appendFilePath: true,
  },
};

export const LOCALE = {
  lang: "en", // html lang code. Set this empty and default will be "en"
  langTag: ["en-EN"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/eerison",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "Facebook",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Facebook`,
    active: false,
  },
  {
    name: "Instagram",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Instagram`,
    active: false,
  },
  {
    name: "X",
    href: "https://x.com/eerison",
    linkTitle: `${SITE.title} on X`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/eerison",
    linkTitle: `${SITE.title} on LinkedIn`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:hey@gmail.com",
    linkTitle: `Send an email to ${SITE.title}`,
    active: true,
  },
];

export const GISCUS: GiscusProps = {
  repo: "shield-wall/erison-work",
  repoId: "R_kgDOJuBh5Q",
  category: "Posts",
  categoryId: "DIC_kwDOJuBh5c4CixZR",
  mapping: "pathname",
  reactionsEnabled: "1",
  emitMetadata: "0",
  inputPosition: "bottom",
  lang: "en",
  loading: "lazy",
};
