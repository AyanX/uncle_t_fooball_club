import { Helmet } from "react-helmet-async";

const baseUrl = "https://uncletfootballclub.com/";
const defaultImage = `${baseUrl}/og-image.jpg`;

const keywords =
  "football club Ghana, youth football academy Ghana, soccer training Ghana, football programs Ghana, join football club Ghana, football trials Ghana";

const createHelmet = ({
  title,
  description,
  url,
  extraKeywords = "",
}: {
  title: string;
  description: string;
  url: string;
  extraKeywords?: string;
}) => (
  <Helmet>
    {/* Basic */}
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="keywords" content={`${keywords}, ${extraKeywords}`} />
    <meta name="robots" content="index, follow" />
    <meta name="author" content="Uncle T Football Club" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    {/* Open Graph */}
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={url} />
    <meta property="og:image" content={defaultImage} />

    {/* Twitter */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={defaultImage} />

    {/* Geo (helps local SEO) */}
    <meta name="geo.region" content="GH" />
    <meta name="geo.placename" content="Ghana" />

    {/* Canonical */}
    <link rel="canonical" href={url} />
  </Helmet>
);

export const Helmets = {
  home: createHelmet({
    title: "Uncle T FC — African Champions",
    description:
      "Uncle T Football Club is a leading youth football academy in Ghana offering professional training, competitive matches, and talent development programs.",
    url: `${baseUrl}/`,
  }),

  about: createHelmet({
    title: "About Us | Uncle T Football Club Ghana",
    description:
      "Learn about Uncle T Football Club, our mission, vision, and commitment to developing young football talent in Ghana.",
    url: `${baseUrl}/about`,
    extraKeywords: "about football academy Ghana, football development Ghana",
  }),

  team: createHelmet({
    title: "Our Team | Uncle T Football Club Ghana",
    description:
      "Meet the players and coaching staff of Uncle T Football Club, a top youth football academy in Ghana.",
    url: `${baseUrl}/team`,
    extraKeywords: "football team Ghana, youth players Ghana",
  }),

  playerProfile: createHelmet({
    title: "Player Profile | Uncle T Football Club",
    description:
      "Explore player profiles, stats, and performance at Uncle T Football Club Ghana.",
    url: `${baseUrl}/player-profile`,
    extraKeywords: "football player stats Ghana, youth football profiles",
  }),

  fixtures: createHelmet({
    title: "Fixtures & Matches | Uncle T Football Club Ghana",
    description:
      "Stay updated with upcoming fixtures, match schedules, and results of Uncle T Football Club.",
    url: `${baseUrl}/fixtures`,
    extraKeywords: "football fixtures Ghana, match schedule Ghana",
  }),

  news: createHelmet({
    title: "Latest News | Uncle T Football Club Ghana",
    description:
      "Get the latest news, updates, and announcements from Uncle T Football Club Ghana.",
    url: `${baseUrl}/news`,
    extraKeywords: "football news Ghana, academy updates Ghana",
  }),

  programs: createHelmet({
    title: "Football Programs | Uncle T Football Club Ghana",
    description:
      "Join our football training programs designed for youth development, skills training, and competitive play in Ghana.",
    url: `${baseUrl}/programs`,
    extraKeywords: "football training Ghana, youth programs Ghana",
  }),

  gallery: createHelmet({
    title: "Gallery | Uncle T Football Club Ghana",
    description:
      "View photos and highlights from matches, training sessions, and events at Uncle T Football Club.",
    url: `${baseUrl}/gallery`,
    extraKeywords: "football gallery Ghana, soccer photos Ghana",
  }),

  partners: createHelmet({
    title: "Partners | Uncle T Football Club Ghana",
    description:
      "Discover our partners and sponsors supporting youth football development in Ghana.",
    url: `${baseUrl}/partners`,
    extraKeywords: "football sponsors Ghana, academy partners",
  }),

  volunteer: createHelmet({
    title: "Volunteer | Uncle T Football Club Ghana",
    description:
      "Join Uncle T Football Club as a volunteer and support youth football development in Ghana.",
    url: `${baseUrl}/volunteer`,
    extraKeywords: "volunteer football Ghana, sports volunteering Ghana",
  }),

  contact: createHelmet({
    title: "Contact Us | Uncle T Football Club Ghana",
    description:
      "Get in touch with Uncle T Football Club for inquiries, registrations, and partnerships.",
    url: `${baseUrl}/contact`,
    extraKeywords: "contact football club Ghana, join academy Ghana",
  }),
};