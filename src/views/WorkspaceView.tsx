import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WorkspaceTask, TaskStatus, TaskPriority } from '../types';
import { 
  FolderKanban, 
  UploadCloud, 
  Plus, 
  FileText, 
  Download, 
  CheckCircle2, 
  Check,
  Clock, 
  AlertCircle, 
  Send, 
  Paperclip, 
  Calendar, 
  Users, 
  Trash2, 
  CheckSquare, 
  MessageSquare,
  Lock,
  ChevronDown
} from 'lucide-react';

export const WorkspaceView: React.FC = () => {
  const {
    currentGroup,
    setCurrentGroup,
    groups,
    currentUser,
    resources,
    tasks,
    messages,
    events,
    deleteWorkspaceResource,
    addWorkspaceTask,
    updateTaskStatus,
    sendGroupMessage,
    setIsUploadResourceOpen,
    setIsCreateEventOpen,
    setActiveTab,
  } = useApp();

  const [activeTab, setActiveWorkspaceTab] = useState<'files' | 'tasks' | 'chat' | 'sessions'>('files');
  const [resourceFilter, setResourceFilter] = useState<string>('all');
  
  // Task creation state
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('2026-10-08');

  // Chat state
  const [chatInput, setChatInput] = useState('');

  if (!currentGroup) {
    return (
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4 border border-indigo-300">
          <FolderKanban className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Student Team Workspace</h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto mt-1 leading-relaxed">
          Every study group and project team has a dedicated workspace equipped with private resource sharing, task milestones, encrypted discussions, and calendar scheduling.
        </p>

        {/* 4 Feature Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 text-left">
          <div className="p-3 rounded-xl bg-sky-50 border border-sky-200">
            <span className="text-[10px] font-bold text-sky-800 uppercase block">1. File Manager</span>
            <p className="text-[11px] text-sky-950 font-medium mt-0.5">Notes, slides & past papers</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-[10px] font-bold text-emerald-800 uppercase block">2. Kanban Board</span>
            <p className="text-[11px] text-emerald-950 font-medium mt-0.5">To do, in progress, done</p>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
            <span className="text-[10px] font-bold text-purple-800 uppercase block">3. Group Chat</span>
            <p className="text-[11px] text-purple-950 font-medium mt-0.5">E2EE team discussions</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-[10px] font-bold text-amber-800 uppercase block">4. Study Meetups</span>
            <p className="text-[11px] text-amber-950 font-medium mt-0.5">Library sessions & RSVP</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setActiveTab('groups')}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-xs"
          >
            Explore or Join a Group
          </button>
        </div>
      </div>
    );
  }

  // Filter items for current group
  const groupResources = resources.filter(r => r.groupId === currentGroup.id && (resourceFilter === 'all' || r.category === resourceFilter));
  const groupTasks = tasks.filter(t => t.groupId === currentGroup.id);
  const groupMessages = messages.filter(m => m.groupId === currentGroup.id);
  const groupEvents = events.filter(e => e.groupId === currentGroup.id);

  // User membership role in this group
  const myMembership = currentGroup.members.find(m => m.userId === currentUser.id);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addWorkspaceTask({
      groupId: currentGroup.id,
      title: newTaskTitle,
      description: newTaskDesc,
      status: 'todo',
      priority: newTaskPriority,
      assigneeId: currentUser.id,
      assigneeName: currentUser.name,
      dueDate: newTaskDueDate,
    });

    setNewTaskTitle('');
    setNewTaskDesc('');
    setShowAddTask(false);
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendGroupMessage(currentGroup.id, chatInput);
    setChatInput('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Workspace Header & Switcher */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {/* Top Colorful Brand Stripes */}
        <div className="h-1.5 w-full flex">
          <div className="flex-1 bg-sky-500" />
          <div className="flex-1 bg-emerald-500" />
          <div className="flex-1 bg-purple-600" />
          <div className="flex-1 bg-rose-500" />
          <div className="flex-1 bg-amber-400" />
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <img
                src={currentGroup.avatar}
                alt={currentGroup.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-sky-300 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white"
                    style={{ backgroundColor: currentGroup.solidBadgeColor }}
                  >
                    {currentGroup.category.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                    {currentGroup.university}
                  </span>
                  {myMembership && (
                    <span className="text-[10px] font-bold text-sky-900 bg-sky-100 border border-sky-300 px-2 py-0.5 rounded uppercase">
                      Role: {myMembership.role}
                    </span>
                  )}
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                  {currentGroup.name}
                </h1>
                <p className="text-xs text-slate-600 mt-0.5">
                  {currentGroup.description}
                </p>
              </div>
            </div>

            {/* Group Switcher dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="relative">
                <select
                  value={currentGroup.id}
                  onChange={(e) => {
                    const g = groups.find(x => x.id === e.target.value);
                    if (g) setCurrentGroup(g);
                  }}
                  className="py-2 pl-3 pr-8 text-xs font-bold rounded-xl bg-slate-50 border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      Switch: {g.name.length > 25 ? g.name.substring(0, 25) + '...' : g.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Workspace Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100 overflow-x-auto text-xs">
            <button
              onClick={() => setActiveWorkspaceTab('files')}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition shrink-0 ${
                activeTab === 'files'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>Files & Resources ({groupResources.length})</span>
            </button>

            <button
              onClick={() => setActiveWorkspaceTab('tasks')}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition shrink-0 ${
                activeTab === 'tasks'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Tasks & Activities ({groupTasks.length})</span>
            </button>

            <button
              onClick={() => setActiveWorkspaceTab('chat')}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition shrink-0 ${
                activeTab === 'chat'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Team Discussion</span>
            </button>

            <button
              onClick={() => setActiveWorkspaceTab('sessions')}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition shrink-0 ${
                activeTab === 'sessions'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Study Meetings ({groupEvents.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: FILES & RESOURCES */}
      {activeTab === 'files' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto text-xs">
              {['all', 'notes', 'past_paper', 'slides', 'assignment', 'code'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setResourceFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition ${
                    resourceFilter === cat
                      ? 'bg-slate-900 text-white font-bold'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat.replace('_', ' ')}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsUploadResourceOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-sky-600 hover:bg-sky-700 text-white transition flex items-center gap-1.5 shadow-xs shrink-0"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Study Resource</span>
            </button>
          </div>

          {groupResources.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800">No resources uploaded yet</p>
              <p className="text-xs text-slate-500 mt-1">Upload study notes, lecture slides, or past paper solutions.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {groupResources.map((res) => (
                <div
                  key={res.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 leading-snug break-all">
                            {res.title}
                          </h4>
                          <span className="text-[10px] text-slate-400">
                            {res.fileSize} &bull; Uploaded by {res.uploadedByName} ({res.uploadedAt})
                          </span>
                        </div>
                      </div>

                      {res.uploadedBy === currentUser.id && (
                        <button
                          onClick={() => deleteWorkspaceResource(res.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="Delete resource"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {res.description && (
                      <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                        {res.description}
                      </p>
                    )}

                    {res.contentSnippet && (
                      <div className="mt-2.5 p-2 bg-slate-50 rounded-lg border border-slate-100 font-mono text-[10px] text-slate-700 max-h-24 overflow-y-auto whitespace-pre-wrap">
                        {res.contentSnippet}
                      </div>
                    )}
                  </div>

                  <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] uppercase font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                      {res.category.replace('_', ' ')}
                    </span>

                    <button
                      onClick={() => {
                        const blob = new Blob([res.contentSnippet || 'Students Connect Resource Document'], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = res.title;
                        a.click();
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TASKS & ACTIVITIES (KANBAN) */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Project & Assignment Milestones</h3>
            <button
              onClick={() => setShowAddTask(!showAddTask)}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-sky-600 hover:bg-sky-700 text-white transition flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>

          {/* Add Task Form */}
          {showAddTask && (
            <form onSubmit={handleCreateTask} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-900">New Group Task / Activity</h4>
              <input
                type="text"
                required
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Task title (e.g. Implement A* heuristic function)"
                className="w-full text-xs rounded-lg border border-slate-200 p-2 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <textarea
                rows={2}
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
                placeholder="Description, requirements, or links..."
                className="w-full text-xs rounded-lg border border-slate-200 p-2 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                    className="w-full text-xs rounded-lg border border-slate-200 p-2 bg-slate-50 text-slate-800"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-200 p-2 bg-slate-50 text-slate-800"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold bg-sky-600 text-white rounded-lg hover:bg-sky-700"
                >
                  Save Task
                </button>
              </div>
            </form>
          )}

          {/* Kanban Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* To Do */}
            <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3 bg-slate-700 text-white px-3 py-2 rounded-xl">
                <span className="text-xs font-bold uppercase tracking-wider">
                  To Do ({groupTasks.filter(t => t.status === 'todo').length})
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              </div>
              <div className="space-y-2.5">
                {groupTasks.filter(t => t.status === 'todo').map((task) => (
                  <div key={task.id} className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
                    <div className="flex items-start justify-between gap-1">
                      <h5 className="text-xs font-bold text-slate-900">{task.title}</h5>
                      <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                        task.priority === 'high' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    {task.description && <p className="text-[11px] text-slate-500 mt-1">{task.description}</p>}
                    <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Due: {task.dueDate}</span>
                      <button
                        onClick={() => updateTaskStatus(task.id, 'in_progress')}
                        className="text-sky-600 hover:underline font-bold"
                      >
                        Start &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* In Progress */}
            <div className="bg-amber-50/60 border-2 border-amber-300 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3 bg-amber-500 text-white px-3 py-2 rounded-xl">
                <span className="text-xs font-bold uppercase tracking-wider">
                  In Progress ({groupTasks.filter(t => t.status === 'in_progress').length})
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-white" />
              </div>
              <div className="space-y-2.5">
                {groupTasks.filter(t => t.status === 'in_progress').map((task) => (
                  <div key={task.id} className="bg-white border-2 border-amber-200 rounded-xl p-3 shadow-xs">
                    <div className="flex items-start justify-between gap-1">
                      <h5 className="text-xs font-bold text-slate-900">{task.title}</h5>
                      <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                        task.priority === 'high' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    {task.description && <p className="text-[11px] text-slate-600 mt-1">{task.description}</p>}
                    <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500">
                      <span>Assignee: {task.assigneeName}</span>
                      <button
                        onClick={() => updateTaskStatus(task.id, 'completed')}
                        className="text-emerald-700 hover:underline font-bold"
                      >
                        Complete &check;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Completed */}
            <div className="bg-emerald-50/60 border-2 border-emerald-300 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3 bg-emerald-600 text-white px-3 py-2 rounded-xl">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Completed ({groupTasks.filter(t => t.status === 'completed').length})
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-white" />
              </div>
              <div className="space-y-2.5">
                {groupTasks.filter(t => t.status === 'completed').map((task) => (
                  <div key={task.id} className="bg-white border-2 border-emerald-200 rounded-xl p-3 shadow-xs opacity-90">
                    <h5 className="text-xs font-bold text-slate-800 line-through">{task.title}</h5>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-emerald-800 font-bold">
                      <span className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Finished by {task.assigneeName}</span>
                      </span>
                      <button
                        onClick={() => updateTaskStatus(task.id, 'in_progress')}
                        className="text-slate-400 hover:text-slate-600 hover:underline"
                      >
                        Reopen
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TEAM DISCUSSION (ENCRYPTED) */}
      {activeTab === 'chat' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col h-[520px]">
          {/* Chat security banner */}
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-sky-800 font-semibold">
              <Lock className="w-3.5 h-3.5 text-sky-600" />
              End-to-End Encrypted Group Workspace Channel
            </span>
            <span className="text-slate-500 text-[11px]">{currentGroup.members.length} members</span>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {groupMessages.length === 0 ? (
              <div className="text-center text-xs text-slate-400 pt-12">
                No messages in this workspace yet. Start the conversation!
              </div>
            ) : (
              groupMessages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div key={msg.id} className={`flex gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    {!isMe && (
                      <img
                        src={msg.senderAvatar}
                        alt={msg.senderName}
                        className="w-7 h-7 rounded-lg object-cover border border-slate-200 shrink-0 mt-0.5"
                      />
                    )}
                    <div className={`max-w-[75%] rounded-2xl p-3 text-xs ${
                      isMe
                        ? 'bg-sky-600 text-white rounded-br-xs'
                        : 'bg-slate-100 text-slate-900 rounded-bl-xs'
                    }`}>
                      {!isMe && <p className="font-bold text-[10px] text-slate-500 mb-0.5">{msg.senderName}</p>}
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      <span className={`block text-[9px] mt-1 text-right ${isMe ? 'text-sky-200' : 'text-slate-400'}`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendChatMessage} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsUploadResourceOpen(true)}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
              title="Attach study file to workspace"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={`Message #${currentGroup.name}...`}
              className="flex-1 text-xs rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
            <button
              type="submit"
              className="p-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: STUDY SESSIONS */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Group Study Sessions & Meetings</h3>
            <button
              onClick={() => setIsCreateEventOpen(true)}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-sky-600 hover:bg-sky-700 text-white transition flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule Session</span>
            </button>
          </div>

          {groupEvents.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800">No sessions scheduled for this group</p>
              <p className="text-xs text-slate-500 mt-1">Book a library study pod or online revision meeting.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {groupEvents.map((ev) => (
                <div key={ev.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{ev.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{ev.description}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                      <span>{new Date(ev.dateTime).toLocaleString()}</span>
                      <span>&bull;</span>
                      <span>{ev.locationDetails}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('events')}
                    className="px-3 py-1.5 text-xs font-semibold text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-lg transition shrink-0"
                  >
                    View RSVP & Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
