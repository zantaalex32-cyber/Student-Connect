import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Group,
  WorkspaceResource,
  WorkspaceTask,
  Message,
  EventItem,
  NotificationItem,
  Connection,
  ReportItem,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_GROUPS,
  INITIAL_WORKSPACE_RESOURCES,
  INITIAL_WORKSPACE_TASKS,
  INITIAL_MESSAGES,
  INITIAL_EVENTS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

interface AppContextType {
  currentUser: User;
  users: User[];
  groups: Group[];
  currentGroup: Group | null;
  setCurrentGroup: (group: Group | null) => void;
  resources: WorkspaceResource[];
  tasks: WorkspaceTask[];
  messages: Message[];
  events: EventItem[];
  notifications: NotificationItem[];
  connections: Connection[];
  filterUniversityOnly: boolean;
  setFilterUniversityOnly: (val: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedChatId: string | null;
  setSelectedChatId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Modals & UI states
  isCreateGroupOpen: boolean;
  setIsCreateGroupOpen: (open: boolean) => void;
  isCreateEventOpen: boolean;
  setIsCreateEventOpen: (open: boolean) => void;
  isUploadResourceOpen: boolean;
  setIsUploadResourceOpen: (open: boolean) => void;
  isE2EEModalOpen: boolean;
  setIsE2EEModalOpen: (open: boolean) => void;
  isWhatsAppSupportOpen: boolean;
  setIsWhatsAppSupportOpen: (open: boolean) => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  reportTarget: { type: 'user' | 'group' | 'message'; id: string; name: string } | null;
  setReportTarget: (target: { type: 'user' | 'group' | 'message'; id: string; name: string } | null) => void;
  
  // Core Actions
  switchUser: (userId: string) => void;
  updateUserProfile: (updated: Partial<User>) => void;
  sendDirectMessage: (recipientId: string, text: string, attachments?: Message['attachments']) => void;
  sendGroupMessage: (groupId: string, text: string, attachments?: Message['attachments']) => void;
  createGroup: (newGroup: Omit<Group, 'id' | 'createdAt' | 'members'>) => string;
  joinGroup: (groupId: string) => void;
  leaveGroup: (groupId: string) => void;
  addWorkspaceResource: (resource: Omit<WorkspaceResource, 'id' | 'uploadedBy' | 'uploadedByName' | 'uploadedAt'>) => void;
  deleteWorkspaceResource: (resourceId: string) => void;
  addWorkspaceTask: (task: Omit<WorkspaceTask, 'id' | 'createdBy' | 'createdAt'>) => void;
  updateTaskStatus: (taskId: string, status: WorkspaceTask['status']) => void;
  createEvent: (newEvent: Omit<EventItem, 'id' | 'organizerId' | 'organizerName' | 'attendees' | 'remindersSet'>) => string;
  toggleRSVP: (eventId: string, status: 'going' | 'maybe' | 'cant_go') => void;
  toggleEventReminder: (eventId: string) => void;
  exportEventToICS: (event: EventItem) => void;
  requestConnection: (recipientId: string) => void;
  acceptConnection: (requesterId: string) => void;
  getConnectionStatus: (userId: string) => 'none' | 'pending_sent' | 'pending_received' | 'connected' | 'blocked';
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  submitReport: (reason: string, details: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read' | 'userId'>) => void;
  requestBrowserPushPermission: () => Promise<boolean>;
  pushPermissionState: NotificationPermission | 'unsupported';
  clearAllData: () => void;
  loadSampleData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check if we need to reset to clean empty state on user request
  if (typeof window !== 'undefined' && !localStorage.getItem('sc_clean_slate_v1')) {
    localStorage.removeItem('sc_groups');
    localStorage.removeItem('sc_resources');
    localStorage.removeItem('sc_tasks');
    localStorage.removeItem('sc_messages');
    localStorage.removeItem('sc_events');
    localStorage.removeItem('sc_notifications');
    localStorage.removeItem('sc_connections');
    localStorage.setItem('sc_clean_slate_v1', 'true');
  }

  // Load from localStorage or defaults (Defaults to clean empty slate!)
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('sc_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('sc_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [groups, setGroups] = useState<Group[]>(() => {
    const saved = localStorage.getItem('sc_groups');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);

  const [resources, setResources] = useState<WorkspaceResource[]>(() => {
    const saved = localStorage.getItem('sc_resources');
    return saved ? JSON.parse(saved) : [];
  });

  const [tasks, setTasks] = useState<WorkspaceTask[]>(() => {
    const saved = localStorage.getItem('sc_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('sc_messages');
    return saved ? JSON.parse(saved) : [];
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem('sc_events');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('sc_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const [connections, setConnections] = useState<Connection[]>(() => {
    const saved = localStorage.getItem('sc_connections');
    return saved ? JSON.parse(saved) : [];
  });

  const [reports, setReports] = useState<ReportItem[]>(() => {
    const saved = localStorage.getItem('sc_reports');
    return saved ? JSON.parse(saved) : [];
  });

  const [filterUniversityOnly, setFilterUniversityOnly] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isUploadResourceOpen, setIsUploadResourceOpen] = useState(false);
  const [isE2EEModalOpen, setIsE2EEModalOpen] = useState(false);
  const [isWhatsAppSupportOpen, setIsWhatsAppSupportOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ type: 'user' | 'group' | 'message'; id: string; name: string } | null>(null);

  const [pushPermissionState, setPushPermissionState] = useState<NotificationPermission | 'unsupported'>('default');

  // Push notification support check
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushPermissionState(Notification.permission);
    } else {
      setPushPermissionState('unsupported');
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('sc_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('sc_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('sc_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('sc_resources', JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem('sc_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('sc_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('sc_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('sc_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('sc_connections', JSON.stringify(connections));
  }, [connections]);

  useEffect(() => {
    localStorage.setItem('sc_reports', JSON.stringify(reports));
  }, [reports]);

  // Request browser push permissions
  const requestBrowserPushPermission = async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setPushPermissionState('unsupported');
      return false;
    }
    try {
      const res = await Notification.requestPermission();
      setPushPermissionState(res);
      if (res === 'granted') {
        new Notification('Students Connect Notifications Activated!', {
          body: 'You will receive study session alerts, invitations, and secure message updates.',
          icon: '/icon.svg',
        });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read' | 'userId'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId: currentUser.id,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Send native notification if permitted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(notif.title, {
          body: notif.body,
          icon: '/icon.svg',
        });
      } catch {
        // Fallback gracefully
      }
    }
  };

  // Switch demo user
  const switchUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      addNotification({
        type: 'system',
        title: `Switched Profile: ${target.name}`,
        body: `Now viewing as ${target.name} (${target.course} at ${target.university}).`,
      });
    }
  };

  const updateUserProfile = (updated: Partial<User>) => {
    setCurrentUser(prev => {
      const next = { ...prev, ...updated };
      setUsers(all => all.map(u => (u.id === prev.id ? next : u)));
      return next;
    });
    addNotification({
      type: 'system',
      title: 'Profile Updated',
      body: 'Your university academic and social details have been saved securely.',
    });
  };

  // Chat logic (Real-time with E2EE simulation)
  const sendDirectMessage = (recipientId: string, text: string, attachments?: Message['attachments']) => {
    const convId = `dm-${recipientId}`;
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId: convId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      recipientId,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isEncrypted: true,
      status: 'delivered',
      attachments,
    };

    setMessages(prev => [...prev, newMsg]);

    // Realistic auto-reply simulation after 1.5 seconds if talking to another student
    const recipient = users.find(u => u.id === recipientId);
    if (recipient && recipientId !== currentUser.id) {
      setTimeout(() => {
        const replyResponses = [
          `Got your message! I'm reviewing the notes right now. Let's touch base at the library tomorrow.`,
          `Thanks for sending this over! That clarifies the question completely.`,
          `Great idea! Added this to my study schedule. Catch you at the study session.`,
          `Perfect! I'll update our project workspace with the changes.`,
        ];
        const randomReply = replyResponses[Math.floor(Math.random() * replyResponses.length)];
        const replyMsg: Message = {
          id: `msg-reply-${Date.now()}`,
          conversationId: convId,
          senderId: recipient.id,
          senderName: recipient.name,
          senderAvatar: recipient.avatar,
          recipientId: currentUser.id,
          text: randomReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isEncrypted: true,
          status: 'read',
        };
        setMessages(currentMsgs => [...currentMsgs, replyMsg]);
        addNotification({
          type: 'message',
          title: `Encrypted Message from ${recipient.name}`,
          body: randomReply,
          targetId: convId,
        });
      }, 1600);
    }
  };

