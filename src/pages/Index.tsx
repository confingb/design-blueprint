import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { templateRegistry, allTags, filterTemplatesByTag, TemplateTag } from '@/lib/template-registry';
import { ArrowRight, Sparkles, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TemplateCardSkeleton } from '@/components/common/Skeleton';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { MetaTags } from '@/components/seo/MetaTags';

const TemplateCard = ({ template, index }: { template: typeof templateRegistry[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to={`/demo/${template.id}`}
        className="group block bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
      >
        {/* Preview area */}
        <div 
          className="aspect-[4/3] relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${template.primaryColor}15, ${template.primaryColor}30)`,
          }}
        >
          {/* Template preview content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
            <motion.div
              animate={isHovered ? { scale: 1.05, y: -5 } : { scale: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <h4 
                className="text-3xl md:text-4xl font-serif mb-2"
                style={{ color: template.primaryColor }}
              >
                {template.name}
              </h4>
              <p className="text-sm opacity-60" style={{ color: template.primaryColor }}>
                Şablon Önizleme
              </p>
            </motion.div>
          </div>

          {/* Hover overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.span
                  className="bg-white px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg"
                  style={{ color: template.primaryColor }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <Eye className="w-4 h-4" />
                  Önizle
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tags badges on image */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {template.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-white/90 backdrop-blur-sm text-xs"
              >
                {allTags.find((t) => t.id === tag)?.label || tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Card content */}
        <div className="p-5">
          <h4 className="text-lg font-serif text-gray-900 mb-1.5">
            {template.name}
          </h4>
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
            {template.description}
          </p>
          
          {/* Features */}
          <div className="flex flex-wrap gap-1.5">
            {template.features.slice(0, 3).map((feature) => (
              <span
                key={feature}
                className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const Index = () => {
  const [selectedTag, setSelectedTag] = useState<TemplateTag | 'all'>('all');
  const [isLoading] = useState(false);

  const filteredTemplates = useMemo(() => {
    return filterTemplatesByTag(selectedTag);
  }, [selectedTag]);

  return (
    <ErrorBoundary>
      <MetaTags
        title="Düğün Davetiyesi Stüdyosu | Premium Dijital Davetiyeler"
        description="Zarif tasarımlar, büyüleyici animasyonlar ile premium dijital düğün davetiyeleri oluşturun. Klasik, modern, çiçekli ve daha fazla şablon."
      />
      
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-50/30">
        {/* Header */}
        <header className="py-5 px-6 md:px-12 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-40 border-b border-amber-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h1 className="text-xl font-serif text-amber-900">Wedding Studio</h1>
          </div>
          <Link
            to="/auth"
            className="text-sm text-amber-700 hover:text-amber-900 transition-colors font-medium"
          >
            Giriş Yap
          </Link>
        </header>

        {/* Hero */}
        <section className="py-16 md:py-24 px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-amber-900 mb-6">
              Düğün Davetiyesi Stüdyosu
            </h2>
            <p className="text-lg md:text-xl text-amber-700/80 max-w-2xl mx-auto">
              Premium dijital düğün davetiyeleri. Zarif tasarımlar, büyüleyici animasyonlar.
            </p>
          </motion.div>
        </section>

        {/* Filter Tags */}
        <section className="px-6 md:px-12 mb-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setSelectedTag('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTag === 'all'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-white text-amber-700 hover:bg-amber-50 border border-amber-200'
                }`}
              >
                Tümü
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => setSelectedTag(tag.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTag === tag.id
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-white text-amber-700 hover:bg-amber-50 border border-amber-200'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Templates Grid */}
        <section className="py-8 px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              {isLoading ? (
                // Skeleton loaders
                Array.from({ length: 6 }).map((_, i) => (
                  <TemplateCardSkeleton key={`skeleton-${i}`} />
                ))
              ) : (
                filteredTemplates.map((template, index) => (
                  <TemplateCard key={template.id} template={template} index={index} />
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Empty state */}
          {!isLoading && filteredTemplates.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-amber-600">Bu kategoride şablon bulunamadı.</p>
            </motion.div>
          )}
        </section>

        {/* Stats Section */}
        <section className="py-16 px-6 md:px-12 bg-amber-900 text-white">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-serif mb-2">6</div>
              <div className="text-amber-200 text-sm">Premium Şablon</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-serif mb-2">∞</div>
              <div className="text-amber-200 text-sm">Renk Seçeneği</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-serif mb-2">3D</div>
              <div className="text-amber-200 text-sm">Zarf Animasyonu</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-serif mb-2">RSVP</div>
              <div className="text-amber-200 text-sm">Dahili Sistem</div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 text-center text-amber-600 text-sm">
          <p>© 2025 Wedding Studio. Tüm hakları saklıdır.</p>
        </footer>
      </div>
    </ErrorBoundary>
  );
};

export default Index;
