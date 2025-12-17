import React, { useState, useEffect } from 'react';
import { BarChart3, Trophy, Target, BookOpen, Clock, Calendar, LogOut, XCircle } from 'lucide-react';
import { getModuleById } from '../data/syllabus';

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

    const getModuleLabel = (moduleId) => {
        const module = getModuleById(moduleId);
        if (!module) return moduleId || '-';
        return `${module.code} ${module.title}`;
    };

    const formatScore = (action) => {
        if (action?.score === undefined) return '';
        const denom = action.attemptedQuestions ?? action.totalQuestions;
        if (denom === undefined) return ` · 得分: ${action.score}`;

        const suffix = action.attemptedQuestions !== undefined
            && action.totalQuestions !== undefined
            && action.attemptedQuestions < action.totalQuestions
            ? `（共 ${action.totalQuestions} 題）`
            : '';

        return ` · 得分: ${action.score}/${denom}${suffix ? ` ${suffix}` : ''}`;
    };

    const weakest = stats.weakestModule;
    const quizAttempts = stats.quizAttempts || {};
    const completedQuizAttempts = quizAttempts.QUIZ_COMPLETE?.attempts || 0;
    const endedQuizAttempts = quizAttempts.QUIZ_END?.attempts || 0;

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">學習統計</h1>
                <p className="text-slate-500">追蹤您的 DSE ICT 學習進度與表現</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
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

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
                    <div className="p-4 bg-amber-50 text-amber-700 rounded-xl">
                        <LogOut size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">提前退出</p>
                        <h3 className="text-2xl font-bold text-slate-800">{endedQuizAttempts}</h3>
                        <p className="text-xs text-slate-400 mt-1">完成：{completedQuizAttempts}</p>
                    </div>
                </div>
            </div>

            {/* Weakness Analysis */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-10">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center">
                        <BarChart3 size={20} className="mr-2 text-slate-400" /> 弱項分析
                    </h2>
                </div>

                {weakest ? (
                    <div className="p-6">
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
                            <p className="text-sm font-bold text-amber-800 mb-1">目前最弱單元</p>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                <div className="text-slate-900 font-bold text-lg">
                                    {getModuleLabel(weakest.moduleId)}
                                </div>
                                <div className="text-amber-800 font-bold">
                                    準確率：{weakest.accuracy}%（{weakest.totalScore}/{weakest.attemptedQuestions || weakest.totalQuestions}）
                                </div>
                            </div>
                            <p className="text-xs text-amber-700 mt-2">
                                建議：先重溫該單元重點，再多做同單元練習。
                            </p>
                        </div>

                        {Array.isArray(stats.byModule) && stats.byModule.length > 0 ? (
                            <div className="space-y-3">
                                {stats.byModule.map((m) => (
                                    <div key={m.moduleId} className="flex items-center gap-4">
                                        <div className="w-44 md:w-56 text-sm font-medium text-slate-700 truncate">
                                            {getModuleLabel(m.moduleId)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                                                <div
                                                    className={`h-full ${m.accuracy < 50 ? 'bg-red-500' : m.accuracy < 70 ? 'bg-amber-500' : 'bg-green-500'}`}
                                                    style={{ width: `${Math.min(100, Math.max(0, m.accuracy || 0))}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="w-28 text-right text-sm text-slate-600 tabular-nums">
                                            {m.accuracy}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-slate-500 text-sm">尚未有足夠測驗記錄以分析弱項。</div>
                        )}
                    </div>
                ) : (
                    <div className="p-12 text-center text-slate-500">
                        尚未有測驗記錄，完成一次測驗後即可查看弱項分析。
                    </div>
                )}
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
                                            action.actionType === 'QUIZ_END' ? 'bg-amber-100 text-amber-700' :
                                                action.actionType === 'UPLOAD_QUESTION' ? 'bg-blue-100 text-blue-600' :
                                                    'bg-slate-100 text-slate-600'
                                        }`}>
                                        {action.actionType === 'QUIZ_COMPLETE' ? <Trophy size={18} /> :
                                            action.actionType === 'QUIZ_END' ? <XCircle size={18} /> :
                                                action.actionType === 'UPLOAD_QUESTION' ? <BookOpen size={18} /> :
                                                    <Clock size={18} />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-800">
                                            {action.actionType === 'QUIZ_COMPLETE' ? '完成測驗' :
                                                action.actionType === 'QUIZ_END' ? '提前退出測驗' :
                                                    action.actionType === 'UPLOAD_QUESTION' ? '上傳題目' :
                                                        action.actionType === 'CREATE_KNOWLEDGE' ? '創建筆記' :
                                                            action.actionType}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {action.moduleId ? `單元: ${getModuleLabel(action.moduleId)}` : ''}
                                            {formatScore(action)}
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