  const sendGroupMessage = (groupId: string, text: string, attachments?: Message['attachments']) => {
    const targetGroup = groups.find(g => g.id === groupId);
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId: groupId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      groupId,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isEncrypted: true,
      status: 'read',
      attachments,
    };
    setMessages(prev => [...prev, newMsg]);

    // Send notifications to group members
    if (targetGroup) {
      // In a real app backend notifies; here we simulate peer engagement
    }
  };

  // Group actions
  const createGroup = (newGroupData: Omit<Group, 'id' | 'createdAt' | 'members'>): string => {
    const id = `group-${Date.now()}`;
    const newGroup: Group = {
      ...newGroupData,
      id,
      createdAt: new Date().toISOString().split('T')[0],
      members: [{ userId: currentUser.id, role: 'admin', joinedAt: new Date().toISOString().split('T')[0] }],
    };
    setGroups(prev => [newGroup, ...prev]);
    setCurrentGroup(newGroup);
    addNotification({
      type: 'system',
      title: 'New Workspace Initialized',
      body: `"${newGroup.name}" is now active with file sharing, task board, and secure discussion.`,
      targetId: id,
    });
    return id;
  };

  const joinGroup = (groupId: string) => {
    setGroups(prev =>
      prev.map(g => {
        if (g.id === groupId && !g.members.some(m => m.userId === currentUser.id)) {
          return {
            ...g,
            members: [...g.members, { userId: currentUser.id, role: 'member', joinedAt: new Date().toISOString().split('T')[0] }],
          };
        }
        return g;
      })
    );
    const g = groups.find(x => x.id === groupId);
    addNotification({
      type: 'group_invite',
      title: 'Joined Group Workspace',
      body: `You joined "${g?.name || 'Group'}". Welcome to the workspace!`,
      targetId: groupId,
    });
  };

  const leaveGroup = (groupId: string) => {
    setGroups(prev =>
      prev.map(g => {
        if (g.id === groupId) {
          return {
            ...g,
            members: g.members.filter(m => m.userId !== currentUser.id),
          };
        }
        return g;
      })
    );
  };

  // Workspace Resource
  const addWorkspaceResource = (res: Omit<WorkspaceResource, 'id' | 'uploadedBy' | 'uploadedByName' | 'uploadedAt'>) => {
    const newRes: WorkspaceResource = {
      ...res,
      id: `res-${Date.now()}`,
      uploadedBy: currentUser.id,
      uploadedByName: currentUser.name,
      uploadedAt: 'Just now',
    };
    setResources(prev => [newRes, ...prev]);
    addNotification({
      type: 'file_upload',
      title: 'File Uploaded to Workspace',
      body: `"${newRes.title}" (${newRes.fileSize}) is now available for group members.`,
      targetId: newRes.groupId,
    });
  };

  const deleteWorkspaceResource = (resourceId: string) => {
    setResources(prev => prev.filter(r => r.id !== resourceId));
  };

  // Workspace Task
  const addWorkspaceTask = (task: Omit<WorkspaceTask, 'id' | 'createdBy' | 'createdAt'>) => {
    const newTask: WorkspaceTask = {
      ...task,
      id: `task-${Date.now()}`,
      createdBy: currentUser.id,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTaskStatus = (taskId: string, status: WorkspaceTask['status']) => {
    setTasks(prev => prev.map(t => (t.id === taskId ? { ...t, status } : t)));
  };

  // Events logic
  const createEvent = (newEventData: Omit<EventItem, 'id' | 'organizerId' | 'organizerName' | 'attendees' | 'remindersSet'>): string => {
    const id = `evt-${Date.now()}`;
    const newEvent: EventItem = {
      ...newEventData,
      id,
      organizerId: currentUser.id,
      organizerName: currentUser.name,
      attendees: [
        {
          userId: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          status: 'going',
        },
      ],
      remindersSet: [currentUser.id],
    };
    setEvents(prev => [newEvent, ...prev]);
    addNotification({
      type: 'event',
      title: 'New Session Scheduled',
      body: `"${newEvent.title}" on ${new Date(newEvent.dateTime).toLocaleDateString()} has been scheduled.`,
      targetId: id,
    });
    return id;
  };

  const toggleRSVP = (eventId: string, status: 'going' | 'maybe' | 'cant_go') => {
    setEvents(prev =>
      prev.map(ev => {
        if (ev.id === eventId) {
          const filtered = ev.attendees.filter(a => a.userId !== currentUser.id);
          return {
            ...ev,
            attendees: [
              ...filtered,
              {
                userId: currentUser.id,
                name: currentUser.name,
                avatar: currentUser.avatar,
                status,
              },
            ],
          };
        }
        return ev;
      })
    );
  };

  const toggleEventReminder = (eventId: string) => {
    setEvents(prev =>
      prev.map(ev => {
        if (ev.id === eventId) {
          const exists = ev.remindersSet.includes(currentUser.id);
          const next = exists
            ? ev.remindersSet.filter(id => id !== currentUser.id)
            : [...ev.remindersSet, currentUser.id];
          return { ...ev, remindersSet: next };
        }
        return ev;
      })
    );
  };

  // Export event to standard .ics file
  const exportEventToICS = (event: EventItem) => {
    const startDate = new Date(event.dateTime);
    const startStr = startDate.toISOString().replace(/-|:|\.\d+/g, '');
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
    const endStr = endDate.toISOString().replace(/-|:|\.\d+/g, '');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Students Connect//Study Sessions//EN',
      'BEGIN:VEVENT',
      `UID:${event.id}@studentsconnect.app`,
      `DTSTAMP:${startStr}`,
      `DTSTART:${startStr}`,
      `DTEND:${endStr}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
      `LOCATION:${event.locationDetails}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Connection management
  const getConnectionStatus = (targetUserId: string): 'none' | 'pending_sent' | 'pending_received' | 'connected' | 'blocked' => {
    if (currentUser.blockedUserIds?.includes(targetUserId)) return 'blocked';
    const conn = connections.find(
      c =>
        (c.requesterId === currentUser.id && c.recipientId === targetUserId) ||
        (c.requesterId === targetUserId && c.recipientId === currentUser.id)
    );
    if (!conn) return 'none';
    if (conn.status === 'accepted') return 'connected';
    if (conn.status === 'blocked') return 'blocked';
    if (conn.status === 'pending') {
      return conn.requesterId === currentUser.id ? 'pending_sent' : 'pending_received';
    }
    return 'none';
  };

  const requestConnection = (recipientId: string) => {
    const newConn: Connection = {
      id: `conn-${Date.now()}`,
      requesterId: currentUser.id,
      recipientId,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setConnections(prev => [...prev, newConn]);
    const targetUser = users.find(u => u.id === recipientId);
    addNotification({
      type: 'friend_request',
      title: 'Connection Request Sent',
      body: `Your request was sent to ${targetUser?.name || 'student'}.`,
    });
  };

  const acceptConnection = (requesterId: string) => {
    setConnections(prev =>
      prev.map(c => {
        if (
          (c.requesterId === requesterId && c.recipientId === currentUser.id) ||
          (c.requesterId === currentUser.id && c.recipientId === requesterId)
        ) {
          return { ...c, status: 'accepted' };
        }
        return c;
      })
    );
    const requester = users.find(u => u.id === requesterId);
    addNotification({
      type: 'friend_request',
      title: 'Connection Accepted',
      body: `You and ${requester?.name || 'student'} are now connected! You can exchange encrypted direct messages.`,
    });
  };

  const blockUser = (userId: string) => {
    setCurrentUser(prev => ({
      ...prev,
      blockedUserIds: [...(prev.blockedUserIds || []), userId],
    }));
    setConnections(prev =>
      prev.map(c => {
        if (
          (c.requesterId === userId && c.recipientId === currentUser.id) ||
          (c.requesterId === currentUser.id && c.recipientId === userId)
        ) {
          return { ...c, status: 'blocked' };
        }
        return c;
      })
    );
    addNotification({
      type: 'system',
      title: 'User Blocked',
      body: 'This user can no longer message you or view your active status.',
    });
  };

  const unblockUser = (userId: string) => {
    setCurrentUser(prev => ({
      ...prev,
      blockedUserIds: (prev.blockedUserIds || []).filter(id => id !== userId),
    }));
  };

  const submitReport = (reason: string, details: string) => {
    if (!reportTarget) return;
    const newReport: ReportItem = {
      id: `rep-${Date.now()}`,
      reporterId: currentUser.id,
      targetType: reportTarget.type,
      targetId: reportTarget.id,
      reason,
      details,
      timestamp: new Date().toISOString(),
    };
    setReports(prev => [newReport, ...prev]);
    setIsReportModalOpen(false);
    setReportTarget(null);
    addNotification({
      type: 'system',
      title: 'Report Submitted',
      body: 'Thank you for keeping Students Connect safe. Our student safety moderation team will investigate.',
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAllData = () => {
    setGroups([]);
    setResources([]);
    setTasks([]);
    setMessages([]);
    setEvents([]);
    setNotifications([]);
    setConnections([]);
    setCurrentGroup(null);
    setSelectedChatId(null);
    localStorage.removeItem('sc_groups');
    localStorage.removeItem('sc_resources');
    localStorage.removeItem('sc_tasks');
    localStorage.removeItem('sc_messages');
    localStorage.removeItem('sc_events');
    localStorage.removeItem('sc_notifications');
    localStorage.removeItem('sc_connections');
  };

  const loadSampleData = () => {
    setGroups(INITIAL_GROUPS);
    setResources(INITIAL_WORKSPACE_RESOURCES);
    setTasks(INITIAL_WORKSPACE_TASKS);
    setMessages(INITIAL_MESSAGES);
    setEvents(INITIAL_EVENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentGroup(INITIAL_GROUPS[0]);
    setSelectedChatId('dm-user-maya');
    setConnections([
      { id: 'conn-1', requesterId: 'user-maya', recipientId: 'user-current', status: 'accepted', createdAt: '2026-09-10' },
      { id: 'conn-2', requesterId: 'user-current', recipientId: 'user-tariq', status: 'accepted', createdAt: '2026-09-12' },
      { id: 'conn-3', requesterId: 'user-sophia', recipientId: 'user-current', status: 'pending', createdAt: '2026-09-27' },
    ]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        groups,
        currentGroup,
        setCurrentGroup,
        resources,
        tasks,
        messages,
        events,
        notifications,
        connections,
        filterUniversityOnly,
        setFilterUniversityOnly,
        activeTab,
        setActiveTab,
        selectedChatId,
        setSelectedChatId,
        searchQuery,
        setSearchQuery,
        isCreateGroupOpen,
        setIsCreateGroupOpen,
        isCreateEventOpen,
        setIsCreateEventOpen,
        isUploadResourceOpen,
        setIsUploadResourceOpen,
        isE2EEModalOpen,
        setIsE2EEModalOpen,
        isWhatsAppSupportOpen,
        setIsWhatsAppSupportOpen,
        isReportModalOpen,
        setIsReportModalOpen,
        reportTarget,
        setReportTarget,
        switchUser,
        updateUserProfile,
        sendDirectMessage,
        sendGroupMessage,
        createGroup,
        joinGroup,
        leaveGroup,
        addWorkspaceResource,
        deleteWorkspaceResource,
        addWorkspaceTask,
        updateTaskStatus,
        createEvent,
        toggleRSVP,
        toggleEventReminder,
        exportEventToICS,
        requestConnection,
        acceptConnection,
        getConnectionStatus,
        blockUser,
        unblockUser,
        submitReport,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        requestBrowserPushPermission,
        pushPermissionState,
        clearAllData,
        loadSampleData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
