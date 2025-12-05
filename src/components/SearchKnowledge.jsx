import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Tag, Calendar, User, BookOpen, Filter, X, ChevronDown } from 'lucide-react';
import { getModuleById, SYLLABUS } from '../data/syllabus';

const SearchKnowledge = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedModule, setSelectedModule] = useState('');
  const [results, setResults] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  useEffect(() => {
    fetchAllTags();
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery || selectedTags.length > 0 || selectedModule) {
        performSearch();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedTags.join(','), selectedModule]); // Stabilized dependency

  const fetchAllTags = async () => {
    try {
      const res = await fetch('/api/knowledge/tags');
      const data = await res.json();
      setAllTags(data);
    } catch (error) {
      console.error('Failed to fetch tags', error);
    }
  };

  const performSearch = async () => {
    setLoading(true);
    setSearchPerformed(true);

    try {
      const params = new URLSearchParams();

      if (searchQuery.trim()) {
        params.append('q', searchQuery.trim());
      }

      if (selectedTags.length > 0) {
        params.append('tags', selectedTags.join(','));
      }

      if (selectedModule) {
        params.append('moduleId', selectedModule);
      }

      // Allow searching all notes (Wiki style)
      // if (user && user.role !== 'admin') {
      //   params.append('userId', user.id);
      // }

      const res = await fetch(`/api/knowledge/search?${params.toString()}`);
      const data = await res.json();

      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSelectedModule('');
    setResults([]);
    setSearchPerformed(false);
  };

  const getModuleName = (id) => {
    const mod = getModuleById(id);
    return mod ? `${mod.code} ${mod.title}` : id;
  };

  const highlightText = (text, query) => {
    if (!query) return text;
    // Escape special regex characters to prevent errors
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase()
        ? <mark key={i} className="bg-yellow-200 px-1">{part}</mark>
        : part
    );
  };

  const hasActiveFilters = searchQuery || selectedTags.length > 0 || selectedModule;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center mb-2">
          <Search className="mr-3 text-purple-600" size={32} /> 搜索知識庫
        </h2>
        <p className="text-slate-600">搜索所有筆記、按標籤篩選、找到你需要的學習資料</p>
      </div>

      {/* Search Interface */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-6">
        {/* Main Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索標題、內容或標籤... (如: python, sql, excel, elective A)"
            className="w-full pl-12 pr-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500 outline-none transition text-lg"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-slate-700 hover:text-purple-600 font-medium transition"
          >
            <Filter size={18} />
            <span>進階篩選</span>
            <ChevronDown size={16} className={`transform transition ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-1 text-sm text-slate-500 hover:text-slate-700"
            >
              <X size={14} />
              <span>清除所有篩選</span>
            </button>
          )}
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="space-y-4 pt-4 border-t border-slate-200">
            {/* Module Filter */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">按單元篩選</label>
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-200 outline-none"
              >
                <option value="">所有單元</option>
                <optgroup label="必修部分">
                  {SYLLABUS.compulsory.map(m => (
                    <option key={m.id} value={m.id}>{m.code} - {m.title}</option>
                  ))}
                </optgroup>
                <optgroup label="選修部分">
                  {SYLLABUS.electives.map(m => (
                    <option key={m.id} value={m.id}>{m.code} - {m.title}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Tag Filter */}
            {allTags.length > 0 && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                  <Tag size={14} className="mr-1" /> 按熱門標籤篩選
                </label>
                <div className="flex flex-wrap gap-2">
                  {allTags.slice(0, 20).map(({ tag, count }) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${selectedTags.includes(tag)
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                    >
                      {tag} <span className="text-xs opacity-70">({count})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Search Summary */}
        {searchPerformed && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            {loading ? (
              <p className="text-slate-600">搜索中...</p>
            ) : (
              <p className="text-slate-600">
                找到 <span className="font-bold text-purple-600 text-lg">{results.length}</span> 條符合的筆記
              </p>
            )}
          </div>
        )}
      </div>

      {/* Search Results */}
      {searchPerformed && !loading && (
        <div>
          {results.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-100">
              <BookOpen size={56} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 text-lg mb-2">沒有找到符合條件的筆記</p>
              <p className="text-slate-400 text-sm mb-4">試試使用不同的關鍵字或標籤</p>
              <button
                onClick={clearFilters}
                className="text-purple-600 hover:underline font-medium"
              >
                清除篩選條件
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {results.map(note => (
                <Link
                  key={note._id}
                  to={`/knowledge/${note._id}`}
                  className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-purple-200 transition block group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2 flex-wrap gap-2">
                        <span className="bg-purple-50 text-purple-700 text-xs px-2.5 py-1 rounded-md font-bold border border-purple-200">
                          {getModuleName(note.moduleId)}
                        </span>
                        {note.tags && note.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className={`text-xs px-2.5 py-1 rounded-md font-medium ${selectedTags.includes(tag)
                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-300 font-bold'
                                : 'bg-slate-100 text-slate-600'
                              }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-purple-600 transition">
                        {searchQuery ? highlightText(note.title, searchQuery) : note.title}
                      </h3>
                      <p className="text-slate-600 text-sm line-clamp-2 mb-2">
                        {note.content.substring(0, 150).replace(/[#*`]/g, '')}...
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <span className="flex items-center">
                          <User size={12} className="mr-1" />
                          {note.author?.username || 'Unknown'}
                        </span>
                        <span className="flex items-center">
                          <Calendar size={12} className="mr-1" />
                          {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Initial State */}
      {!searchPerformed && (
        <div className="text-center py-16 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-100">
          <Search size={64} className="mx-auto text-purple-400 mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">開始搜索</h3>
          <p className="text-slate-600 mb-4">輸入關鍵字或選擇標籤來搜索筆記</p>
          {allTags.length > 0 && (
            <div className="max-w-2xl mx-auto">
              <p className="text-sm text-slate-500 mb-3">熱門標籤:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {allTags.slice(0, 10).map(({ tag, count }) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className="px-4 py-2 bg-white rounded-full text-sm font-medium text-slate-700 hover:bg-purple-100 hover:text-purple-700 transition shadow-sm border border-slate-200"
                  >
                    {tag} ({count})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchKnowledge;
