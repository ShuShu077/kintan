export function HomeIcon({ size = 28, color = "#ccc" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M4 14L16 4L28 14" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 12V26H13V19H19V26H25V12" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="19" y="5" width="4" height="6" rx="1" fill={color}/>
    </svg>
  );
}

export function CalendarIcon({ size = 28, color = "#ccc" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="3" y="7" width="26" height="22" rx="3" stroke={color} strokeWidth="2.5"/>
      <rect x="3" y="7" width="26" height="8" rx="3" fill={color}/>
      <line x1="10" y1="4" x2="10" y2="10" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="22" y1="4" x2="22" y2="10" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="10" cy="20" r="1.8" fill={color}/>
      <circle cx="16" cy="20" r="1.8" fill={color}/>
      <circle cx="22" cy="20" r="1.8" fill={color}/>
      <circle cx="10" cy="26" r="1.8" fill={color}/>
      <circle cx="16" cy="26" r="1.8" fill={color}/>
    </svg>
  );
}

export function MealIcon({ size = 28, color = "#ccc" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <ellipse cx="16" cy="20" rx="12" ry="8" stroke={color} strokeWidth="2.5"/>
      <path d="M11 20C11 16.5 13.5 14 16 14C18.5 14 21 16.5 21 20" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="6" y1="6" x2="6" y2="14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="4" y1="6" x2="4" y2="10" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="8" y1="6" x2="8" y2="10" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M26 6C26 6 27 8 27 10C27 12 26 13 26 14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="26" y1="6" x2="26" y2="14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function WorkoutIcon({ size = 28, color = "#ccc" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <line x1="8" y1="16" x2="24" y2="16" stroke={color} strokeWidth="2.8" strokeLinecap="round"/>
      <rect x="2" y="11" width="5" height="10" rx="2" fill={color}/>
      <rect x="6" y="13" width="3" height="6" rx="1.5" fill={color}/>
      <rect x="25" y="11" width="5" height="10" rx="2" fill={color}/>
      <rect x="23" y="13" width="3" height="6" rx="1.5" fill={color}/>
      <path d="M12 16C12 12 14 9 16 9C18 9 20 12 20 16" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
      <circle cx="16" cy="6.5" r="3" fill={color}/>
    </svg>
  );
}

export function SettingsIcon({ size = 28, color = "#ccc" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 4L17.8 7.2C18.6 7.4 19.4 7.8 20.1 8.3L23.6 7.4L26.6 12.6L24.1 15C24.1 15.3 24.2 15.7 24.2 16C24.2 16.3 24.1 16.7 24.1 17L26.6 19.4L23.6 24.6L20.1 23.7C19.4 24.2 18.6 24.6 17.8 24.8L16 28L14.2 24.8C13.4 24.6 12.6 24.2 11.9 23.7L8.4 24.6L5.4 19.4L7.9 17C7.9 16.7 7.8 16.3 7.8 16C7.8 15.7 7.9 15.3 7.9 15L5.4 12.6L8.4 7.4L11.9 8.3C12.6 7.8 13.4 7.4 14.2 7.2Z" stroke={color} strokeWidth="2.2" strokeLinejoin="round"/>
      <circle cx="16" cy="16" r="4.5" stroke={color} strokeWidth="2.2"/>
    </svg>
  );
}

export function BodyIcon({ size = 28, color = "#ccc" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="6" r="4" stroke={color} strokeWidth="2.2"/>
      <line x1="16" y1="10" x2="16" y2="13" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M8 14H24" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M8 14L6 22" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M24 14L26 22" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M10 14L9 24H14L16 20L18 24H23L22 14" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 24L13 30" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M18 24L19 30" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  );
}
