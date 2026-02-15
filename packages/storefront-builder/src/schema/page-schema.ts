export interface ElementStyleOverride {
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  textAlign?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
  lineHeight?: string;
}

export interface SectionConfig {
  id: string;
  type: string;
  props: Record<string, unknown>;
  visible: boolean;
  elementStyles?: Record<string, ElementStyleOverride>;
}

export interface PageSeo {
  title?: string;
  description?: string;
  ogImage?: string;
}

export interface PageConfig {
  id: string;
  slug: string;
  title: string;
  sections: SectionConfig[];
  seo: PageSeo;
}

export interface LandingPagesConfig {
  version: 2;
  pages: PageConfig[];
  homePageId?: string;
}
