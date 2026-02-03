export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface TokenConstraint<T> {
  type: 'color' | 'number' | 'string' | 'select';
  default: T;
  label: string;
  description?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: T[];
  pattern?: RegExp;
}

export interface ColorTokens {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  border: string;
  error: string;
  warning: string;
  success: string;
  info: string;
}

export interface RadiusTokens {
  none: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export interface SpacingTokens {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

export interface FontFamilyTokens {
  display: string;
  body: string;
  mono: string;
}

export interface FontSizeTokens {
  xs: number;
  sm: number;
  base: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
  '4xl': number;
}

export interface FontWeightTokens {
  normal: number;
  medium: number;
  semibold: number;
  bold: number;
}

export interface LineHeightTokens {
  tight: number;
  normal: number;
  relaxed: number;
}

export interface TypographyTokens {
  fontFamily: FontFamilyTokens;
  fontSize: FontSizeTokens;
  fontWeight: FontWeightTokens;
  lineHeight: LineHeightTokens;
}

export interface ShadowTokens {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface TransitionTokens {
  fast: number;
  normal: number;
  slow: number;
}

export interface ThemeTokens {
  colors: ColorTokens;
  radius: RadiusTokens;
  spacing: SpacingTokens;
  typography: TypographyTokens;
  shadows: ShadowTokens;
  transitions: TransitionTokens;
}

export interface ColorTokenConstraints {
  primary: TokenConstraint<string>;
  secondary: TokenConstraint<string>;
  accent: TokenConstraint<string>;
  background: TokenConstraint<string>;
  surface: TokenConstraint<string>;
  text: {
    primary: TokenConstraint<string>;
    secondary: TokenConstraint<string>;
    muted: TokenConstraint<string>;
  };
  border: TokenConstraint<string>;
  error: TokenConstraint<string>;
  warning: TokenConstraint<string>;
  success: TokenConstraint<string>;
  info: TokenConstraint<string>;
}

export interface RadiusTokenConstraints {
  none: TokenConstraint<number>;
  sm: TokenConstraint<number>;
  md: TokenConstraint<number>;
  lg: TokenConstraint<number>;
  xl: TokenConstraint<number>;
  full: TokenConstraint<number>;
}

export interface SpacingTokenConstraints {
  xs: TokenConstraint<number>;
  sm: TokenConstraint<number>;
  md: TokenConstraint<number>;
  lg: TokenConstraint<number>;
  xl: TokenConstraint<number>;
  '2xl': TokenConstraint<number>;
}

export interface FontFamilyTokenConstraints {
  display: TokenConstraint<string>;
  body: TokenConstraint<string>;
  mono: TokenConstraint<string>;
}

export interface FontSizeTokenConstraints {
  xs: TokenConstraint<number>;
  sm: TokenConstraint<number>;
  base: TokenConstraint<number>;
  lg: TokenConstraint<number>;
  xl: TokenConstraint<number>;
  '2xl': TokenConstraint<number>;
  '3xl': TokenConstraint<number>;
  '4xl': TokenConstraint<number>;
}

export interface FontWeightTokenConstraints {
  normal: TokenConstraint<number>;
  medium: TokenConstraint<number>;
  semibold: TokenConstraint<number>;
  bold: TokenConstraint<number>;
}

export interface LineHeightTokenConstraints {
  tight: TokenConstraint<number>;
  normal: TokenConstraint<number>;
  relaxed: TokenConstraint<number>;
}

export interface TypographyTokenConstraints {
  fontFamily: FontFamilyTokenConstraints;
  fontSize: FontSizeTokenConstraints;
  fontWeight: FontWeightTokenConstraints;
  lineHeight: LineHeightTokenConstraints;
}

export interface ShadowTokenConstraints {
  none: TokenConstraint<string>;
  sm: TokenConstraint<string>;
  md: TokenConstraint<string>;
  lg: TokenConstraint<string>;
  xl: TokenConstraint<string>;
}

export interface TransitionTokenConstraints {
  fast: TokenConstraint<number>;
  normal: TokenConstraint<number>;
  slow: TokenConstraint<number>;
}

export interface TokenSchema {
  colors: ColorTokenConstraints;
  radius: RadiusTokenConstraints;
  spacing: SpacingTokenConstraints;
  typography: TypographyTokenConstraints;
  shadows: ShadowTokenConstraints;
  transitions: TransitionTokenConstraints;
}
