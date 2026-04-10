// =============================================================================
// dummyData.ts — All static fallback data for Uncle T FC
// IDs are now integers. Added: featured, first_team, fans, blur_image on mgmt
// =============================================================================

export interface Player {
  id: number;
  name: string;
  slug: string;
  position: string;
  number: number;
  nationality: string;
  age: number;
  image: string;
  blur_image: string;
  goals: number;
  assists: number;
  appearances: number;
  bio: string;
  first_team: boolean;
  social?: { twitter?: string; instagram?: string };
}

export interface NewsItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  blur_image: string;
  category: string;
  author: string;
  date: string;
  readTime: number;
  featured: boolean;
}

export interface NewsCategory {
  id: number;
  category: string;
  image: string;
}

export interface Fixture {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo: string;
  awayTeamLogo: string;
  date: string;
  time: string;
  venue: string;
  competition: string;
  status: 'upcoming' | 'completed' | 'live';
  homeScore?: number;
  awayScore?: number;
  fans: number;
}

export interface Program {
  id: number;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  image: string;
  blur_image: string;
  icon: string;
  color: string;
  stats: { label: string; value: string }[];
  highlights: string[];
}

export interface ProgramTitle {
  id: number;
  title: string;
}

export interface Partner {
  id: number;
  name: string;
  logo: string;
  blur_image: string;
  tier: string;
  website?: string;
  description: string;
}

export interface PartnerTier {
  id: number;
  name: string;
}

export interface GalleryItem {
  id: number;
  image: string;
  blur_image: string;
  caption: string;
  category: string;
  featured: boolean;
}

export interface GalleryCategory {
  id: number;
  title: string;
}

export interface ClubStat {
  id: number;
  label: string;
  value: string;
  icon: string;
}

export interface MissionVisionItem {
  id: number;
  title: string;
  content: string;
}

export interface Milestone {
  id: number;
  year: string;
  title: string;
  content: string;
}

export interface Management {
  id: number;
  name: string;
  role: string;
  image: string;
  blur_image: string;
}

export interface SocialInfo {
  address: string;
  phone_number: string;
  email: string;
  open_hours: string;
  close_hours: string;
  open_day: string;
  close_day: string;
  location: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
}

