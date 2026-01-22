import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// ============ TYPES ============
export interface HeroContent {
  badge: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  ctaButton: string;
  secondaryButton: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
}

export interface FeaturesContent {
  title: string;
  titleHighlight: string;
  description: string;
  items: FeatureItem[];
}

export interface FeaturedMembersContent {
  title: string;
  titleHighlight: string;
  description: string;
  ctaButton: string;
}

export interface StatsContent {
  stat1Label: string;
  stat2Label: string;
  stat3Label: string;
  stat4Label: string;
  stat5Label: string;
  stat6Label: string;
}

export interface SuccessStoriesContent {
  title: string;
  titleHighlight: string;
  description: string;
}

export interface DatingTipsContent {
  title: string;
  titleHighlight: string;
  description: string;
}

export interface FAQContent {
  title: string;
  titleHighlight: string;
  description: string;
}

export interface CTAContent {
  title: string;
  description: string;
  button: string;
}

export interface FooterContent {
  brandDescription: string;
  quickLinksTitle: string;
  quickLink1: string;
  quickLink2: string;
  quickLink3: string;
  accountTitle: string;
  accountLink1: string;
  accountLink2: string;
  accountLink3: string;
  supportTitle: string;
  supportLink1: string;
  supportLink2: string;
  supportLink3: string;
  supportLink4: string;
  copyright: string;
  madeWith: string;
}

export interface NavContent {
  brandName: string;
  navDiscover: string;
  navMembers: string;
  navMessages: string;
  navMatches: string;
  loginButton: string;
  registerButton: string;
}

export interface LandingContent {
  nav: NavContent;
  hero: HeroContent;
  features: FeaturesContent;
  featuredMembers: FeaturedMembersContent;
  stats: StatsContent;
  successStories: SuccessStoriesContent;
  datingTips: DatingTipsContent;
  faq: FAQContent;
  cta: CTAContent;
  footer: FooterContent;
}

// ============ DEFAULT CONTENT ============
export const defaultLandingContent: LandingContent = {
  nav: {
    brandName: "Spark",
    navDiscover: "גלו",
    navMembers: "חברים",
    navMessages: "הודעות",
    navMatches: "התאמות",
    loginButton: "התחברות",
    registerButton: "הרשמה",
  },
  hero: {
    badge: "חוויית היכרויות יוקרתית",
    titleLine1: "מפגשים",
    titleLine2: "ברמה אחרת.",
    description: "הצטרפו לקהילה האקסקלוסיבית של רווקים ורווקות נבחרים. כאן הקשרים נוצרים ברמה הכי גבוהה.",
    ctaButton: "הצטרפו עכשיו - חינם",
    secondaryButton: "גלו פרופילים",
    stat1Value: "15K+",
    stat1Label: "חברים נבחרים",
    stat2Value: "8K+",
    stat2Label: "זוגות מאושרים",
    stat3Value: "98%",
    stat3Label: "שביעות רצון",
  },
  features: {
    title: "למה",
    titleHighlight: "Spark",
    description: "הפלטפורמה המובילה להיכרויות בישראל, עם מיליוני משתמשים וטכנולוגיה חכמה להתאמות מושלמות.",
    items: [
      {
        id: "1",
        title: "התאמה חכמה",
        description: "האלגוריתם שלנו מנתח את ההעדפות שלכם ומציע התאמות מושלמות",
      },
      {
        id: "2",
        title: "פרטיות מלאה",
        description: "המידע שלכם מאובטח ומוגן. אתם שולטים במה שאחרים רואים",
      },
      {
        id: "3",
        title: "קהילה אמיתית",
        description: "כל הפרופילים מאומתים. רק אנשים אמיתיים ורציניים",
      },
    ],
  },
  featuredMembers: {
    title: "פרופילים",
    titleHighlight: "מובחרים",
    description: "הכירו כמה מהמשתמשים הפעילים שלנו",
    ctaButton: "ראו עוד פרופילים",
  },
  stats: {
    stat1Label: "חברים רשומים",
    stat2Label: "זוגות מאושרים",
    stat3Label: "הודעות ביום",
    stat4Label: "משתמשים פעילים",
    stat5Label: "העיר הפעילה ביותר",
    stat6Label: "זמן ממוצע למאצ'",
  },
  successStories: {
    title: "סיפורי",
    titleHighlight: "הצלחה",
    description: "זוגות אמיתיים שמצאו את האהבה דרך Spark",
  },
  datingTips: {
    title: "טיפים",
    titleHighlight: "לדייטינג",
    description: "עצות מקצועיות שיעזרו לכם למצוא את האהבה",
  },
  faq: {
    title: "שאלות",
    titleHighlight: "נפוצות",
    description: "מצאו תשובות לשאלות הכי נפוצות",
  },
  cta: {
    title: "מוכנים להתחיל?",
    description: "הצטרפו לאלפי אנשים שכבר מצאו את האהבה דרכנו. ההרשמה חינם!",
    button: "הירשמו עכשיו - חינם",
  },
  footer: {
    brandDescription: "הפלטפורמה המובילה להיכרויות בישראל. מצאו את האהבה שלכם היום.",
    quickLinksTitle: "קישורים מהירים",
    quickLink1: "גלה פרופילים",
    quickLink2: "Swipe",
    quickLink3: "הודעות",
    accountTitle: "חשבון",
    accountLink1: "התחברות",
    accountLink2: "הרשמה",
    accountLink3: "הפרופיל שלי",
    supportTitle: "תמיכה",
    supportLink1: "שאלות נפוצות",
    supportLink2: "צור קשר",
    supportLink3: "תנאי שימוש",
    supportLink4: "מדיניות פרטיות",
    copyright: "© {year} Spark. כל הזכויות שמורות.",
    madeWith: "עוצב עם ❤️ בישראל",
  },
};

// ============ STORAGE KEY ============
const STORAGE_KEY = "spark_landing_content";

// ============ CONTEXT ============
interface LandingContentContextType {
  content: LandingContent;
  updateContent: <K extends keyof LandingContent>(
    section: K,
    data: Partial<LandingContent[K]>
  ) => void;
  updateNestedContent: <K extends keyof LandingContent>(
    section: K,
    path: string,
    value: unknown
  ) => void;
  resetContent: () => void;
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
}

const LandingContentContext = createContext<LandingContentContextType | undefined>(undefined);

export function LandingContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<LandingContent>(() => {
    // Load from localStorage on init
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return { ...defaultLandingContent, ...JSON.parse(saved) };
        } catch {
          return defaultLandingContent;
        }
      }
    }
    return defaultLandingContent;
  });

  const [isEditMode, setIsEditMode] = useState(false);

  // Save to localStorage whenever content changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  }, [content]);

  const updateContent = <K extends keyof LandingContent>(
    section: K,
    data: Partial<LandingContent[K]>
  ) => {
    setContent((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  const updateNestedContent = <K extends keyof LandingContent>(
    section: K,
    path: string,
    value: unknown
  ) => {
    setContent((prev) => {
      const sectionData = JSON.parse(JSON.stringify(prev[section])) as LandingContent[K];
      const keys = path.split(".");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let current: any = sectionData;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      const lastKey = keys[keys.length - 1];
      current[lastKey] = value;

      return {
        ...prev,
        [section]: sectionData,
      };
    });
  };

  const resetContent = () => {
    setContent(defaultLandingContent);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <LandingContentContext.Provider
      value={{
        content,
        updateContent,
        updateNestedContent,
        resetContent,
        isEditMode,
        setIsEditMode,
      }}
    >
      {children}
    </LandingContentContext.Provider>
  );
}

export function useLandingContent() {
  const context = useContext(LandingContentContext);
  if (!context) {
    throw new Error("useLandingContent must be used within a LandingContentProvider");
  }
  return context;
}
