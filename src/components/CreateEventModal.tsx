import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EventCategory } from '../types';
import { Calendar, X, Clock, MapPin, Users, Video } from 'lucide-react';

export const CreateEventModal: React.FC = () => {
  const { isCreateEventOpen, setIsCreateEventOpen, createEvent, groups, currentUser, setActiveTab } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('study_session');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('2026-10-05');
  const [time, setTime] = useState('16:00');
  const [duration, setDuration] = useState('2 hours');
  const [locationType, setLocationType] = useState<'in_person' | 'online'>('in_person');
  const [locationDetails, setLocationDetails] = useState('Central Library, Study Room 3');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('none');
  const [maxAttendees, setMaxAttendees] = useState<number>(15);

  if (!isCreateEventOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const matchedGroup = groups.find(g => g.id === selectedGroupId);

    createEvent({
      title,
      category,
      description,
      university: matchedGroup?.university || currentUser.university,
      locationType,
      locationDetails,
      dateTime: `${date}T${time}:00`,
      duration,
      groupId: selectedGroupId !== 'none' ? selectedGroupId : undefined,
      groupName: matchedGroup?.name,
      maxAttendees: Number(maxAttendees) || undefined,
      isPrivateCircleEvent: category === 'hangout' || category === 'game_night' || category === 'trip' || category === 'birthday',
    });

    setIsCreateEventOpen(false);
    setActiveTab('events');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 text-slate-900 relative my-8">
        <button
          onClick={() => setIsCreateEventOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Schedule Session or Meetup</h3>
            <p className="text-xs text-slate-500">Study sessions, workshops, project meetings, or social hangouts</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Event Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Organic Chemistry Final Exam Cram Session"
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="study_session">Study Session</option>
                <option value="workshop">Workshop</option>
                <option value="seminar">Seminar / Speaker</option>
                <option value="project_meeting">Project Sprint Meeting</option>
                <option value="academic_event">Academic Event</option>
                <option value="social_meetup">Social Meetup</option>
                <option value="hangout">Casual Hangout</option>
                <option value="game_night">Game Night</option>
                <option value="sports">Sports & Fitness</option>
                <option value="trip">Weekend Trip / Hike</option>
                <option value="birthday">Birthday Celebration</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Host Under Group (Optional)
              </label>
              <select
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="none">Open Campus / Independent</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 90 mins"
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Location Format
            </label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                type="button"
                onClick={() => {
                  setLocationType('in_person');
                  setLocationDetails('Main Campus Library Study Pod');
                }}
                className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  locationType === 'in_person'
                    ? 'border-sky-500 bg-sky-50 text-sky-900'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>In-Person Campus</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLocationType('online');
                  setLocationDetails('Google Meet / Zoom Conference Link');
                }}
                className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  locationType === 'online'
                    ? 'border-sky-500 bg-sky-50 text-sky-900'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Online / Video Call</span>
              </button>
            </div>
            <input
              type="text"
              required
              value={locationDetails}
              onChange={(e) => setLocationDetails(e.target.value)}
              placeholder="Room number, library floor, or video call link"
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description & Agenda
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will be covered? What should attendees bring (laptops, notes)?"
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreateEventOpen(false)}
              className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition shadow-sm"
            >
              Schedule Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