// --- Players ---
export const dummyPlayers: Player[] = [
  { id: 1, slug: 'kofi-mensah', name: 'Kofi Mensah', position: 'Goalkeeper', number: 1, nationality: 'Ghana', age: 28, image: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=600', blur_image: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=20', goals: 0, assists: 2, appearances: 32, bio: 'Kofi Mensah is one of the most commanding goalkeepers in East African football.', first_team: true },
  { id: 2, slug: 'amara-diallo', name: 'Amara Diallo', position: 'Defender', number: 4, nationality: 'Senegal', age: 25, image: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=600', blur_image: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=20', goals: 3, assists: 5, appearances: 30, bio: 'A powerhouse centre-back who reads the game with exceptional intelligence.', first_team: true },
  { id: 3, slug: 'chidi-okonkwo', name: 'Chidi Okonkwo', position: 'Defender', number: 5, nationality: 'Nigeria', age: 27, image: 'https://images.pexels.com/photos/3622622/pexels-photo-3622622.jpeg?auto=compress&cs=tinysrgb&w=600', blur_image: 'https://images.pexels.com/photos/3622622/pexels-photo-3622622.jpeg?auto=compress&cs=tinysrgb&w=20', goals: 1, assists: 4, appearances: 28, bio: 'Chidi brings pace and tenacity to the Uncle T backline.', first_team: true },
  { id: 4, slug: 'hassan-omar', name: 'Hassan Omar', position: 'Midfielder', number: 8, nationality: 'Tanzania', age: 24, image: 'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=600', blur_image: 'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=20', goals: 7, assists: 12, appearances: 34, bio: 'The local hero and heartbeat of Uncle T FC\'s midfield.', first_team: true },
  { id: 5, slug: 'kwame-asante', name: 'Kwame Asante', position: 'Midfielder', number: 10, nationality: 'Ghana', age: 26, image: 'https://images.pexels.com/photos/3148452/pexels-photo-3148452.jpeg?auto=compress&cs=tinysrgb&w=600', blur_image: 'https://images.pexels.com/photos/3148452/pexels-photo-3148452.jpeg?auto=compress&cs=tinysrgb&w=20', goals: 11, assists: 9, appearances: 33, bio: 'The creative playmaker wearing the prestigious number 10.', first_team: true, social: { twitter: '@kwameasante10', instagram: '@kwame_asante' } },
  { id: 6, slug: 'ibrahima-balde', name: 'Ibrahima Baldé', position: 'Forward', number: 9, nationality: 'Guinea', age: 23, image: 'https://images.pexels.com/photos/2346/sport-glass-jump-fitness.jpg?auto=compress&cs=tinysrgb&w=600', blur_image: 'https://images.pexels.com/photos/2346/sport-glass-jump-fitness.jpg?auto=compress&cs=tinysrgb&w=20', goals: 22, assists: 6, appearances: 34, bio: 'The club top scorer and a nightmare for opposing defenders.', first_team: true, social: { twitter: '@ibrabalde9' } },
  { id: 7, slug: 'tunde-adebayo', name: 'Tunde Adebayo', position: 'Forward', number: 11, nationality: 'Nigeria', age: 22, image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=600', blur_image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=20', goals: 15, assists: 11, appearances: 31, bio: 'A winger who terrorises full-backs with directness and pace.', first_team: true },
  { id: 8, slug: 'seun-alabi', name: 'Seun Alabi', position: 'Midfielder', number: 6, nationality: 'Nigeria', age: 29, image: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=600', blur_image: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=20', goals: 4, assists: 8, appearances: 29, bio: 'The defensive midfielder who protects the backline with tireless energy.', first_team: true },
  { id: 9, slug: 'david-mwangi', name: 'David Mwangi', position: 'Defender', number: 3, nationality: 'Kenya', age: 21, image: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=600', blur_image: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=20', goals: 0, assists: 3, appearances: 18, bio: 'Young left back with tremendous energy and composure.', first_team: false },
  { id: 10, slug: 'emeka-eze', name: 'Emeka Eze', position: 'Midfielder', number: 14, nationality: 'Nigeria', age: 20, image: 'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=600', blur_image: 'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=20', goals: 2, assists: 4, appearances: 14, bio: 'An exciting young central midfielder full of promise.', first_team: false },
  { id: 11, slug: 'peter-njoroge', name: 'Peter Njoroge', position: 'Forward', number: 17, nationality: 'Kenya', age: 19, image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=600', blur_image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=20', goals: 5, assists: 2, appearances: 12, bio: 'Fast and direct striker from the academy ranks.', first_team: false },
  { id: 12, slug: 'ali-hassan', name: 'Ali Hassan', position: 'Goalkeeper', number: 22, nationality: 'Tanzania', age: 24, image: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=600', blur_image: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=20', goals: 0, assists: 0, appearances: 5, bio: 'Reliable backup goalkeeper with excellent reflexes.', first_team: false },
];

