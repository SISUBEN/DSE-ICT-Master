import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Trash2, Calendar, FileText, ArrowRight, Search, Tag, X } from 'lucide-react';
import { getModuleById } from '../data/syllabus';

const MyNotes = ({ user }) => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    fetchNotes();
    fetchAllTags();
  }, [user.id]);

  useEffect(() => {
    filterNotes();
  }, [notes, searchQuery, selectedTags]);

  const fetchNotes = async () => {
    try {
      const res = await fetch(`/api/knowledge/user/${user.id}`);
      const data = await res.json();
      setNotes(data);
      setFilteredNotes(data);
    } catch (error) {
      console.error('Failed to fetch notes', error);
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

  const filterNotes = () => {
    let filtered = notes;

    // Filter by search query (title, content, or tags)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(note => {
        // Check title and content
        if (note.title.toLowerCase().includes(query) || 
            note.content.toLowerCase().includes(query)) {
          return true;
        }
        // Check tags if they exist
        if (note.tags) {
          return note.tags.some(tag => tag.toLowerCase().includes(query));
        }
        return false;
      });
    }

    // Filter by selected tags - more efficient with Set
    if (selectedTags.length > 0) {
      const selectedTagsLower = new Set(selectedTags.map(t => t.toLowerCase()));
      filtered = filtered.filter(note => {
        if (!note.tags) return false;
        const noteTags = note.tags.map(t => t.toLowerCase());
        // Check if all selected tags are present in note tags
        return Array.from(selectedTagsLower).every(selectedTag => 
          noteTags.some(noteTag => noteTag.includes(selectedTag))
        );
      });
    }

    setFilteredNotes(filtered);
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
  };

  const handleDelete = async (id) => {
    if (!window.confirm('確定要刪除這條筆記嗎？')) return;

    try {
      const userId = user.id || user._id; // 兼容 id 或 _id
      const res = await fetch(`/api/knowledge/${id}?userId=${userId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setNotes(prev => prev.filter(n => n._id !== id));
      } else {
        const data = await res.json();
        alert(data.message || '刪除失敗');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('刪除出錯');
    }
  };

  const getModuleName = (id) => {
    const mod = getModuleById(id);
    return mod ? `${mod.code} ${mod.title}` : id;
  };

  // Get unique tags from user's notes
  const getUserTags = () => {
    const tagSet = new Set();
    notes.forEach(note => {
      if (note.tags) {
        note.tags.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  };

  if (loading) return <div className="p-12 text-center text-slate-500">載入中...</div>;

  const userTags = getUserTags();
  const hasFilters = searchQuery || selectedTags.length > 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center">
          <BookOpen className="mr-2 text-purple-600" /> 我的筆記庫
        </h2>
        <Link to="/knowledge/new" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-medium">
          + 新增筆記
        </Link>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索筆記標題、內容或標籤..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none transition"
          />
        </div>

        {/* Tag Filter */}
        {userTags.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700 flex items-center">
                <Tag size={14} className="mr-1" /> 按標籤篩選
              </label>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-slate-500 hover:text-slate-700 flex items-center"
                >
                  <X size={12} className="mr-1" /> 清除篩選
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {userTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                    selectedTags.includes(tag)
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filter Summary */}
        {hasFilters && (
          <div className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-600">
            找到 <span className="font-bold text-purple-600">{filteredNotes.length}</span> 條筆記
            {selectedTags.length > 0 && (
              <span> (標籤: {selectedTags.join(', ')})</span>
            )}
          </div>
        )}
      </div>

      {filteredNotes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-100">
          <FileText size={48} className="mx-auto text-slate-300 mb-4" />
          {hasFilters ? (
            <>
              <p className="text-slate-500 text-lg mb-2">沒有找到符合條件的筆記</p>
              <button
                onClick={clearFilters}
                className="text-purple-600 hover:underline font-medium"
              >
                清除篩選條件
              </button>
            </>
          ) : (
            <>
              <p className="text-slate-500 text-lg">你還沒有創建任何筆記</p>
              <Link to="/knowledge/new" className="text-purple-600 hover:underline mt-2 inline-block font-medium">
                立即開始編寫第一篇筆記
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredNotes.map(note => (
            <div key={note._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition flex flex-col md:flex-row justify-between items-start md:items-center group">
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center space-x-2 mb-2 flex-wrap">
                  <span className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded font-medium border border-purple-100">
                    {getModuleName(note.moduleId)}
                  </span>
                  {note.tags && note.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className={`text-xs px-2 py-1 rounded font-medium ${
                        selectedTags.includes(tag)
                          ? 'bg-purple-100 text-purple-700 border border-purple-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="text-slate-400 text-xs flex items-center">
                    <Calendar size={12} className="mr-1" />
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <Link to={`/knowledge/${note._id}`} className="block group-hover:text-purple-600 transition">
                  <h3 className="text-lg font-bold text-slate-800 mb-1 truncate">{note.title}</h3>
                </Link>
                <p className="text-slate-500 text-sm line-clamp-1">{note.content.replace(/[#*`]/g, '')}</p>
              </div>
              
              <div className="flex items-center space-x-3 mt-4 md:mt-0 w-full md:w-auto justify-end">
                <Link 
                  to={`/knowledge/${note._id}`}
                  className="px-4 py-2 text-sm text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition flex items-center"
                >
                  查看 <ArrowRight size={14} className="ml-1" />
                </Link>
                {(user?.role === 'admin' || user?.id === note.author) && (
                  <button 
                    onClick={() => handleDelete(note._id)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyNotes;