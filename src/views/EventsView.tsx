import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EventCategory, EventItem } from '../types';
import { 
  Calendar, 
  Plus, 
  Clock, 
  MapPin, 
  Users, 
  Bell, 
  BellOff, 
  Download, 
  Check, 
  Video, 
  Sparkles, 
  HeartHandshake, 
  BookOpen, 
  Filter, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

export const EventsView: React.FC = () => {
  const {
    events,
    currentUser,
    users,
    toggleRSVP,
    toggleEventReminder,
    exportEventToICS,
    setIsCreateEventOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'study' | 'social' | 'my_rsvps'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Filter events
  const filteredEvents = events.filter(ev => {
    if (activeTab === 'my_rsvps') {
      return ev.attendees.some(a => a.userId === currentUser.id && (a.status === 'going' || a.status === 'maybe'));
    }

    if (activeTab === 'study') {
      return ['study_session', 'workshop', 'seminar', 'project_meeting', 'academic_event'].includes(ev.category);
    }

    if (activeTab === 'social') {
      return ['social_meetup', 'hangout', 'trip', 'sports', 'game_night', 'birthday'].includes(ev.category);
    }

    return true;
  });

  const getCategoryBadge = (cat: EventCategory) => {
    switch (cat) {
      case 'study_session':
        return { label: 'Study Session', bg: 'bg-sky-100 text-sky-800' };
      case 'workshop':
        return { label: 'Workshop', bg: 'bg-indigo-100 text-indigo-800' };
      case 'seminar':
        return { label: 'Seminar', bg: 'bg-purple-100 text-purple-800' };
      case 'project_meeting':
        return { label: 'Project Sprint', bg: 'bg-emerald-100 text-emerald-800' };
      case 'academic_event':
        return { label: 'Academic Event', bg: 'bg-blue-100 text-blue-800' };
      case 'social_meetup':
      case 'hangout':
        return { label: 'Social Hangout', bg: 'bg-amber-100 text-amber-800' };
      case 'game_night':
        return { label: 'Game Night', bg: 'bg-rose-100 text-rose-800' };
      case 'sports':
        return { label: 'Sports & Fitness', bg: 'bg-teal-100 text-teal-800' };
      case 'trip':
        return { label: 'Weekend Trip', bg: 'bg-orange-100 text-orange-800' };
      case 'birthday':
        return { label: 'Birthday Meetup', bg: 'bg-pink-100 text-pink-800' };
      default:
        return { label: 'Event', bg: 'bg-slate-100 text-slate-800' };
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header and Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Study Sessions, Workshops & Meetups
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              RSVP to revision groups, academic seminars, hackathon prep, and campus friend social hangouts.
            </p>
          </div>

          <button
            onClick={() => setIsCreateEventOpen(true)}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-sky-600 hover:bg-sky-700 text-white transition flex items-center justify-center gap-1.5 shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Session</span>
          </button>
        </div>

        {/* Filter Tabs & View Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Events ({events.length})
            </button>

            <button
              onClick={() => setActiveTab('study')}
              className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'study'
                  ? 'bg-sky-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Academic & Study</span>
            </button>

            <button
              onClick={() => setActiveTab('social')}
              className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'social'
                  ? 'bg-amber-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Social Circles & Trips</span>
            </button>

            <button
              onClick={() => setActiveTab('my_rsvps')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                activeTab === 'my_rsvps'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              My RSVPs
            </button>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto border border-slate-200">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                viewMode === 'calendar' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Month Calendar
            </button>
          </div>
        </div>
      </div>

      {/* View Content */}
      {viewMode === 'list' ? (
        <div className="space-y-4">
          {filteredEvents.length === 0 ? (
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 sm:p-12 text-center shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-300">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Your Campus Calendar is Clear</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto mt-1 leading-relaxed">
                Book a library study pod, organize an exam cram revision session, or plan a weekend board game night.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto my-6 text-left">
                <div className="p-3 rounded-xl bg-sky-50 border border-sky-200">
                  <span className="text-[10px] font-bold text-sky-800 uppercase block">Study Sessions</span>
                  <p className="text-[11px] text-sky-950 font-medium mt-0.5">Library pods & exam revision</p>
                </div>
                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
                  <span className="text-[10px] font-bold text-indigo-800 uppercase block">Workshops</span>
                  <p className="text-[11px] text-indigo-950 font-medium mt-0.5">CV clinics & coding jams</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">Project Sprints</span>
                  <p className="text-[11px] text-emerald-950 font-medium mt-0.5">Hardware & capstone demos</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <span className="text-[10px] font-bold text-amber-800 uppercase block">Social Meetups</span>
                  <p className="text-[11px] text-amber-950 font-medium mt-0.5">Board games & weekend trips</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setIsCreateEventOpen(true)}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-sky-600 hover:bg-sky-700 text-white transition shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Schedule First Session</span>
                </button>
              </div>
            </div>
          ) : (
            filteredEvents.map((ev) => {
              const eventDate = new Date(ev.dateTime);
              const userRSVP = ev.attendees.find(a => a.userId === currentUser.id)?.status;
              const hasReminder = ev.remindersSet.includes(currentUser.id);
              const badge = getCategoryBadge(ev.category);

              const borderColors: Record<string, string> = {
                study_session: 'border-l-sky-500',
                workshop: 'border-l-indigo-500',
                seminar: 'border-l-purple-500',
                project_meeting: 'border-l-emerald-500',
                academic_event: 'border-l-blue-500',
                social_meetup: 'border-l-amber-500',
                hangout: 'border-l-amber-500',
                game_night: 'border-l-rose-500',
                sports: 'border-l-teal-500',
                trip: 'border-l-orange-500',
                birthday: 'border-l-pink-500',
              };
              const leftBorder = borderColors[ev.category] || 'border-l-slate-400';

              return (
                <div
                  key={ev.id}
                  className={`bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-5 border-l-4 ${leftBorder}`}
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${badge.bg}`}>
                        {badge.label}
                      </span>
                      {ev.groupName && (
                        <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                          {ev.groupName}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400">
                        Organized by {ev.organizerName}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {ev.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {ev.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1.5 font-medium text-slate-700">
                        <Clock className="w-4 h-4 text-sky-600" />
                        {eventDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })} at{' '}
                        {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({ev.duration})
                      </span>

                      <span className="flex items-center gap-1.5">
                        {ev.locationType === 'online' ? (
                          <Video className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <MapPin className="w-4 h-4 text-amber-600" />
                        )}
                        <span>{ev.locationDetails}</span>
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span>
                          {ev.attendees.filter(a => a.status === 'going').length} attending
                          {ev.maxAttendees ? ` / max ${ev.maxAttendees}` : ''}
                        </span>
                      </span>
                    </div>

                    {/* Attendee Avatars Preview */}
                    <div className="flex items-center gap-2 pt-2">
                      <div className="flex -space-x-1.5">
                        {ev.attendees
                          .filter(a => a.status === 'going')
                          .slice(0, 5)
                          .map(att => (
                            <img
                              key={att.userId}
                              src={att.avatar}
                              alt={att.name}
                              title={att.name}
                              className="w-6 h-6 rounded-full border border-white object-cover"
                            />
                          ))}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {ev.attendees.filter(a => a.status === 'going').map(a => a.name).join(', ')}
                      </span>
                    </div>
                  </div>

                  {/* Actions: RSVP, Reminder, Add to Calendar (.ics) */}
                  <div className="flex md:flex-col items-center md:items-end justify-between gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleRSVP(ev.id, 'going')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                          userRSVP === 'going'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {userRSVP === 'going' ? '✓ Going' : 'Going'}
                      </button>

                      <button
                        onClick={() => toggleRSVP(ev.id, 'maybe')}
                        className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition ${
                          userRSVP === 'maybe'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        Maybe
                      </button>

                      <button
                        onClick={() => toggleRSVP(ev.id, 'cant_go')}
                        className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition ${
                          userRSVP === 'cant_go'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-500'
                        }`}
                      >
                        Can't Go
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleEventReminder(ev.id)}
                        className={`p-2 rounded-lg text-xs font-medium border transition flex items-center gap-1 ${
                          hasReminder
                            ? 'bg-sky-50 border-sky-200 text-sky-800 font-bold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                        title={hasReminder ? 'Reminder enabled' : 'Set reminder'}
                      >
                        <Bell className={`w-3.5 h-3.5 ${hasReminder ? 'text-sky-600' : 'text-slate-400'}`} />
                        <span className="hidden sm:inline">{hasReminder ? 'Reminder On' : 'Remind'}</span>
                      </button>

                      <button
                        onClick={() => exportEventToICS(ev)}
                        className="p-2 rounded-lg text-xs font-medium border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition flex items-center gap-1"
                        title="Download .ics Calendar Invite"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-500" />
                        <span className="hidden sm:inline">Add to iCal</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Calendar Month Grid View */
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">October 2026 Academic Calendar</h3>
            <span className="text-xs text-slate-500">{filteredEvents.length} scheduled sessions</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-500 mb-2">
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
            <div>Sun</div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 31 }, (_, i) => {
              const day = i + 1;
              const dateStr = `2026-10-${day < 10 ? '0' + day : day}`;
              const dayEvents = filteredEvents.filter(e => e.dateTime.startsWith(dateStr));

              return (
                <div
                  key={day}
                  className={`min-h-24 p-2 rounded-xl border text-left flex flex-col justify-between ${
                    dayEvents.length > 0 ? 'bg-sky-50/40 border-sky-200' : 'bg-slate-50/30 border-slate-200'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-700">{day}</span>
                  <div className="space-y-1 my-1">
                    {dayEvents.map(e => (
                      <div
                        key={e.id}
                        className="text-[10px] p-1 rounded bg-sky-600 text-white font-medium truncate"
                        title={e.title}
                      >
                        {e.title}
                      </div>
                    ))}
                  </div>
                  {dayEvents.length > 0 && (
                    <span className="text-[9px] text-sky-700 font-semibold">{dayEvents.length} event(s)</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
