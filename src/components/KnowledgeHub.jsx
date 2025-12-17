import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Tag, Calendar, User, BookOpen, Filter, X, ChevronDown, ArrowRight } from 'lucide-react';
import { getModuleById, SYLLABUS } from '../data/syllabus';

const KnowledgeHub = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedModule, setSelectedModule] = useState('');
  const [allKnowledge, setAllKnowledge] = useState([]);
  const [filteredKnowledge, setFilteredKnowledge] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchAllKnowledge();
    fetchAllTags();
  }, []);

  useEffect(() => {
    filterKnowledge();
  }, [allKnowledge, searchQuery, selectedTags, selectedModule]);

  const fetchAllKnowledge = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/knowledge/search');
      const data = await res.json();
      setAllKnowledge(data);
      setFilteredKnowledge(data);
    } catch (error) {
      console.error('Failed to fetch knowledge', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTags = async () => {
    try {
      const res = await fetch('/api/knowledge/tags');
      const data = await res.json();
      setAllTags(data);
    } catch (error) {
      console.error('Failed to fetch tags', error);
    }
  };

  const filterKnowledge = () => {
    let filtered = [...allKnowledge];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        return (
          item.title.toLowerCase().includes(query) ||
          item.content.toLowerCase().includes(query) ||
          (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query)))
        );
      });
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      const selectedTagsLower = new Set(selectedTags.map(t => t.toLowerCase()));
      filtered = filtered.filter(item => {
        if (!item.tags) return false;
        const itemTags = item.tags.map(t => t.toLowerCase());
        return Array.from(selectedTagsLower).every(selectedTag =>
          itemTags.some(itemTag => itemTag.includes(selectedTag))
        );
      });
    }

    // Filter by module
    if (selectedModule) {
      filtered = filtered.filter(item => item.moduleId === selectedModule);
    }

    setFilteredKnowledge(filtered);
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
  };

  const getModuleName = (id) => {
    const mod = getModuleById(id);
    return mod ? `${mod.code} ${mod.title}` : id;
  };

  const hasActiveFilters = searchQuery || selectedTags.length > 0 || selectedModule;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800 flex items-center mb-3">
          <BookOpen className="mr-3 text-purple-600" size={40} /> 知識庫
        </h1>
        <p className="text-slate-600 text-lg">瀏覽所有用戶分享的學習筆記和知識點</p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-6">
        {/* Main Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索標題、內容或標籤... (如: python, sql, excel)"
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
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                        selectedTags.includes(tag)
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

        {/* Results Summary */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-slate-600">
            顯示 <span className="font-bold text-purple-600 text-lg">{filteredKnowledge.length}</span> / {allKnowledge.length} 條筆記
          </p>
        </div>
      </div>

      {/* Knowledge Grid */}
      {filteredKnowledge.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-100">
          <BookOpen size={56} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 text-lg mb-2">沒有找到符合條件的筆記</p>
          {hasActiveFilters ? (
            <>
              <p className="text-slate-400 text-sm mb-4">試試使用不同的關鍵字或標籤</p>
              <button
                onClick={clearFilters}
                className="text-purple-600 hover:underline font-medium"
              >
                清除篩選條件
              </button>
            </>
          ) : (
            <p className="text-slate-400 text-sm">還沒有用戶分享知識點</p>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredKnowledge.map(item => (
            <Link
              key={item._id}
              to={`/knowledge/${item._id}`}
              className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-purple-200 transition block group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2 flex-wrap gap-2">
                    <span className="bg-purple-50 text-purple-700 text-xs px-2.5 py-1 rounded-md font-bold border border-purple-200">
                      {getModuleName(item.moduleId)}
                    </span>
                    {item.tags && item.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                          selectedTags.includes(tag)
                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-300 font-bold'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-purple-600 transition">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-sm line-clamp-2 mb-2">
                    {item.content.substring(0, 150).replace(/[#*`]/g, '')}...
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-slate-500">
                    <span className="flex items-center">
                      <User size={12} className="mr-1" />
                      {item.author?.username || 'Anonymous'}
                    </span>
                    <span className="flex items-center">
                      <Calendar size={12} className="mr-1" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <ArrowRight className="text-purple-400 group-hover:text-purple-600 group-hover:translate-x-1 transition" size={24} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Call to Action for logged-out users */}
      {!user && (
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8 text-center border border-purple-100">
          <h3 className="text-xl font-bold text-slate-800 mb-2">加入我們，分享你的知識！</h3>
          <p className="text-slate-600 mb-4">註冊賬號即可創建和分享你的學習筆記</p>
          <Link
            to="/login"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-medium"
          >
            立即註冊或登入
          </Link>
        </div>
      )}
    </div>
  );
};

export default KnowledgeHub;