// --- News ---
export const dummyNews: NewsItem[] = [
  { id: 1, slug: 'Uncle T-fc-wins-east-african-cup', title: 'Uncle T FC Wins the East African Champions Cup in Dramatic Fashion', excerpt: 'A late header from Ibrahima Baldé sealed a 2-1 victory for Uncle T FC as they claimed their third East African Champions Cup title.', content: '<p>Uncle T FC produced one of the most dramatic finals in recent memory, coming from behind to defeat Nairobi City Stars 2-1 in the East African Champions Cup final.</p><p>The hosts opened the scoring in the 23rd minute through a well-worked team move, but the green and gold equalised before half time when Kwame Asante\'s pinpoint free kick found the back of the net.</p><p>With the match heading towards extra time, substitute Ibrahima Baldé rose highest to meet a Hassan Omar corner in the 89th minute, sending the thousands of travelling supporters into absolute delirium.</p>', image: 'https://images.pexels.com/photos/1366913/pexels-photo-1366913.jpeg?auto=compress&cs=tinysrgb&w=800', blur_image: 'https://images.pexels.com/photos/1366913/pexels-photo-1366913.jpeg?auto=compress&cs=tinysrgb&w=20', category: 'Match Report', author: 'James Kariuki', date: '2024-03-15', readTime: 4, featured: true },
  { id: 2, slug: 'kwame-asante-player-of-the-month', title: 'Kwame Asante Named East Africa Player of the Month for February', excerpt: 'The Uncle T FC playmaker has been recognised for his outstanding performances in February, scoring 5 goals and providing 4 assists.', content: '<p>Kwame Asante has been named the East Africa Player of the Month for February after a series of exceptional performances.</p><p>The Ghanaian international delivered a masterclass in each of his five appearances during the month, combining his trademark flair with a new-found eye for goal.</p>', image: 'https://images.pexels.com/photos/3148452/pexels-photo-3148452.jpeg?auto=compress&cs=tinysrgb&w=800', blur_image: 'https://images.pexels.com/photos/3148452/pexels-photo-3148452.jpeg?auto=compress&cs=tinysrgb&w=20', category: 'Club News', author: 'Fatima Nkosi', date: '2024-03-05', readTime: 3, featured: false },
  { id: 3, slug: 'new-training-facility-opening', title: 'State-of-the-Art Training Academy Opens Its Doors', excerpt: 'Uncle T FC officially inaugurated its new USD 4 million training academy, a landmark investment in the future of African football.', content: '<p>Uncle T FC has taken a giant step in its long-term vision with the opening of a brand new, USD 4 million training academy.</p><p>The facility boasts four full-size natural grass pitches, two artificial turf pitches, a state-of-the-art gymnasium, hydrotherapy pools and residential quarters for youth players.</p>', image: 'https://images.pexels.com/photos/3622622/pexels-photo-3622622.jpeg?auto=compress&cs=tinysrgb&w=800', blur_image: 'https://images.pexels.com/photos/3622622/pexels-photo-3622622.jpeg?auto=compress&cs=tinysrgb&w=20', category: 'Club News', author: 'Samuel Oduya', date: '2024-02-20', readTime: 5, featured: false },
  { id: 4, slug: 'youth-program-expansion-2024', title: 'Youth Development Programme to Expand Across Five Regions', excerpt: 'Building on four years of success, Uncle T FC youth development programme will open new academies in five additional regions in 2024.', content: '<p>Uncle T FC has announced a major expansion of its grassroots youth development programme, with plans to open satellite academies in five new regions across Tanzania, Kenya, and Uganda.</p>', image: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=800', blur_image: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=20', category: 'Community', author: 'Aisha Kamau', date: '2024-02-10', readTime: 4, featured: false },
  { id: 5, slug: 'balde-hat-trick-league-leaders', title: 'Baldé Hat-Trick Sends Uncle T to Top of the Table', excerpt: 'Ibrahima Baldé was unstoppable as he scored three goals in a dominant 4-0 victory over Azam FC.', content: '<p>Ibrahima Baldé was the star of the show as Uncle T FC demolished Azam FC 4-0 in a dominant performance that sent them to the top of the Tanzania Premier League.</p>', image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800', blur_image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=20', category: 'Match Report', author: 'James Kariuki', date: '2024-01-28', readTime: 3, featured: false },
  { id: 6, slug: 'coach-bianchi-contract-extension', title: 'Head Coach Roberto Bianchi Signs Three-Year Contract Extension', excerpt: 'The club is delighted to confirm that head coach Roberto Bianchi has committed his future to Uncle T FC.', content: '<p>Uncle T FC is thrilled to announce that head coach Roberto Bianchi has signed a new three-year contract, keeping him at the club until 2027.</p>', image: 'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=800', blur_image: 'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=20', category: 'Club News', author: 'Fatima Nkosi', date: '2024-01-15', readTime: 3, featured: false },
];

