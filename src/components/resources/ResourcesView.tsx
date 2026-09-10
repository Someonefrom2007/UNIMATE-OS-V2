import React, { useState, useMemo } from 'react';
import {
  FolderOpen,
  Search,
  Plus,
  FileText,
  FileSpreadsheet,
  File,
  Video,
  ExternalLink,
  Download,
  Trash2,
  Tag,
  BookOpen,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Paperclip,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Resource } from '../../types';

export const ResourcesView: React.FC = () => {
  const { resources, courses, addResource, deleteResource } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Resource Form state
  const [newTitle, setNewTitle] = useState('');
  const [newCourseId, setNewCourseId] = useState(courses[0]?.id || '');
  const [newType, setNewType] = useState<Resource['type']>('pdf');
  const [newUrl, setNewUrl] = useState('');
  const [newTag, setNewTag] = useState('Lecture Notes');
  const [newSize, setNewSize] = useState('2.4 MB');

  const filteredResources = useMemo(() => {
    return resources.filter(res => {
      const matchesSearch =
        res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (res.tag && res.tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCourse =
        selectedCourseFilter === 'all' || res.courseId === selectedCourseFilter;

      const matchesType =
        selectedTypeFilter === 'all' || res.type === selectedTypeFilter;

      return matchesSearch && matchesCourse && matchesType;
    });
  }, [resources, searchQuery, selectedCourseFilter, selectedTypeFilter]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addResource({
      title: newTitle.trim(),
      courseId: newCourseId,
      type: newType,
      url: newUrl.trim() || 'https://university.edu/materials/download',
      tag: newTag.trim() || undefined,
      size: newSize.trim() || undefined,
      isFavorite: false,
    });

    setNewTitle('');
    setNewUrl('');
    setIsAddModalOpen(false);
  };

  const getTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-4 h-4 text-red-400" />;
      case 'document':
        return <File className="w-4 h-4 text-blue-400" />;
      case 'slides':
        return <FileSpreadsheet className="w-4 h-4 text-amber-400" />;
      case 'link':
        return <ExternalLink className="w-4 h-4 text-emerald-400" />;
      case 'video':
        return <Video className="w-4 h-4 text-purple-400" />;
      default:
        return <Paperclip className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div id="resources-view" className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Productivity • Knowledge Repository</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            Academic Resources & Files
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              {resources.length} items
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Centralized syllabi, lecture slides, textbooks, problem sets, and external references connected to your courses.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Resource</span>
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search resources by title, topic, or tag..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {/* Course Filter */}
          <select
            value={selectedCourseFilter}
            onChange={e => setSelectedCourseFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="all">All Courses</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.name} ({course.code})
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={selectedTypeFilter}
            onChange={e => setSelectedTypeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="pdf">PDF Documents</option>
            <option value="slides">Lecture Slides</option>
            <option value="document">Documentation</option>
            <option value="link">Web Links</option>
            <option value="video">Videos</option>
          </select>
        </div>
      </div>

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/30 border border-slate-800/80 space-y-3">
          <FolderOpen className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-300">No resources found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || selectedCourseFilter !== 'all' || selectedTypeFilter !== 'all'
              ? 'No resources match your active search filters. Try clearing filters.'
              : 'Keep all your university PDFs, slides, and documentation linked to your courses in one place.'}
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/30 cursor-pointer transition-colors"
          >
            Upload or Link First Resource
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map(res => {
            const course = courses.find(c => c.id === res.courseId);

            return (
              <div
                key={res.id}
                className="group relative p-4 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between shadow-sm hover:shadow-md"
              >
                <div>
                  {/* Top metadata */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded border truncate max-w-[170px]"
                      style={{
                        backgroundColor: course ? `${course.color}15` : '#64748b15',
                        borderColor: course ? `${course.color}40` : '#64748b40',
                        color: course ? course.color : '#94a3b8',
                      }}
                    >
                      {course ? course.name : 'General Academic'}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="p-1.5 rounded-md bg-slate-800 text-slate-300">
                        {getTypeIcon(res.type)}
                      </span>
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                        {res.type}
                      </span>
                    </div>
                  </div>

                  {/* Title & Tag */}
                  <h3 className="text-sm font-semibold text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-2 mb-2">
                    {res.title}
                  </h3>

                  {res.tag && (
                    <div className="flex items-center gap-1 mb-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-slate-400 text-[10px] font-mono">
                        <Tag className="w-2.5 h-2.5" />
                        {res.tag}
                      </span>
                      {res.size && (
                        <span className="text-[10px] font-mono text-slate-500">
                          • {res.size}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 mt-2">
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer"
                  >
                    <span>Open Material</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => deleteResource(res.id)}
                      title="Delete resource"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Resource Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg rounded-2xl bg-[#0d131f] border border-slate-800 p-6 shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                  <Plus className="w-4 h-4" />
                </span>
                <h2 className="text-base font-bold text-slate-100">Add Academic Resource</h2>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Resource Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Graph Theory Problem Set Solutions"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Course Link
                  </label>
                  <select
                    value={newCourseId}
                    onChange={e => setNewCourseId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Type
                  </label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as Resource['type'])}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="slides">Lecture Slides</option>
                    <option value="document">Documentation / Notes</option>
                    <option value="link">Web Reference</option>
                    <option value="video">Recorded Lecture</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  URL or File Location
                </label>
                <input
                  type="text"
                  placeholder="https://drive.google.com/... or https://university.edu/cs301/slides"
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400 font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Tag / Category
                  </label>
                  <input
                    type="text"
                    placeholder="Syllabus, Textbook, Lab Guide"
                    value={newTag}
                    onChange={e => setNewTag(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Size / Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 3.4 MB or 45 mins"
                    value={newSize}
                    onChange={e => setNewSize(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-md"
                >
                  Save Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
