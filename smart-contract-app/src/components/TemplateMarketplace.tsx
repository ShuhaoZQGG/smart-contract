import React, { useState, useEffect } from 'react';
import { Star, Download, Eye, Search, Filter, TrendingUp, Clock, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface MarketplaceTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  stats: {
    downloads: number;
    views: number;
    rating: number;
    reviews: number;
    uses_last_week: number;
  };
  price: number;
  is_free: boolean;
  preview_url?: string;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

const TemplateMarketplace: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [templates, setTemplates] = useState<MarketplaceTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<MarketplaceTemplate[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'rating'>('popular');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<MarketplaceTemplate | null>(null);

  useEffect(() => {
    loadMarketplaceData();
  }, []);

  useEffect(() => {
    filterAndSortTemplates();
  }, [templates, selectedCategory, searchQuery, sortBy, priceFilter]);

  const loadMarketplaceData = async () => {
    try {
      setIsLoading(true);

      // Load public templates
      const { data: publicTemplates, error } = await supabase
        .from('templates')
        .select(`
          *,
          user:user_id (
            id,
            email
          ),
          template_stats (
            downloads,
            views,
            rating,
            reviews,
            uses_last_week
          )
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to marketplace format
      const marketplaceTemplates: MarketplaceTemplate[] = (publicTemplates || []).map(template => ({
        id: template.id,
        name: template.name,
        description: template.description || '',
        category: template.category || 'General',
        tags: template.tags || [],
        author: {
          id: template.user?.id || '',
          name: template.user?.email?.split('@')[0] || 'Anonymous',
        },
        stats: template.template_stats?.[0] || {
          downloads: 0,
          views: 0,
          rating: 0,
          reviews: 0,
          uses_last_week: 0,
        },
        price: template.price || 0,
        is_free: !template.price || template.price === 0,
        preview_url: template.preview_url,
        created_at: template.created_at,
        updated_at: template.updated_at,
      }));

      setTemplates(marketplaceTemplates);

      // Extract categories
      const categoryMap = new Map<string, number>();
      marketplaceTemplates.forEach(template => {
        const count = categoryMap.get(template.category) || 0;
        categoryMap.set(template.category, count + 1);
      });

      const categoriesList: Category[] = Array.from(categoryMap.entries()).map(([name, count]) => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        icon: getCategoryIcon(name),
        count,
      }));

      setCategories(categoriesList);
    } catch (error) {
      console.error('Error loading marketplace data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortTemplates = () => {
    let filtered = [...templates];

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Price filter
    if (priceFilter === 'free') {
      filtered = filtered.filter(t => t.is_free);
    } else if (priceFilter === 'paid') {
      filtered = filtered.filter(t => !t.is_free);
    }

    // Sort
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.stats.downloads - a.stats.downloads);
        break;
      case 'recent':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'rating':
        filtered.sort((a, b) => b.stats.rating - a.stats.rating);
        break;
    }

    setFilteredTemplates(filtered);
  };

  const getCategoryIcon = (category: string): string => {
    const iconMap: Record<string, string> = {
      'Business': '💼',
      'Legal': '⚖️',
      'Education': '🎓',
      'Marketing': '📢',
      'Finance': '💰',
      'Healthcare': '🏥',
      'Technology': '💻',
      'Real Estate': '🏠',
      'General': '📄',
    };
    return iconMap[category] || '📄';
  };

  const handleUseTemplate = async (template: MarketplaceTemplate) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      // Clone template for user
      const { data: clonedTemplate, error } = await supabase
        .from('templates')
        .insert({
          name: `${template.name} (Copy)`,
          description: template.description,
          user_id: user.id,
          is_public: false,
          category: template.category,
          tags: template.tags,
          original_template_id: template.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Update download stats
      await supabase.rpc('increment_template_downloads', { template_id: template.id });

      // Navigate to editor
      navigate(`/templates/${clonedTemplate.id}/edit`);
    } catch (error) {
      console.error('Error using template:', error);
    }
  };

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating.toFixed(1)})</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Template Marketplace</h1>
        <p className="text-gray-600 text-lg">
          Discover professional templates created by the community. Use them as-is or customize for your needs.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="popular">Most Popular</option>
            <option value="recent">Recently Added</option>
            <option value="rating">Highest Rated</option>
          </select>

          {/* Price Filter */}
          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Templates</option>
            <option value="free">Free Only</option>
            <option value="paid">Premium Only</option>
          </select>
        </div>

        {/* Categories */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
              <span className="bg-white bg-opacity-20 px-2 py-0.5 rounded-full text-xs">
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-gray-600">
        Found {filteredTemplates.length} templates
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Template Preview Image */}
            {template.preview_url ? (
              <img
                src={template.preview_url}
                alt={template.name}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                <span className="text-6xl">{getCategoryIcon(template.category)}</span>
              </div>
            )}

            {/* Template Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 flex-1">{template.name}</h3>
                {template.is_free ? (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                    Free
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                    ${template.price}
                  </span>
                )}
              </div>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {template.description}
              </p>

              {/* Author */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-white">
                  {template.author.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-gray-600">by {template.author.name}</span>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Download size={14} />
                  <span>{template.stats.downloads}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye size={14} />
                  <span>{template.stats.views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp size={14} />
                  <span>{template.stats.uses_last_week} this week</span>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-3">
                {renderRating(template.stats.rating)}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {template.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
                {template.tags.length > 3 && (
                  <span className="px-2 py-1 text-gray-500 text-xs">
                    +{template.tags.length - 3} more
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedTemplate(template)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
                >
                  Preview
                </button>
                <button
                  onClick={() => handleUseTemplate(template)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  Use Template
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No templates found matching your criteria.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setPriceFilter('all');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedTemplate.name}</h2>
                  <p className="text-gray-600 mt-1">{selectedTemplate.description}</p>
                </div>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Preview content would go here */}
              <div className="bg-gray-50 rounded-lg p-6 mb-4">
                <p className="text-gray-600">Template preview would be displayed here...</p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleUseTemplate(selectedTemplate);
                    setSelectedTemplate(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Use This Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateMarketplace;