'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  MessageSquare,
  Heart,
  Send,
  Flag,
  Shield,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Community, CommunityPost, PostComment } from '@/lib/types';

function CommunityDetailContent() {
  const params = useParams();
  const router = useRouter();
  const communityId = params?.id as string;

  const [community, setCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // New Post Form
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [posting, setPosting] = useState(false);

  // Comments state
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<string, PostComment[]>>({});
  const [commentInput, setCommentInput] = useState('');

  // Report Modal
  const [reportTargetId, setReportTargetId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [reportStatus, setReportStatus] = useState('');

  const loadData = () => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => setCurrentUserId(d.user?.id || null))
      .catch(() => {});

    fetch('/api/communities')
      .then((r) => r.json())
      .then((d) => {
        const com = (d.communities || []).find(
          (c: Community) => c.id === communityId || c.slug === communityId
        );
        setCommunity(com || null);
      })
      .catch(() => {});

    fetch(`/api/communities/posts?communityId=${communityId}`)
      .then((r) => r.json())
      .then((d) => {
        setPosts(d.posts || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [communityId]);

  const handleToggleJoin = async () => {
    if (!community) return;
    try {
      const res = await fetch('/api/communities/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ communityId: community.id }),
      });
      if (res.ok) {
        loadData();
      }
    } catch {}
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!community) return;
    setPosting(true);

    try {
      const res = await fetch('/api/communities/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          communityId: community.id,
          title: postTitle,
          content: postContent,
        }),
      });

      if (res.ok) {
        setPostTitle('');
        setPostContent('');
        loadData();
      }
    } catch {}
    setPosting(false);
  };

  const handleToggleLike = async (postId: string) => {
    try {
      const res = await fetch('/api/communities/posts/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });
      if (res.ok) {
        loadData();
      }
    } catch {}
  };

  const loadComments = async (postId: string) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
      return;
    }
    setExpandedPostId(postId);

    try {
      const res = await fetch(`/api/communities/posts/comment?postId=${postId}`);
      const data = await res.json();
      setCommentsMap((prev) => ({ ...prev, [postId]: data.comments || [] }));
    } catch {}
  };

  const handleAddComment = async (postId: string) => {
    if (!commentInput.trim()) return;

    try {
      const res = await fetch('/api/communities/posts/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, content: commentInput }),
      });

      if (res.ok) {
        setCommentInput('');
        // Reload comments
        const cRes = await fetch(`/api/communities/posts/comment?postId=${postId}`);
        const cData = await cRes.json();
        setCommentsMap((prev) => ({ ...prev, [postId]: cData.comments || [] }));
        loadData();
      }
    } catch {}
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTargetId || !reportReason.trim()) return;

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: 'POST',
          targetId: reportTargetId,
          reason: reportReason,
        }),
      });

      if (res.ok) {
        setReportStatus('Shikoyat moderatsiyaga yuborildi. Rahmat!');
        setTimeout(() => {
          setReportTargetId(null);
          setReportReason('');
          setReportStatus('');
        }, 1500);
      }
    } catch {}
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400">Yuklanmoqda...</div>;
  }

  if (!community) {
    return (
      <div className="p-12 text-center text-slate-400">
        Hamjamiyat topilmadi.{' '}
        <Link href="/hamjamiyatlar" className="text-indigo-400 underline">
          Ortga qaytish
        </Link>
      </div>
    );
  }

  const isMember = currentUserId ? community.members.includes(currentUserId) : false;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Back button */}
      <Link
        href="/hamjamiyatlar"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Barcha hamjamiyatlarga qaytish
      </Link>

      {/* Community Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {community.directionId}
              </span>
              {community.regionName && (
                <span className="text-xs text-slate-400">📍 {community.regionName}</span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{community.title}</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              {community.description}
            </p>
            <div className="text-xs text-slate-400 mt-4 flex items-center gap-4">
              <span>Koordinator: {community.coordinatorName}</span>
              <span>•</span>
              <span className="font-semibold text-white">{community.memberCount} nafar a’zo</span>
            </div>
          </div>

          <button
            onClick={handleToggleJoin}
            className={`px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-lg ${
              isMember
                ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/25'
            }`}
          >
            {isMember ? 'A’zolikdan chiqish' : 'Hamjamiyatga a’zo bo‘lish (+20 ball)'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Discussion Feed (Left) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Create Post Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Yangi munozara boshlash
            </h3>

            <form onSubmit={handleCreatePost} className="space-y-3">
              <input
                type="text"
                required
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="Munozara sarlavhasi yoki savol..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
              <textarea
                required
                rows={3}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Fikrlaringizni batafsil yozib qoldiring..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
              <div className="flex justify-between items-center pt-2">
                <span className="text-[11px] text-slate-500">
                  Foydali post yaratganingiz uchun +15 XP beriladi
                </span>
                <button
                  type="submit"
                  disabled={posting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md disabled:opacity-50"
                >
                  {posting ? 'Chop etilmoqda...' : 'Chop etish'}
                </button>
              </div>
            </form>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-violet-400" />
              Munozaralar ({posts.length})
            </h3>

            {posts.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-500 bg-slate-900/30 rounded-2xl border border-slate-800/80">
                Hozircha hech kim post qoldirmagan. Birinchi bo‘lib suhbatni boshlang!
              </div>
            ) : (
              posts.map((post) => {
                const hasLiked = currentUserId ? post.likes.includes(currentUserId) : false;
                const isExpanded = expandedPostId === post.id;
                const postComments = commentsMap[post.id] || [];

                return (
                  <div
                    key={post.id}
                    className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4"
                  >
                    {/* Author & Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                          {post.authorName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{post.authorName}</div>
                          <div className="text-[10px] text-slate-500">
                            {new Date(post.createdAt).toLocaleDateString('uz-UZ')} • {post.authorRole}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setReportTargetId(post.id)}
                        className="p-1 text-slate-600 hover:text-rose-400 transition-colors"
                        title="Shikoyat qilish"
                      >
                        <Flag className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Content */}
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1.5">{post.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                        {post.content}
                      </p>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center gap-4 pt-3 border-t border-slate-800/60 text-xs">
                      <button
                        onClick={() => handleToggleLike(post.id)}
                        className={`flex items-center gap-1.5 transition-colors ${
                          hasLiked ? 'text-rose-400 font-semibold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-400' : ''}`} />
                        <span>{post.likes.length}</span>
                      </button>

                      <button
                        onClick={() => loadComments(post.id)}
                        className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.commentsCount || 0} ta izoh</span>
                      </button>
                    </div>

                    {/* Comments Drawer */}
                    {isExpanded && (
                      <div className="pt-4 border-t border-slate-800/60 space-y-3">
                        <div className="space-y-2">
                          {postComments.length === 0 ? (
                            <div className="text-xs text-slate-500 py-2">
                              Hozircha izohlar yo‘q. Birinchi bo‘lib yozing!
                            </div>
                          ) : (
                            postComments.map((comm) => (
                              <div
                                key={comm.id}
                                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs"
                              >
                                <div className="font-bold text-slate-200 mb-0.5">
                                  {comm.authorName}
                                </div>
                                <div className="text-slate-300">{comm.content}</div>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Comment Input */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddComment(post.id);
                              }
                            }}
                            placeholder="O‘z fikringizni yozing..."
                            className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                          >
                            Yuborish
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Sidebar: Rules & Info (Right) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              Hamjamiyat Qoidalari
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {(community.rules || [
                'Barcha a’zolarga o‘zaro hurmat va odob',
                'Mavzudan tashqari reklama va spamlarni tarqatmaslik',
                'Konstruktiv fikr-mulohazalar bildirish',
              ]).map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Content Report Modal */}
      {reportTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2 text-rose-400">
              <Flag className="w-4 h-4" /> Shikoyat yuborish
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Ushbu post qoidabuzarlik yoki nomaqbul mazmunga egami? Sababini yozing:
            </p>

            {reportStatus && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                {reportStatus}
              </div>
            )}

            <form onSubmit={handleSubmitReport} className="space-y-3">
              <textarea
                required
                rows={3}
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="masalan: Qoidaga zid so‘zlar, reklama yoki haqorat..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-rose-500"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReportTargetId(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
                >
                  Yuborish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CommunityDetailPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Hamjamiyat yuklanmoqda...</div>}>
      <CommunityDetailContent />
    </Suspense>
  );
}

