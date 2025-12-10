import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Filter, Calendar, User, ArrowRight } from 'lucide-react';
import { getModuleById } from '../data/syllabus';

const KnowledgeLibrary = ({ user }) => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterModule, setFilterModule] = useState('all');

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const res = await fetch('/api/knowledge');
            if (res.ok) {
                const data = await res.json();
                setNotes(data);
            }
        } catch (error) {
            console.error('Failed to fetch notes', error);
        } finally {
            setLoading(false);
        }
    };

    const getModuleName = (id) => {
        const mod = getModuleById(id);
        return mod ? `${mod.code} ${mod.title}` : id;
    };

    // Filter notes
    const filteredNotes = notes.filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesModule = filterModule === 'all' || note.moduleId === filterModule;
        return matchesSearch && matchesModule;
    });

    // Get unique modules from notes for filter
    const availableModules = [...new Set(notes.map(n => n.moduleId))];

    if (loading) return <div className="p-12 text-center text-slate-500">載入中...</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                        <BookOpen className="mr-2 text-amber-600" /> 知識庫
                    </h2>
                    <p className="text-slate-500 mt-1">瀏覽所有同學分享的學習筆記</p>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <Link to="/knowledge/new" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-medium whitespace-nowrap">
                        + 分享筆記
                    </Link>
                    <Link to="/knowledge/manage" className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-50 transition font-medium whitespace-nowrap">
                        我的筆記
                    </Link>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="搜尋筆記..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="relative min-w-[200px]">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <select
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none bg-white"
                        value={filterModule}
                        onChange={(e) => setFilterModule(e.target.value)}
                    >
                        <option value="all">所有單元</option>
                        {availableModules.map(mid => (
                            <option key={mid} value={mid}>{getModuleName(mid)}</option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredNotes.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500 text-lg">沒有找到相關筆記</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredNotes.map(note => (
                        <div key={note._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition flex flex-col md:flex-row justify-between items-start md:items-center group">
                            <div className="flex-1 min-w-0 pr-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <span className="bg-amber-50 text-amber-700 text-xs px-2 py-1 rounded font-medium border border-amber-100">
                                        {getModuleName(note.moduleId)}
                                    </span>
                                    <span className="text-slate-400 text-xs flex items-center">
                                        <User size={12} className="mr-1" />
                                        {note.author?.username || 'Unknown'}
                                    </span>
                                    <span className="text-slate-400 text-xs flex items-center">
                                        <Calendar size={12} className="mr-1" />
                                        {new Date(note.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <Link to={`/knowledge/${note._id}`} className="block group-hover:text-amber-600 transition">
                                    <h3 className="text-lg font-bold text-slate-800 mb-1 truncate">{note.title}</h3>
                                </Link>
                                <p className="text-slate-500 text-sm line-clamp-1">{note.content.replace(/[#*`]/g, '')}</p>
                            </div>

                            <div className="mt-4 md:mt-0">
                                <Link
                                    to={`/knowledge/${note._id}`}
                                    className="px-4 py-2 text-sm text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition flex items-center"
                                >
                                    閱讀 <ArrowRight size={14} className="ml-1" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default KnowledgeLibrary;
