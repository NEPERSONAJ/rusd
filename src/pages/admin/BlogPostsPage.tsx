import React, { useState } from 'react';
import { Layout } from '../../components/admin/Layout';
import { Plus, Pencil, Trash2, Search, Eye, EyeOff } from 'lucide-react';
import { BlogPostForm } from '../../components/admin/BlogPostForm';
import { useBlogPosts } from '../../hooks/useBlogPosts';
import { BlogPost } from '../../lib/types';
import { blogService } from '../../lib/services/blogService';
import toast from 'react-hot-toast';

export function BlogPostsPage() {
  const { posts, loading, refreshPosts } = useBlogPosts();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const handleAdd = async (data: Omit<BlogPost, 'id' | 'slug' | 'created_at' | 'published_at'>) => {
    try {
      await blogService.create(data);
      setIsFormOpen(false);
      refreshPosts();
      toast.success('Статья успешно добавлена');
    } catch (error) {
      toast.error('Ошибка при добавлении статьи');
    }
  };

  const handleEdit = async (data: Partial<BlogPost>) => {
    if (!editingPost) return;
    try {
      await blogService.update(editingPost.id, data);
      setEditingPost(null);
      refreshPosts();
      toast.success('Статья успешно обновлена');
    } catch (error) {
      toast.error('Ошибка при обновлении статьи');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту статью?')) return;
    try {
      await blogService.delete(id);
      refreshPosts();
      toast.success('Статья успешно удалена');
    } catch (error) {
      toast.error('Ошибка при удалении статьи');
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Управление блогом</h1>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Добавить статью</span>
          </button>
        </div>

        {(isFormOpen || editingPost) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingPost ? 'Редактировать статью' : 'Добавить статью'}
              </h2>
              <BlogPostForm
                initialData={editingPost || undefined}
                onSubmit={editingPost ? handleEdit : handleAdd}
                onCancel={() => {
                  setIsFormOpen(false);
                  setEditingPost(null);
                }}
              />
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Поиск статей..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Название
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Автор
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата публикации
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      Загрузка...
                    </td>
                  </tr>
                ) : filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      Статьи не найдены
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="h-10 w-10 rounded-lg object-cover mr-3"
                          />
                          <div className="text-sm font-medium text-gray-900">
                            {post.title}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {post.author}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {post.is_published ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Eye className="w-4 h-4 mr-1" />
                            Опубликовано
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <EyeOff className="w-4 h-4 mr-1" />
                            Черновик
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {post.published_at
                          ? new Date(post.published_at).toLocaleDateString('ru-RU')
                          : '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                        <button
                          onClick={() => setEditingPost(post)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}