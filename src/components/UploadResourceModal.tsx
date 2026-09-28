import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UploadCloud, X, FileText, Check } from 'lucide-react';

export const UploadResourceModal: React.FC = () => {
  const { isUploadResourceOpen, setIsUploadResourceOpen, addWorkspaceResource, currentGroup } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'notes' | 'past_paper' | 'slides' | 'assignment' | 'code' | 'reading'>('notes');
  const [fileType, setFileType] = useState<'pdf' | 'docx' | 'zip' | 'image' | 'code' | 'txt'>('pdf');
  const [fileSize, setFileSize] = useState('2.4 MB');
  const [snippet, setSnippet] = useState('');

  if (!isUploadResourceOpen || !currentGroup) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addWorkspaceResource({
      groupId: currentGroup.id,
      title: title.endsWith(`.${fileType}`) ? title : `${title}.${fileType}`,
      description,
      category,
      fileType: fileType === 'code' ? 'txt' : fileType,
      fileSize,
      contentSnippet: snippet || undefined,
    });

    setIsUploadResourceOpen(false);
    setTitle('');
    setDescription('');
    setSnippet('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 text-slate-900 relative">
        <button
          onClick={() => setIsUploadResourceOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Upload to Workspace</h3>
            <p className="text-xs text-slate-500">Share study files with {currentGroup.name}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              File Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chapter 4 Graph Algorithms Annotated Notes"
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="notes">Lecture Notes</option>
                <option value="past_paper">Past Paper / Model Solution</option>
                <option value="slides">Presentation Slides</option>
                <option value="assignment">Assignment / Problem Set</option>
                <option value="code">Source Code / Test Script</option>
                <option value="reading">Journal Article / Reading</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Format
              </label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value as any)}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="pdf">PDF Document (.pdf)</option>
                <option value="docx">Word Document (.docx)</option>
                <option value="code">Code / Script (.py, .ts, .c)</option>
                <option value="zip">Archive (.zip)</option>
                <option value="image">Diagram / Image (.png)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description or Key Topics
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Includes worked examples for questions 1 to 4"
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Summary or Code Preview (Optional)
            </label>
            <textarea
              rows={2}
              value={snippet}
              onChange={(e) => setSnippet(e.target.value)}
              placeholder="Paste a helpful snippet, formula, or key derivation..."
              className="w-full text-xs font-mono rounded-lg border border-slate-200 p-2.5 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none"
            />
          </div>

          <div className="p-3 bg-sky-50 border border-sky-100 rounded-xl text-xs text-sky-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <FileText className="w-4 h-4 text-sky-600" />
              File ready: {title || 'Document'} ({fileSize})
            </span>
            <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-sky-200 font-semibold text-sky-700">
              Encrypted Storage
            </span>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsUploadResourceOpen(false)}
              className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition shadow-sm"
            >
              Upload Resource
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
