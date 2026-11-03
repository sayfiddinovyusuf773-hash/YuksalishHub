import fs from 'fs';
import path from 'path';
import {
  User,
  Region,
  District,
  Direction,
  Community,
  CommunityPost,
  PostComment,
  Project,
  EventItem,
  Challenge,
  Book,
  ReadingLog,
  LanguageGroup,
  Achievement,
  UserAchievement,
  NotificationItem,
  ContentReport,
} from './types';
import {
  SEED_REGIONS,
  SEED_DISTRICTS,
  SEED_DIRECTIONS,
  SEED_USERS,
  SEED_COMMUNITIES,
  SEED_POSTS,
  SEED_PROJECTS,
  SEED_EVENTS,
  SEED_CHALLENGES,
  SEED_BOOKS,
  SEED_READING_LOGS,
  SEED_LANGUAGE_GROUPS,
  SEED_ACHIEVEMENTS,
  SEED_USER_ACHIEVEMENTS,
  SEED_NOTIFICATIONS,
  SEED_REPORTS,
} from '../data/seed';

export interface DatabaseSchema {
  users: User[];
  regions: Region[];
  districts: District[];
  directions: Direction[];
  communities: Community[];
  posts: CommunityPost[];
  comments: PostComment[];
  projects: Project[];
  events: EventItem[];
  challenges: Challenge[];
  books: Book[];
  readingLogs: ReadingLog[];
  languageGroups: LanguageGroup[];
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  notifications: NotificationItem[];
  reports: ContentReport[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'ufq_database.json');

function ensureDataFile(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData: DatabaseSchema = {
      users: SEED_USERS,
      regions: SEED_REGIONS,
      districts: SEED_DISTRICTS,
      directions: SEED_DIRECTIONS,
      communities: SEED_COMMUNITIES,
      posts: SEED_POSTS,
      comments: [
        {
          id: 'comm-1',
          postId: 'post-1',
          authorId: 'usr-coord-sam',
          authorName: 'Dilnoza Qodirova',
          content: 'Juda to‘g‘ri fikr! Abdulla Qodiriy xalqimizning ma’rifatga intilishini yuksak mahorat bilan ochib bergan.',
          createdAt: '2026-02-18T14:30:00Z',
        },
      ],
      projects: SEED_PROJECTS,
      events: SEED_EVENTS,
      challenges: SEED_CHALLENGES,
      books: SEED_BOOKS,
      readingLogs: SEED_READING_LOGS,
      languageGroups: SEED_LANGUAGE_GROUPS,
      achievements: SEED_ACHIEVEMENTS,
      userAchievements: SEED_USER_ACHIEVEMENTS,
      notifications: SEED_NOTIFICATIONS,
      reports: SEED_REPORTS,
    };

    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }

  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content) as DatabaseSchema;
  } catch (error) {
    console.error('Error reading database file, recreating initial state:', error);
    const initialData: DatabaseSchema = {
      users: SEED_USERS,
      regions: SEED_REGIONS,
      districts: SEED_DISTRICTS,
      directions: SEED_DIRECTIONS,
      communities: SEED_COMMUNITIES,
      posts: SEED_POSTS,
      comments: [],
      projects: SEED_PROJECTS,
      events: SEED_EVENTS,
      challenges: SEED_CHALLENGES,
      books: SEED_BOOKS,
      readingLogs: SEED_READING_LOGS,
      languageGroups: SEED_LANGUAGE_GROUPS,
      achievements: SEED_ACHIEVEMENTS,
      userAchievements: SEED_USER_ACHIEVEMENTS,
      notifications: SEED_NOTIFICATIONS,
      reports: SEED_REPORTS,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
}

export function saveDatabase(data: DatabaseSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export const db = {
  get: (): DatabaseSchema => ensureDataFile(),
  save: (data: DatabaseSchema): void => saveDatabase(data),

  // Users
  getUserById: (id: string): User | undefined => {
    return ensureDataFile().users.find((u) => u.id === id);
  },
  getUserByEmail: (email: string): User | undefined => {
    return ensureDataFile().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },
  getUserByUsername: (username: string): User | undefined => {
    return ensureDataFile().users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  },
  createUser: (user: User): User => {
    const data = ensureDataFile();
    data.users.push(user);
    saveDatabase(data);
    return user;
  },
  updateUser: (id: string, updates: Partial<User>): User | undefined => {
    const data = ensureDataFile();
    const index = data.users.findIndex((u) => u.id === id);
    if (index === -1) return undefined;
    data.users[index] = { ...data.users[index], ...updates };
    saveDatabase(data);
    return data.users[index];
  },

  // Communities
  getCommunities: (): Community[] => ensureDataFile().communities,
  getCommunityById: (id: string): Community | undefined => {
    return ensureDataFile().communities.find((c) => c.id === id || c.slug === id);
  },
  toggleCommunityMembership: (communityId: string, userId: string): { joined: boolean; count: number } => {
    const data = ensureDataFile();
    const com = data.communities.find((c) => c.id === communityId || c.slug === communityId);
    if (!com) return { joined: false, count: 0 };

    const idx = com.members.indexOf(userId);
    let joined = false;
    if (idx > -1) {
      com.members.splice(idx, 1);
      com.memberCount = Math.max(0, com.memberCount - 1);
      joined = false;
    } else {
      com.members.push(userId);
      com.memberCount += 1;
      joined = true;
    }
    saveDatabase(data);
    return { joined, count: com.memberCount };
  },

  // Posts & Comments
  getPostsByCommunity: (communityId: string): CommunityPost[] => {
    return ensureDataFile().posts.filter((p) => p.communityId === communityId);
  },
  createPost: (post: CommunityPost): CommunityPost => {
    const data = ensureDataFile();
    data.posts.unshift(post);
    saveDatabase(data);
    return post;
  },
  togglePostLike: (postId: string, userId: string): { liked: boolean; count: number } => {
    const data = ensureDataFile();
    const post = data.posts.find((p) => p.id === postId);
    if (!post) return { liked: false, count: 0 };
    const idx = post.likes.indexOf(userId);
    let liked = false;
    if (idx > -1) {
      post.likes.splice(idx, 1);
      liked = false;
    } else {
      post.likes.push(userId);
      liked = true;
    }
    saveDatabase(data);
    return { liked, count: post.likes.length };
  },
  getCommentsByPost: (postId: string): PostComment[] => {
    return ensureDataFile().comments.filter((c) => c.postId === postId);
  },
  createComment: (comment: PostComment): PostComment => {
    const data = ensureDataFile();
    data.comments.push(comment);
    const post = data.posts.find((p) => p.id === comment.postId);
    if (post) {
      post.commentsCount = (post.commentsCount || 0) + 1;
    }
    saveDatabase(data);
    return comment;
  },

  // Projects
  getProjects: (): Project[] => ensureDataFile().projects,
  getProjectById: (id: string): Project | undefined => {
    return ensureDataFile().projects.find((p) => p.id === id);
  },
  createProject: (project: Project): Project => {
    const data = ensureDataFile();
    data.projects.unshift(project);
    saveDatabase(data);
    return project;
  },
  joinProjectTeam: (projectId: string, member: { userId: string; name: string; role: string }): boolean => {
    const data = ensureDataFile();
    const proj = data.projects.find((p) => p.id === projectId);
    if (!proj) return false;
    if (!proj.members.some((m) => m.userId === member.userId)) {
      proj.members.push({ ...member, joinedAt: new Date().toISOString().split('T')[0] });
      saveDatabase(data);
      return true;
    }
    return false;
  },

  // Events
  getEvents: (): EventItem[] => ensureDataFile().events,
  toggleEventRSVP: (eventId: string, userId: string): { registered: boolean; count: number } => {
    const data = ensureDataFile();
    const evt = data.events.find((e) => e.id === eventId);
    if (!evt) return { registered: false, count: 0 };
    const idx = evt.attendees.indexOf(userId);
    let registered = false;
    if (idx > -1) {
      evt.attendees.splice(idx, 1);
      registered = false;
    } else {
      evt.attendees.push(userId);
      registered = true;
    }
    saveDatabase(data);
    return { registered, count: evt.attendees.length };
  },

  // Reading Logs & Books
  getBooks: (): Book[] => ensureDataFile().books,
  getBookById: (id: string): Book | undefined => {
    return ensureDataFile().books.find((b) => b.id === id);
  },
  createBook: (book: Book): Book => {
    const data = ensureDataFile();
    data.books.push(book);
    saveDatabase(data);
    return book;
  },
  updateBook: (bookId: string, updates: Partial<Book>): Book | undefined => {
    const data = ensureDataFile();
    const idx = data.books.findIndex((b) => b.id === bookId);
    if (idx === -1) return undefined;
    data.books[idx] = { ...data.books[idx], ...updates };
    saveDatabase(data);
    return data.books[idx];
  },
  deleteBook: (bookId: string): boolean => {
    const data = ensureDataFile();
    const idx = data.books.findIndex((b) => b.id === bookId);
    if (idx === -1) return false;
    data.books.splice(idx, 1);
    saveDatabase(data);
    return true;
  },
  addChapterToBook: (bookId: string, chapter: { id: string; title: string; pageStart: number; content: string }): boolean => {
    const data = ensureDataFile();
    const book = data.books.find((b) => b.id === bookId);
    if (!book) return false;
    if (!book.chapters) book.chapters = [];
    book.chapters.push(chapter);
    saveDatabase(data);
    return true;
  },
  updateChapterInBook: (bookId: string, chapterId: string, updates: { title?: string; content?: string }): boolean => {
    const data = ensureDataFile();
    const book = data.books.find((b) => b.id === bookId);
    if (!book || !book.chapters) return false;
    const ch = book.chapters.find((c) => c.id === chapterId);
    if (!ch) return false;
    if (updates.title) ch.title = updates.title;
    if (updates.content) ch.content = updates.content;
    saveDatabase(data);
    return true;
  },
  deleteChapterFromBook: (bookId: string, chapterId: string): boolean => {
    const data = ensureDataFile();
    const book = data.books.find((b) => b.id === bookId);
    if (!book || !book.chapters) return false;
    const idx = book.chapters.findIndex((c) => c.id === chapterId);
    if (idx === -1) return false;
    book.chapters.splice(idx, 1);
    saveDatabase(data);
    return true;
  },
  getUserReadingLogs: (userId: string): ReadingLog[] => {
    return ensureDataFile().readingLogs.filter((r) => r.userId === userId);
  },
  updateReadingLog: (log: ReadingLog): ReadingLog => {
    const data = ensureDataFile();
    const idx = data.readingLogs.findIndex((r) => r.userId === log.userId && r.bookId === log.bookId);
    if (idx > -1) {
      data.readingLogs[idx] = log;
    } else {
      data.readingLogs.push(log);
    }
    saveDatabase(data);
    return log;
  },

  // Languages
  getLanguageGroups: (): LanguageGroup[] => ensureDataFile().languageGroups,
  toggleLanguageGroupJoin: (groupId: string, userId: string): { joined: boolean; count: number } => {
    const data = ensureDataFile();
    const grp = data.languageGroups.find((g) => g.id === groupId);
    if (!grp) return { joined: false, count: 0 };
    const idx = grp.members.indexOf(userId);
    let joined = false;
    if (idx > -1) {
      grp.members.splice(idx, 1);
      grp.memberCount = Math.max(0, grp.memberCount - 1);
      joined = false;
    } else {
      grp.members.push(userId);
      grp.memberCount += 1;
      joined = true;
    }
    saveDatabase(data);
    return { joined, count: grp.memberCount };
  },

  // Notifications
  getUserNotifications: (userId: string): NotificationItem[] => {
    return ensureDataFile().notifications.filter((n) => n.userId === userId);
  },
  markNotificationAsRead: (id: string): void => {
    const data = ensureDataFile();
    const notif = data.notifications.find((n) => n.id === id);
    if (notif) {
      notif.isRead = true;
      saveDatabase(data);
    }
  },
  createNotification: (notif: NotificationItem): void => {
    const data = ensureDataFile();
    data.notifications.unshift(notif);
    saveDatabase(data);
  },

  // Reports
  createReport: (report: ContentReport): ContentReport => {
    const data = ensureDataFile();
    data.reports.unshift(report);
    saveDatabase(data);
    return report;
  },
  resolveReport: (reportId: string, notes: string): boolean => {
    const data = ensureDataFile();
    const rep = data.reports.find((r) => r.id === reportId);
    if (rep) {
      rep.status = 'RESOLVED';
      rep.resolvedAt = new Date().toISOString();
      rep.moderatorNotes = notes;
      saveDatabase(data);
      return true;
    }
    return false;
  },
};