export const dummyNewsCategories: NewsCategory[] = [
  { id: 1, category: 'Match Report', image: 'https://images.pexels.com/photos/1366913/pexels-photo-1366913.jpeg?auto=compress&cs=tinysrgb&w=1400' },
  { id: 2, category: 'Club News',    image: 'https://images.pexels.com/photos/3622622/pexels-photo-3622622.jpeg?auto=compress&cs=tinysrgb&w=1400' },
  { id: 3, category: 'Community',   image: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=1400' },
];

// --- Fixtures ---
export const dummyFixtures: Fixture[] = [
  { id: 1, homeTeam: 'Uncle T FC', awayTeam: 'Simba SC', homeTeamLogo: '', awayTeamLogo: '', date: '2024-04-06', time: '16:00', venue: 'National Main Stadium, Dar es Salaam', competition: 'Tanzania Premier League', status: 'upcoming', fans: 0 },
  { id: 2, homeTeam: 'Young Africans', awayTeam: 'Uncle T FC', homeTeamLogo: '', awayTeamLogo: '', date: '2024-04-13', time: '15:00', venue: 'Benjamin Mkapa Stadium', competition: 'Tanzania Premier League', status: 'upcoming', fans: 0 },
  { id: 3, homeTeam: 'Uncle T FC', awayTeam: 'TP Mazembe', homeTeamLogo: '', awayTeamLogo: '', date: '2024-04-20', time: '18:00', venue: 'National Main Stadium, Dar es Salaam', competition: 'CAF Champions League', status: 'upcoming', fans: 0 },
  { id: 4, homeTeam: 'Uncle T FC', awayTeam: 'Azam FC', homeTeamLogo: '', awayTeamLogo: '', date: '2024-03-23', time: '16:00', venue: 'National Main Stadium, Dar es Salaam', competition: 'Tanzania Premier League', status: 'completed', homeScore: 4, awayScore: 0, fans: 24500 },
  { id: 5, homeTeam: 'Gor Mahia', awayTeam: 'Uncle T FC', homeTeamLogo: '', awayTeamLogo: '', date: '2024-03-16', time: '15:00', venue: 'Kasarani Stadium, Nairobi', competition: 'East African Champions Cup', status: 'completed', homeScore: 1, awayScore: 2, fans: 18200 },
  { id: 6, homeTeam: 'Uncle T FC', awayTeam: 'Nairobi City Stars', homeTeamLogo: '', awayTeamLogo: '', date: '2024-03-09', time: '18:00', venue: 'Amaan Stadium, Zanzibar', competition: 'East African Champions Cup Final', status: 'completed', homeScore: 2, awayScore: 1, fans: 31000 },
  { id: 7, homeTeam: 'Uncle T FC', awayTeam: 'Al Ahly', homeTeamLogo: '', awayTeamLogo: '', date: '2024-04-27', time: '19:00', venue: 'National Main Stadium, Dar es Salaam', competition: 'CAF Champions League', status: 'upcoming', fans: 0 },
];

// --- Programs ---
export const dummyPrograms: Program[] = [
  { id: 1, slug: 'sports', title: 'Sports Academy', tagline: 'Developing the Stars of Tomorrow', description: 'Our structured football academy provides world-class coaching for youth aged 8 to 18.', longDescription: 'Uncle T FC Sports Academy is the cornerstone of our community mission. We offer structured coaching pathways from grassroots to elite levels, working with over 1,200 young players every season.', image: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=800', blur_image: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=20', icon: 'Trophy', color: '#1B4D2E', stats: [{ label: 'Youth Players', value: '1,200+' }, { label: 'Qualified Coaches', value: '48' }, { label: 'Pro Players Produced', value: '12' }, { label: 'Partner Schools', value: '24' }], highlights: ['Full-season structured programmes for ages 8-18', 'Residential academy for elite prospects', 'Partnership with schools across 3 countries', 'Annual national talent identification camps'] },
  { id: 2, slug: 'environment', title: 'Green Goals', tagline: 'Football for a Sustainable Future', description: 'Using the power of football to drive environmental awareness and conservation across East Africa.', longDescription: 'Green Goals is Uncle T FC flagship environmental programme, using the club platform to promote conservation, sustainability, and climate action.', image: 'https://images.pexels.com/photos/1366913/pexels-photo-1366913.jpeg?auto=compress&cs=tinysrgb&w=800', blur_image: 'https://images.pexels.com/photos/1366913/pexels-photo-1366913.jpeg?auto=compress&cs=tinysrgb&w=20', icon: 'Leaf', color: '#2A7044', stats: [{ label: 'Trees Planted', value: '50,000+' }, { label: 'Communities Reached', value: '120' }, { label: 'Clean-up Events', value: '85' }, { label: 'Tonnes of Waste Removed', value: '42' }], highlights: ['Annual Uncle T Tree Planting Festival', 'Zero single-use plastic policy at the stadium', 'Solar panels on training facility rooftops', 'Environmental education in partner schools'] },
  { id: 3, slug: 'health', title: 'Healthy Nation', tagline: 'Sport as a Gateway to Better Health', description: 'Promoting physical and mental wellbeing through sport in underserved communities.', longDescription: 'Healthy Nation harnesses the appeal of football to drive health behaviour change in communities across East Africa.', image: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=800', blur_image: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=20', icon: 'Heart', color: '#C9A84C', stats: [{ label: 'People Reached', value: '200,000+' }, { label: 'Free Health Screenings', value: '15,000' }, { label: 'Partner Hospitals', value: '18' }, { label: 'Nutrition Workshops', value: '320' }], highlights: ['Free HIV/malaria testing at all home matches', 'Mental health first aid training for coaches', 'Partnership with national health ministry', 'Mobile health clinic visiting remote communities'] },
  { id: 4, slug: 'arts', title: 'Creative Kicks', tagline: 'Where Sport Meets Culture', description: 'Celebrating African art, music, and culture through the lens of football.', longDescription: 'Creative Kicks is our unique programme that uses football as a bridge between communities and the rich tapestry of African arts and culture.', image: 'https://images.pexels.com/photos/3622622/pexels-photo-3622622.jpeg?auto=compress&cs=tinysrgb&w=800', blur_image: 'https://images.pexels.com/photos/3622622/pexels-photo-3622622.jpeg?auto=compress&cs=tinysrgb&w=20', icon: 'Palette', color: '#8B4513', stats: [{ label: 'Young Artists Supported', value: '500+' }, { label: 'Murals Commissioned', value: '34' }, { label: 'Cultural Events Per Year', value: '40' }, { label: 'Music Albums Produced', value: '5' }], highlights: ['Annual Uncle T FC Arts Festival', 'Stadium mural programme featuring local artists', 'Free drama and visual arts workshops', 'Digital storytelling for community narratives'] },
  { id: 5, slug: 'leadership', title: 'Future Leaders', tagline: 'Shaping the Leaders of Africa', description: 'Empowering young Africans with the skills, confidence, and networks to become community leaders.', longDescription: 'Future Leaders is Uncle T FC youth leadership development programme, designed to identify and nurture young people with leadership potential from disadvantaged backgrounds.', image: 'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=800', blur_image: 'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=20', icon: 'Star', color: '#2C3E50', stats: [{ label: 'Graduates', value: '300+' }, { label: 'Mentors', value: '80' }, { label: 'Partner Organisations', value: '25' }, { label: 'Scholarships Awarded', value: '65' }], highlights: ['Annual 12-month leadership development cohort', 'Mentorship from business and football leaders', 'University scholarship fund for top graduates', 'Internship placements with partner companies'] },
  { id: 6, slug: 'libraries', title: 'Reading FC', tagline: 'Literacy is the Foundation of Every Victory', description: 'Building libraries and promoting literacy in schools and communities across East Africa.', longDescription: 'Reading FC is our literacy and library programme, built on the belief that education is the foundation of sustainable development.', image: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=800', blur_image: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=20', icon: 'BookOpen', color: '#6B21A8', stats: [{ label: 'Libraries Built', value: '12' }, { label: 'Books Donated', value: '50,000+' }, { label: 'Children in Reading Clubs', value: '8,000' }, { label: 'Partner Schools', value: '120' }], highlights: ['"Read with a Champion" player literacy ambassador programme', 'Mobile library serving remote communities', 'Annual Schools Reading Challenge', 'Digital e-library platform for partner schools'] },
];

export const dummyProgramTitles: ProgramTitle[] = [
  { id: 1, title: 'Sports Academy' },
  { id: 2, title: 'Green Goals' },
  { id: 3, title: 'Healthy Nation' },
  { id: 4, title: 'Creative Kicks' },
  { id: 5, title: 'Future Leaders' },
  { id: 6, title: 'Reading FC' },
];

// --- Partners ---
export const dummyPartners: Partner[] = [
  { id: 1, name: 'Serengeti Breweries', logo: '', blur_image: '', tier: 'platinum', website: 'https://example.com', description: 'Our principal shirt sponsor and a proud supporter of East African sport.' },
  { id: 2, name: 'Equity Bank', logo: '', blur_image: '', tier: 'platinum', website: 'https://example.com', description: 'Official banking partner enabling our community programmes.' },
  { id: 3, name: 'Vodacom Tanzania', logo: '', blur_image: '', tier: 'gold', website: 'https://example.com', description: 'Powering connectivity for fans and operations across the club.' },
  { id: 4, name: 'Tanzania Breweries', logo: '', blur_image: '', tier: 'gold', description: 'Long-standing commercial partner sharing our passion for community.' },
  { id: 5, name: 'CRDB Bank', logo: '', blur_image: '', tier: 'silver', description: 'Supporting youth development and grassroots football initiatives.' },
  { id: 6, name: 'Air Tanzania', logo: '', blur_image: '', tier: 'silver', website: 'https://example.com', description: 'Our official travel partner for continental competitions.' },
];

export const dummyPartnerTiers: PartnerTier[] = [
  { id: 1, name: 'platinum' },
  { id: 2, name: 'gold' },
  { id: 3, name: 'silver' },
];

// --- Gallery ---
export const dummyGallery: GalleryItem[] = [
  { id: 1, image: 'https://images.pexels.com/photos/1366913/pexels-photo-1366913.jpeg?auto=compress&cs=tinysrgb&w=800', blur_image: 'https://images.pexels.com/photos/1366913/pexels-photo-1366913.jpeg?auto=compress&cs=tinysrgb&w=20', caption: 'East African Champions Cup Final — National Stadium', category: 'Matches', featured: true },
  { id: 2, image: 'https://images.pexels.com/photos/3148452/pexels-photo-3148452.jpeg?auto=compress&cs=tinysrgb&w=800', blur_image: 'https://images.pexels.com/photos/3148452/pexels-photo-3148452.jpeg?auto=compress&cs=tinysrgb&w=20', caption: 'Training Session — Uncle T FC Academy', category: 'Training', featured: false },
  { id: 3, image: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=800', blur_image: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=20', caption: 'Goalkeeper Training — Kofi Mensah in action', category: 'Training', featured: false },
  { id: 4, image: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=800', blur_image: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=20', caption: 'Community Outreach — Youth Programme, Arusha', category: 'Community', featured: false },
  { id: 5, image: 'https://images.pexels.com/photos/3622622/pexels-photo-3622622.jpeg?auto=compress&cs=tinysrgb&w=800', blur_image: 'https://images.pexels.com/photos/3622622/pexels-photo-3622622.jpeg?auto=compress&cs=tinysrgb&w=20', caption: 'Pre-Season Fitness Camp — Ngorongoro', category: 'Training', featured: false },
  { id: 6, image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800', blur_image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=20', caption: 'League Title Celebrations — Dar es Salaam', category: 'Celebrations', featured: false },
  { id: 7, image: 'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=800', blur_image: 'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=20', caption: 'Midfield Masterclass — Hassan Omar in training', category: 'Training', featured: false },
  { id: 8, image: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=800', blur_image: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=20', caption: 'Matchday Warm-Up — Benjamin Mkapa Stadium', category: 'Matches', featured: false },
  { id: 9, image: 'https://images.pexels.com/photos/2346/sport-glass-jump-fitness.jpg?auto=compress&cs=tinysrgb&w=800', blur_image: 'https://images.pexels.com/photos/2346/sport-glass-jump-fitness.jpg?auto=compress&cs=tinysrgb&w=20', caption: 'Fan Zone — Matchday Experience', category: 'Fans', featured: false },
];

export const dummyGalleryCategories: GalleryCategory[] = [
  { id: 1, title: 'Matches' },
  { id: 2, title: 'Training' },
  { id: 3, title: 'Community' },
  { id: 4, title: 'Celebrations' },
  { id: 5, title: 'Fans' },
];

// --- Club Stats (fetched) ---
export const dummyClubStats: ClubStat[] = [
  { id: 1, label: 'League Titles', value: '8', icon: 'Trophy' },
  { id: 2, label: 'Years of History', value: '34', icon: 'Calendar' },
  { id: 3, label: 'Community Members', value: '500K+', icon: 'Users' },
  { id: 4, label: 'Nations Represented', value: '18', icon: 'Globe' },
];

// --- Mission & Vision ---
export const dummyMissionVision: MissionVisionItem[] = [
  { id: 1, title: 'Social Empowerment', content: 'To use sport as a tool for community development, fostering resilience and opportunity for urban youth.' },
  { id: 2, title: 'Leadership Development', content: 'Building the next generation of African leaders through structured mentorship and organisational roles.' },
];

// --- Milestones ---
export const dummyMilestones: Milestone[] = [
  { id: 1, year: '1990', title: 'Club Founded', content: "Uncle T FC was established by a group of football enthusiasts in Dar es Salaam with a vision to create Africa's most community-centred club." },
  { id: 2, year: '1998', title: 'First League Title', content: 'Eight years after formation, the club won its first Tanzania Premier League title, marking the beginning of a golden era.' },
  { id: 3, year: '2005', title: 'Community Programmes Launch', content: 'The club launched its first community programme, Reading FC, setting a precedent for football clubs on the continent.' },
  { id: 4, year: '2012', title: 'New Stadium', content: 'Uncle T FC moved into the refurbished National Main Stadium, boosting capacity and improving the matchday experience.' },
  { id: 5, year: '2018', title: 'CAF Champions League Debut', content: 'The club made its first appearance in the CAF Champions League group stages, announcing itself on the continental stage.' },
  { id: 6, year: '2024', title: 'East African Champions', content: 'Crowned East African Champions Cup winners for the third time in a dramatic final against Nairobi City Stars.' },
];

// --- Management ---
export const dummyManagement: Management[] = [
  { id: 1, name: 'Emmanuel Osei', role: 'Club President', image: 'https://images.pexels.com/photos/3148452/pexels-photo-3148452.jpeg?auto=compress&cs=tinysrgb&w=400', blur_image: 'https://images.pexels.com/photos/3148452/pexels-photo-3148452.jpeg?auto=compress&cs=tinysrgb&w=20' },
  { id: 2, name: 'Amina Rashid', role: 'Chief Executive Officer', image: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=400', blur_image: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=20' },
  { id: 3, name: 'Roberto Bianchi', role: 'Head Coach', image: 'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=400', blur_image: 'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=20' },
  { id: 4, name: 'Joseph Mwangi', role: 'Director of Football', image: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=400', blur_image: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=20' },
];

// --- Socials ---
export const dummySocials: SocialInfo = {
  address: 'National Main Stadium, Uhuru Street, Dar es Salaam, Tanzania',
  phone_number: '+255 123 456 789',
  email: 'info@Uncle T-fc.com',
  open_hours: '8:00',
  close_hours: '17:00',
  open_day: 'Mon',
  close_day: 'Fri',
  location: 'Dar es Salaam, Tanzania',
  twitter: 'https://twitter.com/Uncle Tfc',
  facebook: 'https://facebook.com/Uncle Tfc',
  instagram: 'https://instagram.com/Uncle Tfc',
  youtube: 'https://youtube.com/Uncle Tfc',
};
