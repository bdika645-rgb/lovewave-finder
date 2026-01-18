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
  isPremium?: boolean;
}

export const members: Member[] = [
  {
    id: "1",
    name: "מיכל",
    age: 26,
    city: "תל אביב",
    bio: "אוהבת לטייל, לקרוא ספרים ולבשל. מחפשת מישהו עם חוש הומור טוב 😊",
    image: "/profiles/profile1.jpg",
    interests: ["טיולים", "בישול", "יוגה", "קפה"],
    isOnline: true,
    occupation: "מעצבת גרפית",
    education: "תואר ראשון בעיצוב",
    height: 165,
    lookingFor: "קשר רציני",
    isPremium: true,
  },
  {
    id: "2",
    name: "דניאל",
    age: 29,
    city: "ירושלים",
    bio: "מהנדס תוכנה ביום, מוזיקאי בלילה. אוהב הרפתקאות ואנשים אמיתיים.",
    image: "/profiles/profile2.jpg",
    interests: ["מוזיקה", "טכנולוגיה", "ספורט", "קולנוע"],
    isOnline: false,
    lastActive: "לפני שעה",
    occupation: "מהנדס תוכנה",
    education: "תואר שני במדעי המחשב",
    height: 180,
    lookingFor: "קשר רציני",
  },
  {
    id: "3",
    name: "נועה",
    age: 31,
    city: "חיפה",
    bio: "עורכת דין, חובבת אמנות וטבע. מחפשת קשר רציני עם מישהו בעל עומק.",
    image: "/profiles/profile3.jpg",
    interests: ["אמנות", "טבע", "ריצה", "תיאטרון"],
    isOnline: true,
    occupation: "עורכת דין",
    education: "תואר במשפטים",
    height: 170,
    lookingFor: "קשר רציני",
    isPremium: true,
  },
  {
    id: "4",
    name: "יונתן",
    age: 27,
    city: "הרצליה",
    bio: "יזם ומטייל. מאמין שהחיים קצרים מכדי להיות משעממים. בואי נרים כוסית ☕",
    image: "/profiles/profile4.jpg",
    interests: ["יזמות", "טיולים", "צילום", "קפה"],
    isOnline: true,
    occupation: "יזם",
    education: "תואר ראשון במנהל עסקים",
    height: 178,
    lookingFor: "הכל פתוח",
  },
  {
    id: "5",
    name: "שירה",
    age: 24,
    city: "רמת גן",
    bio: "סטודנטית לפסיכולוגיה עם אהבה גדולה לחתולים. מחפשת מישהו לצחוק איתו על החיים 🐱",
    image: "/profiles/profile1.jpg",
    interests: ["פסיכולוגיה", "חתולים", "נטפליקס", "מוזיקה"],
    isOnline: true,
    occupation: "סטודנטית",
    education: "תואר ראשון בפסיכולוגיה",
    height: 162,
    lookingFor: "לראות לאן זה מוביל",
  },
  {
    id: "6",
    name: "עומר",
    age: 32,
    city: "תל אביב",
    bio: "שף במקצוע, גורמה באופי. אוהב לבשל ארוחות רומנטיות ולטייל בעולם 🍳",
    image: "/profiles/profile2.jpg",
    interests: ["בישול", "יין", "טיולים", "צילום אוכל"],
    isOnline: false,
    lastActive: "לפני 3 שעות",
    occupation: "שף",
    education: "בית ספר לבישול",
    height: 182,
    lookingFor: "קשר רציני",
    isPremium: true,
  },
  {
    id: "7",
    name: "תמר",
    age: 28,
    city: "באר שבע",
    bio: "רופאה בהתמחות, מאמינה שהחיים מתחילים מחוץ לאזור הנוחות. מי מצטרף להרפתקה? 🏔️",
    image: "/profiles/profile3.jpg",
    interests: ["רפואה", "טיפוס", "יוגה", "קריאה"],
    isOnline: true,
    occupation: "רופאה מתמחה",
    education: "דוקטורט לרפואה",
    height: 168,
    lookingFor: "קשר רציני",
  },
  {
    id: "8",
    name: "אלון",
    age: 30,
    city: "נתניה",
    bio: "מאמן כושר וחובב טבע. מחפש מישהי פעילה שאוהבת את החיים 💪",
    image: "/profiles/profile4.jpg",
    interests: ["כושר", "גלישה", "טבע", "תזונה בריאה"],
    isOnline: true,
    occupation: "מאמן כושר",
    education: "הסמכה באימון אישי",
    height: 185,
    lookingFor: "הכל פתוח",
  },
  {
    id: "9",
    name: "מאיה",
    age: 25,
    city: "ראשון לציון",
    bio: "מוזיקאית ויוצרת. בעולם שלי יש הרבה נגינה, קפה טוב וחברים אמיתיים 🎵",
    image: "/profiles/profile1.jpg",
    interests: ["מוזיקה", "כתיבה", "הופעות", "קפה"],
    isOnline: false,
    lastActive: "לפני 30 דקות",
    occupation: "מוזיקאית",
    education: "לימודי מוזיקה",
    height: 160,
    lookingFor: "לראות לאן זה מוביל",
    isPremium: true,
  },
  {
    id: "10",
    name: "רועי",
    age: 35,
    city: "רעננה",
    bio: "עורך דין בינלאומי, חובב אמנות ויין משובח. מחפש שותפה לחיים 🍷",
    image: "/profiles/profile2.jpg",
    interests: ["יין", "אמנות", "נסיעות", "משפטים"],
    isOnline: true,
    occupation: "עורך דין",
    education: "תואר שני במשפטים",
    height: 175,
    lookingFor: "קשר רציני",
    isPremium: true,
  },
  {
    id: "11",
    name: "ליאור",
    age: 27,
    city: "פתח תקווה",
    bio: "מתכנתת ומעצבת UX. אוהבת לפתור בעיות ולעצב חוויות יפות. בואו נכיר! 💻",
    image: "/profiles/profile3.jpg",
    interests: ["עיצוב", "טכנולוגיה", "משחקים", "הליכות"],
    isOnline: true,
    occupation: "מעצבת UX/UI",
    education: "תואר בעיצוב תקשורת חזותית",
    height: 167,
    lookingFor: "לראות לאן זה מוביל",
  },
  {
    id: "12",
    name: "איתי",
    age: 33,
    city: "אשדוד",
    bio: "ארכיטקט עם תשוקה לעיצוב ולטיולים. מחפש מישהי עם חזון ושאיפות 🏛️",
    image: "/profiles/profile4.jpg",
    interests: ["אדריכלות", "עיצוב", "טיולים", "צילום"],
    isOnline: false,
    lastActive: "אתמול",
    occupation: "ארכיטקט",
    education: "תואר באדריכלות",
    height: 183,
    lookingFor: "קשר רציני",
  },
];

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
    question: "האם ההרשמה באמת חינם?",
    answer: "כן! ההרשמה ל-Spark היא חינמית לחלוטין. תוכלו ליצור פרופיל, לגלוש בפרופילים ולקבל התאמות. למשתמשי פרימיום יש גישה לתכונות מתקדמות נוספות.",
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
    question: "מה ההבדל בין חשבון רגיל לפרימיום?",
    answer: "משתמשי פרימיום נהנים מתכונות מתקדמות כמו: לייקים ללא הגבלה, ראיית מי עשה לייק, סינון מתקדם, ביטול סוויפ, ובוסט לפרופיל.",
  },
];

// Premium features
export interface PremiumFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const premiumFeatures: PremiumFeature[] = [
  {
    id: "1",
    title: "לייקים ללא הגבלה",
    description: "שלחו כמה לייקים שתרצו ביום, בלי הגבלות",
    icon: "heart",
  },
  {
    id: "2",
    title: "ראו מי עשה לייק",
    description: "גלו מי אוהב אתכם עוד לפני שאתם עושים סוויפ",
    icon: "eye",
  },
  {
    id: "3",
    title: "סינון מתקדם",
    description: "סננו לפי גובה, השכלה, מקצוע ועוד",
    icon: "filter",
  },
  {
    id: "4",
    title: "ביטול סוויפ",
    description: "טעיתם? חזרו אחורה וקבלו הזדמנות נוספת",
    icon: "undo",
  },
  {
    id: "5",
    title: "בוסט לפרופיל",
    description: "הפרופיל שלכם יופיע ליותר אנשים",
    icon: "rocket",
  },
  {
    id: "6",
    title: "תגית פרימיום",
    description: "בלטו עם תגית זהב בפרופיל שלכם",
    icon: "crown",
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
