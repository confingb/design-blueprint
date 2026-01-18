import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { templateRegistry } from '@/lib/template-registry';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="py-6 px-6 md:px-12 flex justify-between items-center">
        <h1 className="text-xl font-serif text-amber-900">Wedding Studio</h1>
        <Link
          to="/auth"
          className="text-sm text-amber-700 hover:text-amber-900 transition-colors"
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

      {/* Templates Grid */}
      <section className="py-12 px-6 md:px-12">
        <h3 className="text-2xl font-serif text-amber-900 mb-8 text-center">
          Şablonlarımız
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {templateRegistry.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={`/demo/${template.id}`}
                className="group block bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                {/* Preview placeholder */}
                <div className="aspect-[4/3] bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center relative overflow-hidden">
                  <div className="text-center p-8">
                    <h4 className="text-3xl font-serif text-amber-800 mb-2">
                      {template.name}
                    </h4>
                    <p className="text-sm text-amber-600">Şablon Önizleme</p>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white px-4 py-2 rounded-full text-sm font-medium text-amber-900 flex items-center gap-2">
                      Önizle <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-serif text-amber-900 mb-2">
                    {template.name}
                  </h4>
                  <p className="text-sm text-amber-600">
                    {template.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 text-center text-amber-600 text-sm">
        <p>© 2025 Wedding Studio. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
};

export default Index;
