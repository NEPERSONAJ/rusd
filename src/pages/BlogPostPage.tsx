import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, Tag as TagIcon } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useBlogPost } from '../hooks/useBlogPost';

export default function BlogPostPage() {
  const { slug = '' } = useParams();
  const { post, loading } = useBlogPost(slug);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="aspect-video bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Статья не найдена
          </h1>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt}
        image={post.image}
        type="article"
      />

      <article className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-500 mb-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <time dateTime={post.published_at}>
                  {new Date(post.published_at).toLocaleDateString('ru-RU')}
                </time>
              </div>
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                <span>{post.author}</span>
              </div>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                  >
                    <TagIcon className="w-4 h-4 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative aspect-[21/9] mb-8 rounded-2xl overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </motion.div>
        </div>
      </article>
    </>
  );
}
