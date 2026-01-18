import { useParams } from 'react-router-dom';
import { getTemplateById } from '@/lib/template-registry';
import { getSampleDataForTemplate } from '@/lib/sample-data';
import { renderTemplate } from '@/components/templates';

const DemoPage = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const validTemplateId = getTemplateById(templateId || 'classic');
  const sampleData = getSampleDataForTemplate(validTemplateId);

  return renderTemplate({ ...sampleData, id: undefined }, false);
};

export default DemoPage;
