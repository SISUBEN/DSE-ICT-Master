import React, { useState, useEffect } from 'react';
import { BarChart3, Trophy, Target, BookOpen, Clock, Calendar } from 'lucide-react';

const Stats = ({ user }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        if (user?.id) {
            fetchStats();
            fetchRecentActivity();
        }
    }, [user]);

    const fetchStats = async () => {
        try {
            const res = await fetch(`/api/stats/${user.id}`);
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecentActivity = async () => {
        try {
            const res = await fetch(`/api/actions/${user.id}`);
            if (res.ok) {
                const data = await res.json();
                setRecentActivity(data);
            }
        } catch (error) {
            console.error('Error fetching activity:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-500">無法加載統計數據</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">學習統計</h1>
                <p className="text-slate-500">追蹤您的 DSE ICT 學習進度與表現</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">已完成單元</p>
                        <h3 className="text-2xl font-bold text-slate-800">{stats.completedModules || 0}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
                    <div className="p-4 bg-purple-50 text-purple-600 rounded-xl">
                        <Target size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">總答題數</p>
                        <h3 className="text-2xl font-bold text-slate-800">{stats.totalQuestions || 0}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
                    <div className="p-4 bg-green-50 text-green-600 rounded-xl">
                        <Trophy size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">平均準確率</p>
                        <h3 className="text-2xl font-bold text-slate-800">{stats.accuracy || '0%'}</h3>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center">
                        <Clock size={20} className="mr-2 text-slate-400" /> 最近活動
                    </h2>
                </div>

                {recentActivity.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                        {recentActivity.map((action) => (
                            <div key={action._id} className="p-6 hover:bg-slate-50 transition flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className={`p-2 rounded-lg ${action.actionType === 'QUIZ_COMPLETE' ? 'bg-green-100 text-green-600' :
                                            action.actionType === 'UPLOAD_QUESTION' ? 'bg-blue-100 text-blue-600' :
                                                'bg-slate-100 text-slate-600'
                                        }`}>
                                        {action.actionType === 'QUIZ_COMPLETE' ? <Trophy size={18} /> :
                                            action.actionType === 'UPLOAD_QUESTION' ? <BookOpen size={18} /> :
                                                <Clock size={18} />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-800">
                                            {action.actionType === 'QUIZ_COMPLETE' ? '完成測驗' :
                                                action.actionType === 'UPLOAD_QUESTION' ? '上傳題目' :
                                                    action.actionType === 'CREATE_KNOWLEDGE' ? '創建筆記' :
                                                        action.actionType}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {action.moduleId ? `單元: ${action.moduleId}` : ''}
                                            {action.score !== undefined ? ` • 得分: ${action.score}/${action.totalQuestions}` : ''}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-sm text-slate-400 flex items-center">
                                    <Calendar size={14} className="mr-1" />
                                    {new Date(action.timestamp).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center text-slate-500">
                        尚無活動記錄
                    </div>
                )}
            </div>
        </div>
    );
};

export default Stats;
