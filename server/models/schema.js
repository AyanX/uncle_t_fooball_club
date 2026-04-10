
const {
  mysqlTable,
  primaryKey,
  bigint,
  varchar,
  timestamp,
  unique,
  text,
  boolean,
  longtext,
  int,
  decimal,
  date,
  mediumtext,
  index,
  tinyint,
} = require("drizzle-orm/mysql-core");

const logoTable = mysqlTable("logo", {
    id: int("id").primaryKey().autoincrement(),
    image: varchar("image", { length: 255 }).notNull(),
    blur_image: varchar("blur_image", { length: 255 }),
    created_at: timestamp("created_at").defaultNow(),
    modified_at: timestamp("modified_at").defaultNow().onUpdateNow(),
})


const player= mysqlTable("player", {
  id:int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  position: varchar("position", { length: 255 }).notNull(),
  number: int("number").notNull(),
  nationality: varchar("nationality", { length: 255 }).notNull(),
  age: int("age").notNull(),
  image: varchar("image", { length: 255 }).notNull(),
  blur_image: varchar("blur_image", { length: 255 }).notNull(),
  goals: int("goals").notNull(),
  assists: int("assists").notNull(),
  appearances: int("appearances").notNull(),
  bio: text("bio").notNull(),
  first_team: boolean("first_team").notNull(),
  social_twitter: varchar("social_twitter", { length: 255 }),
  social_instagram: varchar("social_instagram", { length: 255 }),
  created_at: timestamp("created_at").defaultNow(),
  modified_at: timestamp("modified_at").defaultNow().onUpdateNow(),
  isDeleted: boolean("is_deleted").default(false),
});

const newsCategory = mysqlTable("news_category", {
  id: int("id").primaryKey().autoincrement(),
  category: varchar("category", { length: 255 }).notNull(),
  image: varchar("image", { length: 255 }).notNull(),
  isDeleted: boolean("is_deleted").default(false),
  created_at: timestamp("created_at").defaultNow(),
  modified_at: timestamp("modified_at").defaultNow().onUpdateNow(),
});


const fixturesTable = mysqlTable("fixtures", {
  id: int("id").primaryKey().autoincrement(),
  homeTeam: varchar("home_team", { length: 255 }).notNull(),
  awayTeam: varchar("away_team", { length: 255 }).notNull(),
 date: date("date").notNull(),
  time: varchar("time", { length: 255 }).notNull(),
  venue: varchar("venue", { length: 255 }).notNull(),
  competition: varchar("competition", { length: 255 }).notNull(),
  status: varchar("status", { length: 255 }).notNull(),
  homeScore: int("home_score").default(0),
  awayScore: int("away_score").default(0),
  fans: int("fans").notNull().default(0),
  isDeleted: boolean("is_deleted").default(false),
  created_at: timestamp("created_at").defaultNow(),
  modified_at: timestamp("modified_at").defaultNow().onUpdateNow(),
});




const partnersTable = mysqlTable("partners", {  
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 255 }).notNull(),
    logo: varchar("logo", { length: 255 }),
    blur_image: varchar("blur_image", { length: 255 }),
    tier: varchar("tier", { length: 255 }).notNull(),
    website: varchar("website", { length: 255 }),
    description: text("description").notNull(),
    isDeleted: boolean("is_deleted").default(false),
    created_at: timestamp("created_at").defaultNow(),
    modified_at: timestamp("modified_at").defaultNow().onUpdateNow(),
});


const partnerTiersTable = mysqlTable("partner_tiers", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  isDeleted: boolean("is_deleted").default(false),
  created_at: timestamp("created_at").defaultNow(),
  modified_at: timestamp("modified_at").defaultNow().onUpdateNow(),
});

const galleryTable = mysqlTable("gallery", {
    id: int("id").primaryKey().autoincrement(),
    image: varchar("image", { length: 255 }).notNull(),
    caption: text("caption").notNull(),
    blur_image: varchar("blur_image", { length: 255 }),
    category: varchar("category", { length: 255 }).notNull(),
    featured: boolean("featured").default(false),
    isDeleted: boolean("is_deleted").default(false),
    created_at: timestamp("created_at").defaultNow(),
    modified_at: timestamp("modified_at").defaultNow().onUpdateNow(),
})

