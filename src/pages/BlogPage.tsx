import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useBlogPosts } from '../hooks/useBlogPosts';

export default function BlogPage() {
  const { posts, loading } = useBlogPosts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl p-6">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-24 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Блог РусДекор"
        description="Статьи о дизайне интерьера, декоративных материалах и тенденциях в оформлении помещений"
      />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Блог РусДекор</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Вдохновляющие идеи и полезные советы по оформлению интерьера
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link to={`/blog/${post.slug}`}>
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                </Link>

                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <time dateTime={post.published_at}>
                        {new Date(post.published_at).toLocaleDateString('ru-RU')}
                      </time>
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      <span>{post.author}</span>
                    </div>
                  </div>

                  <Link to={`/blog/${post.slug}`}>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-purple-600 transition-colors">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Читать далее
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}