export interface SectionConfig {
  id: string;
  type: string;
  props: Record<string, unknown>;
  visible: boolean;
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