const galleryCategoryTable = mysqlTable("gallery_category", {
    id: int("id").primaryKey().autoincrement(),
    title: varchar("title", { length: 255 }).notNull(),
    isDeleted: boolean("is_deleted").default(false),
    created_at: timestamp("created_at").defaultNow(),
    modified_at: timestamp("modified_at").defaultNow().onUpdateNow(),
})

const clubStatsTable = mysqlTable("club_stats", {
    id: int("id").primaryKey().autoincrement(),
   label: varchar("label", { length: 255 }).notNull(),
    value: varchar("value", { length: 255 }).notNull(),
    icon:varchar("icon", { length: 255 }),
    isDeleted: boolean("is_deleted").default(false),
    created_at: timestamp("created_at").defaultNow(),
    modified_at: timestamp("modified_at").defaultNow().onUpdateNow(),
})

const clubMilestonesTable = mysqlTable("club_milestones", {
    id: int("id").primaryKey().autoincrement(),
    year: varchar("year", { length: 255 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content").notNull(),
    isDeleted: boolean("is_deleted").default(false),
    created_at: timestamp("created_at").defaultNow(),
    modified_at: timestamp("modified_at").defaultNow().onUpdateNow(),
})


const MissionVissionTable = mysqlTable("mission_vision", {
    id: int("id").primaryKey().autoincrement(),
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content").notNull(),
    isDeleted: boolean("is_deleted").default(false),
    created_at: timestamp("created_at").defaultNow(),
    modified_at: timestamp("modified_at").defaultNow().onUpdateNow(),
})

const managementTable = mysqlTable("management", {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 255 }).notNull(),
    role: varchar("role", { length: 255 }).notNull(),
    image: varchar("image", { length: 255 }),
    blur_image: varchar("blur_image", { length: 255 }),
    isDeleted: boolean("is_deleted").default(false),
    created_at: timestamp("created_at").defaultNow(),
    modified_at: timestamp("modified_at").defaultNow().onUpdateNow(),
})

