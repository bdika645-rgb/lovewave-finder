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
  },
];
