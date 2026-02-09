export interface Member {
  id: string;
  name: string;
  age: number;
  city: string;
  bio: string;
  image: string;
  interests: string[];
  isOnline: boolean;
  lastActive?: string;
  occupation?: string;
  education?: string;
  height?: number;
  lookingFor?: string;
  isVerified?: boolean;
}

// Static members removed - app now uses real database profiles

// Israeli cities for filtering
export const israeliCities = [
  "תל אביב",
  "ירושלים", 
  "חיפה",
  "באר שבע",
  "אשדוד",
  "נתניה",
  "הרצליה",
  "רמת גן",
  "פתח תקווה",
  "ראשון לציון",
  "רעננה",
  "כפר סבא",
  "רחובות",
  "מודיעין",
  "אילת",
  "טבריה",
  "נהריה",
  "עכו",
  "קריית שמונה",
];

// All available interests
export const allInterests = [
  "טיולים",
  "בישול",
  "יוגה",
  "קפה",
  "מוזיקה",
  "טכנולוגיה",
  "ספורט",
  "קולנוע",
  "אמנות",
  "טבע",
  "ריצה",
  "תיאטרון",
  "יזמות",
  "צילום",
  "פסיכולוגיה",
  "חתולים",
  "כלבים",
  "נטפליקס",
  "גלישה",
  "כושר",
  "יין",
  "הופעות",
  "קריאה",
  "משחקים",
  "נסיעות",
  "עיצוב",
  "בילוי",
  "מסיבות",
  "שחייה",
  "רכיבה על אופניים",
];

// Success stories
export interface SuccessStory {
  id: string;
  names: string;
  image1: string;
  image2: string;
  story: string;
  date: string;
  location: string;
}

export const successStories: SuccessStory[] = [
  {
    id: "1",
    names: "יעל ואריאל",
    image1: "/profiles/profile1.jpg",
    image2: "/profiles/profile2.jpg",
    story: "נפגשנו ב-Spark לפני שנתיים. היום אנחנו נשואים ומצפים לתינוק הראשון שלנו! תודה שעזרתם לנו למצוא אחד את השנייה ❤️",
    date: "נישאו ב-2024",
    location: "תל אביב",
  },
  {
    id: "2",
    names: "דנה ומיכאל",
    image1: "/profiles/profile3.jpg",
    image2: "/profiles/profile4.jpg",
    story: "הייתי סקפטית בהתחלה, אבל הכימיה הייתה מיידית. כבר שנה וחצי ביחד והקשר רק מתחזק. הכי טוב שקרה לי!",
    date: "ביחד מ-2023",
    location: "ירושלים",
  },
  {
    id: "3",
    names: "רון ולי",
    image1: "/profiles/profile2.jpg",
    image2: "/profiles/profile1.jpg",
    story: "חשבתי שלא אמצא אהבה באפליקציות. Spark הוכיח שטעיתי. רון הוא הבן זוג המושלם עבורי!",
    date: "מאורסים",
    location: "חיפה",
  },
  {
    id: "4",
    names: "נועם ושירי",
    image1: "/profiles/profile4.jpg",
    image2: "/profiles/profile3.jpg",
    story: "ההתאמה הייתה מושלמת מהרגע הראשון. אנחנו חולקים את אותם תחביבים, חלומות ושאיפות. תודה Spark!",
    date: "ביחד מ-2024",
    location: "הרצליה",
  },
];

// FAQ data
export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    id: "1",
    question: "האם השירות באמת חינמי?",
    answer: "כן! Spark הוא חינמי לחלוטין. כל התכונות פתוחות לכולם - לייקים ללא הגבלה, צ'אט, סינון מתקדם והכל. זה המודל שלנו!",
  },
  {
    id: "2",
    question: "איך אני יודע/ת שהפרופילים אמיתיים?",
    answer: "כל פרופיל חדש עובר תהליך אימות. אנחנו משתמשים בטכנולוגיה מתקדמת לזיהוי פרופילים מזויפים ובודקים ידנית פרופילים חשודים.",
  },
  {
    id: "3",
    question: "מה קורה אם מישהו מטריד אותי?",
    answer: "בטיחות המשתמשים שלנו בראש סדר העדיפויות. ניתן לחסום ולדווח על כל משתמש. צוות התמיכה שלנו זמין 24/7 לטפל בכל בעיה.",
  },
  {
    id: "4",
    question: "איך עובד האלגוריתם ההתאמה?",
    answer: "האלגוריתם שלנו מנתח את ההעדפות שציינתם, תחומי העניין המשותפים, המיקום ועוד פרמטרים רבים כדי להציע לכם את ההתאמות הכי מתאימות.",
  },
  {
    id: "5",
    question: "האם אפשר למחוק את החשבון?",
    answer: "כמובן. ניתן למחוק את החשבון בכל עת דרך הגדרות הפרופיל. כל המידע שלכם יימחק לצמיתות מהמערכת.",
  },
  {
    id: "6",
    question: "למה הכל חינמי?",
    answer: "אנחנו מאמינים שכולם צריכים גישה שווה לאהבה. המודל שלנו מבוסס על קהילה חזקה ולא על תשלומים.",
  },
];


// Dating tips
export interface DatingTip {
  id: string;
  title: string;
  content: string;
  category: string;
}

export const datingTips: DatingTip[] = [
  {
    id: "1",
    title: "איך לכתוב ביו מושך",
    content: "הביו שלכם הוא הדבר הראשון שאנשים קוראים. כתבו משהו אותנטי ומעניין שמשקף את האישיות שלכם. הוסיפו קצת הומור!",
    category: "פרופיל",
  },
  {
    id: "2",
    title: "בחירת תמונות נכונה",
    content: "תמונה ראשית ברורה עם חיוך, תמונות מפעילויות שאתם אוהבים, ותמונה אחת לפחות של כל הגוף. הימנעו מפילטרים מוגזמים.",
    category: "פרופיל",
  },
  {
    id: "3",
    title: "הודעה ראשונה מנצחת",
    content: "הימנעו מ'היי מה נשמע'. התייחסו למשהו ספציפי מהפרופיל שלהם. שאלו שאלה פתוחה שמזמינה לשיחה.",
    category: "שיחות",
  },
  {
    id: "4",
    title: "מתי לבקש להיפגש",
    content: "אחרי כמה ימים של שיחה טובה, הציעו להיפגש. יותר מדי זמן בצ'אט עלול להוביל לאכזבה במפגש האמיתי.",
    category: "דייטים",
  },
  {
    id: "5",
    title: "רעיונות לדייט ראשון",
    content: "בית קפה או בר הם אופציות קלאסיות. פעילות משותפת כמו גלריה או שוק יכולה לשבור את הקרח בקלות.",
    category: "דייטים",
  },
  {
    id: "6",
    title: "איך להתמודד עם דחייה",
    content: "דחייה היא חלק מהמשחק. אל תיקחו את זה אישית. המשיכו הלאה ותזכרו שיש מישהו בשבילכם.",
    category: "מוטיבציה",
  },
];

// Statistics
export const siteStatistics = {
  totalMembers: "150,000+",
  dailyActiveUsers: "25,000+",
  successfulMatches: "8,500+",
  messagesPerDay: "500,000+",
  averageAge: 28,
  genderRatio: "52% נשים / 48% גברים",
  mostActiveCity: "תל אביב",
  averageMatchTime: "3 ימים",
};