const socialsTable = mysqlTable("social_links", {
    id: int("id").primaryKey().autoincrement(),
    address: varchar("address", { length: 255 }).notNull(),
    phone_number: varchar("phone_number", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    open_hours: varchar("open_hours", { length: 255 }).notNull(),
    close_hours: varchar("close_hours", { length: 255 }).notNull(),
    open_day: varchar("open_day", { length: 255 }).notNull(),
    close_day: varchar("close_day", { length: 255 }).notNull(),
    location: varchar("location", { length: 255 }).notNull(),
    twitter: varchar("twitter", { length: 255 }),
    facebook: varchar("facebook", { length: 255 }),
    instagram: varchar("instagram", { length: 255 }),
    youtube: varchar("youtube", { length: 255 }),
    isDeleted: boolean("is_deleted").default(false),
    created_at: timestamp("created_at").defaultNow(),
    modified_at: timestamp("modified_at").defaultNow().onUpdateNow(),
})

const programTitlesTable = mysqlTable("program_titles", {
    id: int("id").primaryKey().autoincrement(),
    title: varchar("title", { length: 255 }).notNull(),
    isDeleted: boolean("is_deleted").default(false),
    created_at: timestamp("created_at").defaultNow(),
    modified_at: timestamp("modified_at").defaultNow().onUpdateNow(),
})


const newsTable = mysqlTable("news", {
    id: int("id").primaryKey().autoincrement(),
    slug: varchar("slug", { length: 255 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    excerpt: text("excerpt").notNull(),
    content: longtext("content").notNull(),
    image: varchar("image", { length: 255 }).notNull(),
    blur_image: varchar("blur_image", { length: 255 }),
    category :varchar("category", { length: 255 }).notNull(),
    author: varchar("author", { length: 255 }).notNull(),
    date: date("date").notNull(),
    readTime: varchar("read_time", { length: 255 }).notNull(),
    featured: boolean("featured").default(false),
    isDeleted: boolean("is_deleted").default(false),
    created_at: timestamp("created_at").defaultNow(),
    modified_at: timestamp("modified_at").defaultNow().onUpdateNow(),
})

const programsTable = mysqlTable("programs", {
    id: int("id").primaryKey().autoincrement(),
    slug: varchar("slug", { length: 255 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    tagline: varchar("tagline", { length: 255 }).notNull(),
    description: text("description").notNull(),
    longDescription: longtext("long_description").notNull(),
    image: varchar("image", { length: 255 }).notNull(),
    blur_image: varchar("blur_image", { length: 255 }).notNull(),
    icon: varchar("icon", { length: 255 }),
    color: varchar("color", { length: 255 }),
    stats: text("stats").notNull(), // Store as JSON string
    highlights: text("highlights").notNull(), // Store as JSON string
    isDeleted: boolean("is_deleted").default(false),
    created_at: timestamp("created_at").defaultNow(),
    modified_at: timestamp("modified_at").defaultNow().onUpdateNow(),
})

const adminProfileTable = mysqlTable("admin_profile", {
    id: int("id").primaryKey().autoincrement(),
    username: varchar("username", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    created_at: timestamp("created_at").defaultNow(),
    modified_at: timestamp("modified_at").defaultNow().onUpdateNow(),
})

const viewsTable = mysqlTable("views", {
    id: int("id").primaryKey().autoincrement(),
    newsId: int("news_id").notNull(),
    views: int("views").notNull().default(0),
    created_at: timestamp("created_at").defaultNow(),
    modified_at: timestamp("modified_at").defaultNow().onUpdateNow(),
})

const adminLoginDetails = mysqlTable("admin_login_details", {
    id: int("id").primaryKey().autoincrement(),
    pin:varchar("pin", { length: 255 }).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    created_at: timestamp("created_at").defaultNow(),
    modified_at: timestamp("modified_at").defaultNow().onUpdateNow(),
})
//   { id: 1, newsId: 1, views: 1540 }, { id: 2, newsId: 2, views: 892 },
const clicksTable = mysqlTable("clicks", {
    id: int("id").primaryKey().autoincrement(),
    newsId: int("news_id").notNull(),
    views: int("views").notNull().default(0),
    isDeleted: boolean("is_deleted").default(false),
    created_at: timestamp("created_at").defaultNow(),
    modified_at: timestamp("modified_at").defaultNow().onUpdateNow(),
})

const teamNameTable = mysqlTable("team_name", {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 255 }).notNull(),
    isDeleted: boolean("is_deleted").default(false),
    created_at: timestamp("created_at").defaultNow(),
    modified_at: timestamp("modified_at").defaultNow().onUpdateNow(),
})

// location
// : 
// "nairobi  kenya"



const messagesTable = mysqlTable("messages", {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone_number: varchar("phone_number", { length: 255 }).notNull(),
    subject: varchar("subject", { length: 255 }).notNull(),
    location: varchar("location", { length: 255 }).notNull(),
    isRead: boolean("is_read").default(false),
    message: text("message").notNull(),
    isDeleted: boolean("is_deleted").default(false),
    created_at: timestamp("created_at").defaultNow(),
    modified_at: timestamp("modified_at").defaultNow().onUpdateNow(),
})


module.exports = {
    messagesTable,
    adminProfileTable,
    clicksTable,
    viewsTable,
    teamNameTable,
adminLoginDetails,
  player,
  managementTable,
  logoTable,
  newsCategory,
  fixturesTable,
  partnersTable,
  partnerTiersTable,
    galleryTable,
    galleryCategoryTable,
    clubStatsTable,
    clubMilestonesTable,
    newsTable,
    MissionVissionTable,
    socialsTable,
    programsTable,
    programTitlesTable,
};
