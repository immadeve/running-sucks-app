import { TableRowData } from '../components/AppTable';

export const runningContent = {
  hate: [
    {
      id: 1,
      name: 'Morning Jog',
      description: 'Early morning torture session',
      details:
        'Waking up at 5 AM just to suffer through 30 minutes of pure agony while your lungs burn and your legs scream for mercy.',
    },
    {
      id: 2,
      name: 'Marathon Training',
      description: 'Long distance misery',
      details:
        'Spending hours running in circles like a hamster on a wheel, slowly destroying your knees and questioning all your life choices.',
    },
    {
      id: 3,
      name: 'Sprint Intervals',
      description: 'High intensity suffering',
      details:
        'Short bursts of maximum pain followed by gasping for air like a fish out of water. Repeat until you hate yourself.',
    },
    {
      id: 4,
      name: 'Trail Running',
      description: 'Nature-based punishment',
      details:
        'Getting lost in the woods while tripping over roots and rocks, all while being attacked by mosquitoes and regretting every step.',
    },
    {
      id: 5,
      name: 'Treadmill Session',
      description: 'Indoor monotony',
      details:
        'Staring at a wall while running nowhere, listening to the same playlist on repeat and slowly losing your sanity.',
    },
  ] as TableRowData[],

  love: [
    {
      id: 1,
      name: 'Morning Jog',
      description: 'Energizing sunrise adventure',
      details:
        'Starting the day with a refreshing run as the sun rises, feeling the cool morning air and experiencing the peaceful quiet of dawn.',
    },
    {
      id: 2,
      name: 'Marathon Training',
      description: 'Building endurance and character',
      details:
        'Gradually building stamina and mental toughness while enjoying scenic routes and the satisfaction of reaching new distance goals.',
    },
    {
      id: 3,
      name: 'Sprint Intervals',
      description: 'High-energy power session',
      details:
        'Quick bursts of speed that boost metabolism, improve cardiovascular health, and provide an amazing endorphin rush afterward.',
    },
    {
      id: 4,
      name: 'Trail Running',
      description: 'Nature exploration workout',
      details:
        'Discovering beautiful trails, breathing fresh forest air, and connecting with nature while getting an excellent full-body workout.',
    },
    {
      id: 5,
      name: 'Track Running',
      description: 'Structured improvement',
      details:
        'Measuring progress with precise laps, enjoying the rhythmic meditative quality, and celebrating personal records and improvements.',
    },
  ] as TableRowData[],

  analyze: [] as TableRowData[], // Empty array for analyze tab - will show ActivityAnalyzer component

  settings: [] as TableRowData[], // Empty array for settings tab - will show AppSettings component
};

export type ContentType = 'hate' | 'love' | 'analyze' | 'settings';

export const getContentByButtonText = (buttonText: string): ContentType => {
  if (buttonText.toLowerCase().includes('hate')) {
    return 'hate';
  } else if (buttonText.toLowerCase().includes('love')) {
    return 'love';
  } else if (buttonText.toLowerCase().includes('analyze')) {
    return 'analyze';
  }
  return 'hate'; // default fallback
};
