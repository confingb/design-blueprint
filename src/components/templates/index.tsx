import { TemplateId, InviteData } from '@/types/invite';
import { ClassicTemplate } from './ClassicTemplate';
import { ModernTemplate } from './ModernTemplate';
import { MinimalTemplate } from './MinimalTemplate';
import { FloralTemplate } from './FloralTemplate';
import { VintageTemplate } from './VintageTemplate';
import { EditorialLuxuryTemplate } from './EditorialLuxuryTemplate';
import { ComponentType } from 'react';

interface TemplateProps {
  invite: InviteData;
  showRSVP?: boolean;
}

export const templateComponents: Record<TemplateId, ComponentType<TemplateProps>> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  floral: FloralTemplate,
  vintage: VintageTemplate,
  'editorial-luxury': EditorialLuxuryTemplate,
};

export const renderTemplate = (invite: InviteData, showRSVP = true) => {
  const TemplateComponent = templateComponents[invite.templateId] || ClassicTemplate;
  return <TemplateComponent invite={invite} showRSVP={showRSVP} />;
};

export {
  ClassicTemplate,
  ModernTemplate,
  MinimalTemplate,
  FloralTemplate,
  VintageTemplate,
  EditorialLuxuryTemplate,
};
