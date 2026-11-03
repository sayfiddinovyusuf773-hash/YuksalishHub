export type UserRole =
  | 'SUPER_ADMIN'
  | 'REGIONAL_COORDINATOR'
  | 'DISTRICT_COORDINATOR'
  | 'COMMUNITY_MODERATOR'
  | 'MENTOR'
  | 'USER';

export interface User {
  id: string;
  name: string;
  surname: string;
  username: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role: UserRole;
  regionId: string;
  regionName: string;
  districtId: string;
  districtName: string;
  avatarUrl?: string;
  bio?: string;
  interests: string[];
  directions: string[];
  points: number;
  level: number;
  createdAt: string;
}

export interface Region {
  id: string;
  name: string;
  code: string;
  center: string;
  areaKm2: number;
  youthCount: number;
  activeCommunities: number;
  activeProjects: number;
  pathD?: string; // SVG path for interactive map
  centerCoords: { x: number; y: number };
}

export interface District {
  id: string;
  regionId: string;
  name: string;
  type: 'shahar' | 'tuman';
  youthCount: number;
}

export type DirectionId =
  | 'kitobxonlik'
  | 'til-organish'
  | 'it-innovatsiya'
  | 'liderlik'
  | 'volontyorlik';

export interface Direction {
  id: DirectionId;
  title: string;
  tagline: string;
  description: string;
  iconName: string;
  accentColor: string;
  memberCount: number;
  activitiesCount: number;
}

export interface Community {
  id: string;
  title: string;
  slug: string;
  description: string;
  directionId: DirectionId;
  regionId?: string; // if regional
  districtId?: string; // if district-level
  regionName?: string;
  districtName?: string;
  memberCount: number;
  coordinatorId: string;
  coordinatorName: string;
  coverImage?: string;
  createdAt: string;
  rules?: string[];
  members: string[]; // user ids
}

export interface CommunityPost {
  id: string;
  communityId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar?: string;
  title: string;
  content: string;
  likes: string[]; // user ids
  commentsCount: number;
  createdAt: string;
}

export interface PostComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

export type ProjectStatus = 'G‘oya' | 'Jamoa shakllanmoqda' | 'Jarayonda' | 'Yakunlandi';

export interface ProjectMilestone {
  id: string;
  title: string;
  isCompleted: boolean;
  dueDate: string;
}

export interface ProjectMember {
  userId: string;
  name: string;
  role: string;
  joinedAt: string;
}

export interface Project {
  id: string;
  title: string;
  summary: string;
  description: string;
  category: DirectionId;
  regionId: string;
  regionName: string;
  districtName?: string;
  authorId: string;
  authorName: string;
  status: ProjectStatus;
  progressPercent: number;
  neededRoles: string[];
  members: ProjectMember[];
  milestones: ProjectMilestone[];
  createdAt: string;
  coverGradient: string;
}

export type EventType = 'ONLINE' | 'OFFLINE';

export interface EventItem {
  id: string;
  title: string;
  description: string;
  category: DirectionId;
  date: string;
  time: string;
  type: EventType;
  location: string;
  regionId?: string;
  regionName?: string;
  organizer: string;
  organizerRole: string;
  capacity: number;
  attendees: string[]; // user IDs
  coverGradient: string;
}

export interface Challenge {
  id: string;
  title: string;
  directionId: DirectionId;
  description: string;
  rewardPoints: number;
  durationDays: number;
  startDate: string;
  endDate: string;
  targetCount: number;
  targetUnit: string;
  participants: {
    userId: string;
    currentCount: number;
    completed: boolean;
  }[];
}

export interface BookChapter {
  id: string;
  title: string;
  pageStart: number;
  content: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  pages: number;
  description: string;
  coverColor: string;
  rating: number;
  reviewsCount: number;
  chapters?: BookChapter[];
}

export interface ReadingLog {
  id: string;
  userId: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  currentPage: number;
  totalPages: number;
  status: 'O‘qilmoqda' | 'Tugatildi' | 'Rejada';
  updatedAt: string;
  review?: string;
  rating?: number;
}

export interface LanguageGroup {
  id: string;
  language: 'Ingliz tili' | 'Arab tili' | 'Rus tili' | 'Nemis tili';
  level: 'Boshlang‘ich (A1-A2)' | 'O‘rta (B1-B2)' | 'Yuqori (C1-C2)';
  title: string;
  schedule: string;
  mentorName: string;
  memberCount: number;
  meetingLinkOrPlace: string;
  members: string[];
}

export interface LanguageProgress {
  userId: string;
  language: string;
  wordsLearned: number;
  speakingSessionsAttended: number;
  targetWords: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  badgeType: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
}

export interface UserAchievement {
  userId: string;
  achievementId: string;
  unlockedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'COMMUNITY' | 'EVENT' | 'PROJECT';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ContentReport {
  id: string;
  reporterId: string;
  reporterName: string;
  targetType: 'POST' | 'COMMENT' | 'COMMUNITY' | 'PROJECT';
  targetId: string;
  reason: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
  resolvedAt?: string;
  moderatorNotes?: string;
}
