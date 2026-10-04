import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { E2EEVerificationModal } from '../components/E2EEVerificationModal';
import { 
  MessageSquareLock, 
  Search, 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  Mic, 
  ShieldCheck, 
  Check, 
  CheckCheck, 
  FileText, 
  Lock, 
  Download, 
  Play, 
  Pause,
  AlertCircle,
  MoreVertical
} from 'lucide-react';

export const MessagesView: React.FC = () => {
  const {
    currentUser,
    users,
    groups,
    messages,
    selectedChatId,
    setSelectedChatId,
    sendDirectMessage,
    sendGroupMessage,
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [showE2EEModal, setShowE2EEModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedChatId]);

  // Determine active conversation details
  const isDirectChat = selectedChatId?.startsWith('dm-') ?? false;
  const partnerId = isDirectChat && selectedChatId ? selectedChatId.replace('dm-', '') : null;
  const partnerUser = partnerId ? users.find(u => u.id === partnerId) : undefined;
  const currentGroupChat = !isDirectChat && selectedChatId ? groups.find(g => g.id === selectedChatId) : null;

  // Active thread messages
  const currentThreadMessages = messages.filter(m => m.conversationId === selectedChatId);

  // Build conversations list
  // 1-to-1 partners: all users except current user
  const directChats = users
    .filter(u => u.id !== currentUser.id)
    .map(u => {
      const convId = `dm-${u.id}`;
      const lastMsg = messages
        .filter(m => m.conversationId === convId)
        .slice(-1)[0];
      return {
        id: convId,
        type: 'direct' as const,
        user: u,
        lastMsg,
      };
    });

  // Group chats
  const groupChats = groups
    .filter(g => g.members.some(m => m.userId === currentUser.id))
    .map(g => {
      const lastMsg = messages
        .filter(m => m.conversationId === g.id)
        .slice(-1)[0];
      return {
        id: g.id,
        type: 'group' as const,
        group: g,
        lastMsg,
      };
    });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    if (isDirectChat && partnerId) {
      sendDirectMessage(partnerId, inputVal);
    } else if (currentGroupChat) {
      sendGroupMessage(currentGroupChat.id, inputVal);
    }
    setInputVal('');
  };

  // Simulate sending sample image attachment
  const handleAttachImage = () => {
    const sampleImages = [
      { name: 'Lecture_Notes_Whiteboard.jpg', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80', size: '1.2 MB' },
      { name: 'Architecture_Blueprint_Sketch.png', url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80', size: '2.4 MB' },
    ];
    const img = sampleImages[Math.floor(Math.random() * sampleImages.length)];
    if (isDirectChat && partnerId) {
      sendDirectMessage(partnerId, `Shared an image: ${img.name}`, [
        { id: `att-${Date.now()}`, name: img.name, type: 'image', url: img.url, size: img.size }
      ]);
    } else if (currentGroupChat) {
      sendGroupMessage(currentGroupChat.id, `Shared an image: ${img.name}`, [
        { id: `att-${Date.now()}`, name: img.name, type: 'image', url: img.url, size: img.size }
      ]);
    }
  };

  // Simulate sending sample document attachment
  const handleAttachDocument = () => {
    const sampleDocs = [
      { name: 'Tutorial_3_Proof_Solutions.pdf', url: '#', size: '3.1 MB' },
      { name: 'Lab_Report_Format_Guidelines.docx', url: '#', size: '820 KB' },
    ];
    const doc = sampleDocs[Math.floor(Math.random() * sampleDocs.length)];
    if (isDirectChat && partnerId) {
      sendDirectMessage(partnerId, `Sent document: ${doc.name}`, [
        { id: `att-${Date.now()}`, name: doc.name, type: 'document', url: doc.url, size: doc.size }
      ]);
    } else if (currentGroupChat) {
      sendGroupMessage(currentGroupChat.id, `Sent document: ${doc.name}`, [
        { id: `att-${Date.now()}`, name: doc.name, type: 'document', url: doc.url, size: doc.size }
      ]);
    }
  };

  // Simulate voice recording & send
  const handleSendVoiceNote = () => {
    setIsVoiceRecording(true);
    setTimeout(() => {
      setIsVoiceRecording(false);
      const voiceAtt = {
        id: `voice-${Date.now()}`,
        name: 'Voice Note (0:18)',
        type: 'voice' as const,
        url: '#',
        duration: '0:18',
      };
      if (isDirectChat && partnerId) {
        sendDirectMessage(partnerId, 'Voice Note message', [voiceAtt]);
      } else if (currentGroupChat) {
        sendGroupMessage(currentGroupChat.id, 'Voice Note message', [voiceAtt]);
      }
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] pb-4">
      <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col h-full">
        {/* Top Colorful Brand Stripes */}
        <div className="h-1.5 w-full flex shrink-0">
          <div className="flex-1 bg-rose-500" />
          <div className="flex-1 bg-purple-600" />
          <div className="flex-1 bg-sky-500" />
          <div className="flex-1 bg-emerald-500" />
          <div className="flex-1 bg-amber-400" />
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Left Side: Conversation List */}
          <div className="w-80 sm:w-96 border-r border-slate-200 flex flex-col shrink-0">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquareLock className="w-4 h-4 text-rose-600" />
                  <span>Encrypted Chats</span>
                </h2>
                <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full shadow-xs">
                  E2EE Active
                </span>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-rose-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {/* Direct Messages Section */}
            <div className="p-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                Direct Messages (1-to-1)
              </span>
              {directChats.map(({ id, user, lastMsg }) => {
                const isSelected = selectedChatId === id;
                return (
                  <button
                    key={id}
                    onClick={() => setSelectedChatId(id)}
                    className={`w-full p-2.5 rounded-xl text-left flex items-start gap-3 transition ${
                      isSelected
                        ? 'bg-sky-50 text-slate-900 border border-sky-200'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                      />
                      {user.status === 'online' && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900 truncate">{user.name}</span>
                        {lastMsg && (
                          <span className="text-[10px] text-slate-400 shrink-0">{lastMsg.timestamp}</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {lastMsg ? lastMsg.text : `${user.course} (${user.university.split(' ')[0]})`}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Group Channels Section */}
            <div className="p-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                Group Workspaces
              </span>
              {groupChats.map(({ id, group, lastMsg }) => {
                const isSelected = selectedChatId === id;
                return (
                  <button
                    key={id}
                    onClick={() => setSelectedChatId(id)}
                    className={`w-full p-2.5 rounded-xl text-left flex items-start gap-3 transition ${
                      isSelected
                        ? 'bg-sky-50 text-slate-900 border border-sky-200'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <img
                      src={group.avatar}
                      alt={group.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900 truncate">#{group.name}</span>
                        {lastMsg && (
                          <span className="text-[10px] text-slate-400 shrink-0">{lastMsg.timestamp}</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {lastMsg ? `${lastMsg.senderName}: ${lastMsg.text}` : `${group.members.length} members`}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Active Chat Thread or Colorful Empty Placeholder */}
        {partnerUser || currentGroupChat ? (
          <div className="flex-1 flex flex-col min-w-0 bg-slate-50/30">
            {/* Active Chat Header */}
            <div className="px-5 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                {partnerUser ? (
                  <>
                    <img
                      src={partnerUser.avatar}
                      alt={partnerUser.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-slate-900 truncate">{partnerUser.name}</h3>
                        <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {partnerUser.course} &bull; {partnerUser.university}
                      </p>
                    </div>
                  </>
                ) : currentGroupChat ? (
                  <>
                    <img
                      src={currentGroupChat.avatar}
                      alt={currentGroupChat.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{currentGroupChat.name}</h3>
                      <p className="text-[11px] text-slate-500 truncate">
                        {currentGroupChat.members.length} members &bull; {currentGroupChat.university}
                      </p>
                    </div>
                  </>
                ) : null}
              </div>

              {/* E2EE Safety Numbers verification button */}
              <div className="flex items-center gap-2 shrink-0">
                {partnerUser && (
                  <button
                    onClick={() => setShowE2EEModal(true)}
                    className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-300 transition flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5 text-sky-600" />
                    <span className="hidden sm:inline">Verify Safety Numbers</span>
                    <span className="sm:hidden">Verify</span>
                  </button>
                )}
              </div>
            </div>

            {/* Encryption Indicator Banner */}
            <div className="px-4 py-2 bg-sky-100/70 border-b border-sky-200 flex items-center justify-center gap-2 text-center text-xs text-sky-950 font-medium">
              <Lock className="w-3.5 h-3.5 text-sky-700 shrink-0" />
              <span>Messages and files in this thread are protected by 256-bit End-to-End Encryption.</span>
            </div>

            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {currentThreadMessages.length === 0 && (
                <div className="text-center py-12 px-4 max-w-sm mx-auto space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto border border-sky-300">
                    <MessageSquareLock className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Encrypted Conversation with {partnerUser?.name || currentGroupChat?.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Say hello, share lecture notes, exchange diagram images, or send an audio voice note.
                  </p>
                </div>
              )}
              {currentThreadMessages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;

              return (
                <div key={msg.id} className={`flex gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
                  {!isMe && (
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0 mt-0.5"
                    />
                  )}

                  <div className={`max-w-[80%] sm:max-w-[70%] rounded-2xl p-3.5 text-xs ${
                    isMe
                      ? 'bg-sky-600 text-white rounded-br-xs shadow-xs'
                      : 'bg-white text-slate-900 border border-slate-200 rounded-bl-xs shadow-xs'
                  }`}>
                    {!isMe && (
                      <p className="font-bold text-[11px] text-slate-500 mb-1">{msg.senderName}</p>
                    )}

                    {msg.text && (
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    )}

                    {/* Attachments rendering */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-2.5 space-y-2">
                        {msg.attachments.map((att) => {
                          if (att.type === 'image') {
                            return (
                              <div key={att.id} className="rounded-xl overflow-hidden border border-slate-200/40">
                                <img src={att.url} alt={att.name} className="max-h-56 w-full object-cover" />
                                <div className={`p-1.5 text-[10px] flex items-center justify-between ${
                                  isMe ? 'bg-sky-700 text-sky-100' : 'bg-slate-50 text-slate-600'
                                }`}>
                                  <span className="truncate">{att.name}</span>
                                  <span>{att.size}</span>
                                </div>
                              </div>
                            );
                          }

                          if (att.type === 'voice') {
                            const isPlaying = playingVoiceId === att.id;
                            return (
                              <div
                                key={att.id}
                                className={`p-2.5 rounded-xl flex items-center gap-3 ${
                                  isMe ? 'bg-sky-700/60' : 'bg-slate-100'
                                }`}
                              >
                                <button
                                  onClick={() => setPlayingVoiceId(isPlaying ? null : att.id)}
                                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                                    isMe ? 'bg-white text-sky-700' : 'bg-sky-600 text-white'
                                  }`}
                                >
                                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                                </button>
                                <div className="flex-1">
                                  <div className="h-1.5 bg-slate-300 rounded-full overflow-hidden">
                                    <div className={`h-full ${isMe ? 'bg-white' : 'bg-sky-600'} ${isPlaying ? 'w-2/3 animate-pulse' : 'w-1/4'}`} />
                                  </div>
                                  <span className="text-[10px] opacity-80 mt-1 block">Voice Note ({att.duration})</span>
                                </div>
                              </div>
                            );
                          }

                          // Document file
                          return (
                            <div
                              key={att.id}
                              className={`p-2.5 rounded-xl flex items-center justify-between gap-3 ${
                                isMe ? 'bg-sky-700/60' : 'bg-slate-100'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText className="w-5 h-5 shrink-0" />
                                <div className="truncate">
                                  <span className="font-semibold block truncate">{att.name}</span>
                                  <span className="text-[10px] opacity-80">{att.size}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  const blob = new Blob(['Document content'], { type: 'text/plain' });
                                  const a = document.createElement('a');
                                  a.href = URL.createObjectURL(blob);
                                  a.download = att.name;
                                  a.click();
                                }}
                                className={`p-1.5 rounded-lg transition ${
                                  isMe ? 'hover:bg-sky-800' : 'hover:bg-slate-200'
                                }`}
                                title="Download Document"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="mt-1 flex items-center justify-end gap-1 text-[9px]">
                      <span className={isMe ? 'text-sky-200' : 'text-slate-400'}>
                        {msg.timestamp}
                      </span>
                      {isMe && (
                        <CheckCheck className="w-3.5 h-3.5 text-sky-200" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Voice recording status indicator */}
          {isVoiceRecording && (
            <div className="p-2 bg-rose-50 border-t border-rose-200 text-rose-700 text-xs flex items-center justify-center gap-2 animate-pulse font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
              Recording audio note...
            </div>
          )}

          {/* Message Composer */}
          <form onSubmit={handleSend} className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2">
            <button
              type="button"
              onClick={handleAttachImage}
              title="Attach Image"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleAttachDocument}
              title="Attach Document or Past Paper"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleSendVoiceNote}
              title="Record Voice Note"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Type an encrypted message..."
              className="flex-1 text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:bg-white transition"
            />

            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="p-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-xl transition shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
          <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mb-4 border-2 border-sky-300 shadow-xs">
            <MessageSquareLock className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Secure Student Messaging</h3>
          <p className="text-xs text-slate-600 max-w-sm mt-1 leading-relaxed">
            Select a student or group channel to start exchanging encrypted text, past papers, diagrams, and voice notes.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 max-w-md">
            {users.filter(u => u.id !== currentUser.id).slice(0, 4).map(u => (
              <button
                key={u.id}
                onClick={() => setSelectedChatId(`dm-${u.id}`)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50 transition flex items-center gap-2 text-xs font-semibold text-slate-800 shadow-xs"
              >
                <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-md object-cover" />
                <span>Message {u.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      )}
        </div>
      </div>

      {/* Safety Numbers Modal */}
      {partnerUser && (
        <E2EEVerificationModal
          partnerName={partnerUser.name}
          partnerFingerprint={partnerUser.e2eeFingerprint}
          isOpen={showE2EEModal}
          onClose={() => setShowE2EEModal(false)}
        />
      )}
    </div>
  );
};
