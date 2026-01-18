import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTemplateById, getTemplateInfo } from '@/lib/template-registry';
import { getSampleDataForTemplate } from '@/lib/sample-data';
import { renderTemplate } from '@/components/templates';
import { EnvelopeIntro } from '@/components/envelope/EnvelopeIntro';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Eye, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MetaTags } from '@/components/seo/MetaTags';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

type ViewMode = 'controls' | 'envelope' | 'template';

const DemoPage = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const validTemplateId = getTemplateById(templateId || 'classic');
  const templateInfo = getTemplateInfo(validTemplateId);
  const sampleData = getSampleDataForTemplate(validTemplateId);
  
  const [viewMode, setViewMode] = useState<ViewMode>('controls');
  const [customColor, setCustomColor] = useState(sampleData.themeTokens.primaryColor);

  const handleEnvelopeComplete = () => {
    setViewMode('template');
  };

  const handlePlayDemo = () => {
    setViewMode('envelope');
  };

  const handleViewTemplate = () => {
    setViewMode('template');
  };

  const handleReset = () => {
    setViewMode('controls');
  };

  // Apply custom color to sample data
  const demoData = {
    ...sampleData,
    id: undefined,
    themeTokens: {
      ...sampleData.themeTokens,
      primaryColor: customColor,
    },
  };

  if (viewMode === 'envelope') {
    return (
      <ErrorBoundary>
        <MetaTags
          title={`${templateInfo?.name || 'Şablon'} Demo | Wedding Studio`}
          description={templateInfo?.description || 'Düğün davetiyesi şablonu önizleme'}
        />
        <EnvelopeIntro
          brideInitial={demoData.brideInitial}
          groomInitial={demoData.groomInitial}
          primaryColor={customColor}
          onComplete={handleEnvelopeComplete}
          canSkip
        />
      </ErrorBoundary>
    );
  }

  if (viewMode === 'template') {
    return (
      <ErrorBoundary>
        <MetaTags
          title={`${templateInfo?.name || 'Şablon'} Demo | Wedding Studio`}
          description={templateInfo?.description || 'Düğün davetiyesi şablonu önizleme'}
        />
        {/* Floating back button */}
        <motion.button
          className="fixed top-4 left-4 z-50 p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-colors"
          onClick={handleReset}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </motion.button>
        
        {renderTemplate(demoData, false)}
      </ErrorBoundary>
    );
  }

  // Controls view
  return (
    <ErrorBoundary>
      <MetaTags
        title={`${templateInfo?.name || 'Şablon'} Demo | Wedding Studio`}
        description={templateInfo?.description || 'Düğün davetiyesi şablonu önizleme'}
      />
      
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        {/* Header */}
        <header className="py-4 px-6 flex items-center gap-4 border-b border-amber-100 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Şablonlar
            </Button>
          </Link>
          <div className="flex-1" />
          <Link to="/auth">
            <Button variant="outline" size="sm">
              Bu şablonu kullan
            </Button>
          </Link>
        </header>

        <div className="max-w-4xl mx-auto py-12 px-6">
          {/* Template info */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif text-amber-900 mb-4">
              {templateInfo?.name}
            </h1>
            <p className="text-lg text-amber-700/80 max-w-xl mx-auto">
              {templateInfo?.description}
            </p>
          </motion.div>

          {/* Preview card */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Preview area */}
            <div 
              className="aspect-video relative flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${customColor}10, ${customColor}25)`,
              }}
            >
              <div className="text-center">
                <div 
                  className="text-5xl font-serif mb-2"
                  style={{ color: customColor }}
                >
                  {demoData.brideName} & {demoData.groomName}
                </div>
                <p className="text-sm opacity-60" style={{ color: customColor }}>
                  Örnek Önizleme
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="p-6 border-t border-gray-100">
              <div className="flex flex-col md:flex-row items-center gap-4">
                {/* Color picker */}
                <div className="flex items-center gap-3">
                  <Palette className="w-5 h-5 text-gray-400" />
                  <label className="text-sm text-gray-600">Ana Renk:</label>
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-200"
                  />
                  <span className="text-xs text-gray-400 uppercase">{customColor}</span>
                </div>

                <div className="flex-1" />

                {/* Action buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleViewTemplate}
                    className="gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Şablonu Gör
                  </Button>
                  <Button
                    onClick={handlePlayDemo}
                    className="gap-2 bg-amber-600 hover:bg-amber-700"
                  >
                    <Play className="w-4 h-4" />
                    Zarf Animasyonu
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Features */}
          {templateInfo && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {templateInfo.features.map((feature) => (
                <div
                  key={feature}
                  className="bg-white rounded-lg p-4 text-center border border-amber-100"
                >
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DemoPage;
