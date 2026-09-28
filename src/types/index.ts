export type YearOfStudy = 'Year 1' | 'Year 2' | 'Year 3' | 'Year 4' | 'Final Year' | 'Masters' | 'PhD';

export type UserStatus = 'online' | 'offline' | 'studying' | 'in_class';

export type ProfileVisibility = 'public' | 'university_only' | 'friends_only' | 'private';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  university: string;
  school: string; // e.g. "School of Engineering & Applied Sciences"
  course: string; // e.g. "B.Sc. Computer Science"
  yearOfStudy: YearOfStudy;
  interests: string[]; // Academic interests e.g. "Artificial Intelligence", "Distributed Systems"
  skills: string[]; // e.g. "Python", "React", "Data Structures"
  hobbies: string[]; // Social interests e.g. "Badminton", "Photography", "Chess"
  bio: string;
  verified: boolean;
  status: UserStatus;
  lastSeen?: string;
  visibility: ProfileVisibility;
  allowDMs: boolean;
  showEmail: boolean;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    website?: string;
  };
  e2eeFingerprint: string;
  blockedUserIds: string[];
}

export type ConnectionStatus = 'none' | 'pending_sent' | 'pending_received' | 'connected' | 'blocked';

export interface Connection {
  id: string;
  requesterId: string;
  recipientId: string;
  status: 'pending' | 'accepted' | 'declined' | 'blocked';
  createdAt: string;
}

export type GroupCategory = 
  | 'study_group' 
  | 'project_team' 
  | 'networking_circle' 
  | 'friend_group';

export type GroupPrivacy = 
  | 'public' 
  | 'university_only' 
  | 'request_to_join' 
  | 'private_invite';

export interface GroupMember {
  userId: string;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: string;
}

export interface Group {
  id: string;
  name: string;
  category: GroupCategory;
  description: string;
  university: string; // specific university or "Cross-University"
  course?: string;
  avatar: string;
  solidBadgeColor: string; // solid accent color: e.g. #0284c7, #059669
  privacy: GroupPrivacy;
  members: GroupMember[];
  tags: string[];
  createdAt: string;
  pinnedNotice?: string;
}

export interface WorkspaceResource {
  id: string;
  groupId: string;
  title: string;
  description?: string;
  category: 'notes' | 'past_paper' | 'slides' | 'assignment' | 'code' | 'reading';
  fileType: 'pdf' | 'docx' | 'zip' | 'image' | 'link' | 'txt';
  fileSize: string;
  uploadedBy: string; // userId
  uploadedByName: string;
  uploadedAt: string;
  url?: string;
  contentSnippet?: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface WorkspaceTask {
  id: string;
  groupId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  assigneeName?: string;
  dueDate: string;
  createdBy: string;
  createdAt: string;
}

export interface MessageAttachment {
  id: string;
  name: string;
  type: 'image' | 'document' | 'voice' | 'link';
  url: string;
  size?: string;
  duration?: string; // for voice notes
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  recipientId?: string; // for 1-to-1
  groupId?: string; // for group
  text: string;
  timestamp: string;
  isEncrypted: boolean;
  status: 'sent' | 'delivered' | 'read';
  attachments?: MessageAttachment[];
}

export type EventCategory = 
  | 'study_session'
  | 'workshop'
  | 'seminar'
  | 'project_meeting'
  | 'academic_event'
  | 'social_meetup'
  | 'hangout'
  | 'trip'
  | 'sports'
  | 'game_night'
  | 'birthday';

export interface EventAttendee {
  userId: string;
  name: string;
  avatar: string;
  status: 'going' | 'maybe' | 'cant_go';
}

export interface EventItem {
  id: string;
  title: string;
  category: EventCategory;
  description: string;
  university: string;
  locationType: 'in_person' | 'online';
  locationDetails: string;
  dateTime: string; // ISO string
  duration: string; // e.g. "2 hours"
  organizerId: string;
  organizerName: string;
  groupId?: string;
  groupName?: string;
  maxAttendees?: number;
  attendees: EventAttendee[];
  remindersSet: string[]; // user IDs who enabled reminder
  isPrivateCircleEvent?: boolean;
}

export type NotificationType = 
  | 'message'
  | 'group_invite'
  | 'study_session'
  | 'event'
  | 'file_upload'
  | 'friend_request'
  | 'system';

export interface NotificationItem {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  targetId?: string;
}

export interface ReportItem {
  id: string;
  reporterId: string;
  targetType: 'user' | 'group' | 'message';
  targetId: string;
  reason: string;
  details: string;
  timestamp: string;
}
