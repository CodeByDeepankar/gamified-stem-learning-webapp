import { Topic, LearningPath } from '@/lib/types/content';

export const grade6MathTopics: Topic[] = [
  {
    id: 'numbers-whole-natural',
    title: 'Whole Numbers and Natural Numbers',
    titleOdia: 'ପୂର୍ଣ୍ଣ ସଂଖ୍ୟା ଏବଂ ପ୍ରାକୃତିକ ସଂଖ୍ୟା',
    description: 'Understanding the number system, place value, and operations with whole numbers',
    descriptionOdia: 'ସଂଖ୍ୟା ପଦ୍ଧତି, ସ୍ଥାନୀୟ ମୂଲ୍ୟ, ଏବଂ ପୂର୍ଣ୍ଣ ସଂଖ୍ୟା ସହିତ କାର୍ଯ୍ୟକ୍ରମ',
    subject: 'mathematics',
    grade: '6',
    difficulty: 'beginner',
    estimatedDuration: 45,
    prerequisites: [],
    learningObjectives: [
      'Identify place values in numbers up to 10 crores',
      'Perform addition and subtraction of large numbers',
      'Understand the properties of whole numbers'
    ],
    learningObjectivesOdia: [
      '୧୦ କୋଟି ପର୍ଯ୍ୟନ୍ତ ସଂଖ୍ୟାରେ ସ୍ଥାନୀୟ ମୂଲ୍ୟ ଚିହ୍ନଟ କରିବା',
      'ବଡ଼ ସଂଖ୍ୟାର ଯୋଗ ଏବଂ ବିୟୋଗ କରିବା',
      'ପୂର୍ଣ୍ଣ ସଂଖ୍ୟାର ଗୁଣଧର୍ମ ବୁଝିବା'
    ],
    keywords: ['place value', 'whole numbers', 'addition', 'subtraction'],
    keywordsOdia: ['ସ୍ଥାନୀୟ ମୂଲ୍ୟ', 'ପୂର୍ଣ୍ଣ ସଂଖ୍ୟା', 'ଯୋଗ', 'ବିୟୋଗ'],
    isOfflineReady: true,
    lastUpdated: new Date('2024-01-15'),
    content: [
      {
        id: 'intro-section',
        type: 'lesson',
        title: 'Introduction to Numbers',
        titleOdia: 'ସଂଖ୍ୟାର ପରିଚୟ',
        content: `
          <h2>What are Numbers?</h2>
          <p>Numbers are symbols we use to count, measure, and label things around us. Let's explore the wonderful world of numbers!</p>
          <h3>Natural Numbers</h3>
          <p>Natural numbers are counting numbers: 1, 2, 3, 4, 5, ...</p>
          <h3>Whole Numbers</h3>
          <p>Whole numbers include zero and all natural numbers: 0, 1, 2, 3, 4, 5, ...</p>
        `,
        contentOdia: `
          <h2>ସଂଖ୍ୟା କଣ?</h2>
          <p>ସଂଖ୍ୟା ହେଉଛି ଚିହ୍ନ ଯାହାକୁ ଆମେ ଗଣନା, ମାପ, ଏବଂ ଆମ ଚାରିପାଖର ଜିନିଷଗୁଡିକୁ ଲେବଲ କରିବା ପାଇଁ ବ୍ୟବହାର କରୁ।</p>
          <h3>ପ୍ରାକୃତିକ ସଂଖ୍ୟା</h3>
          <p>ପ୍ରାକୃତିକ ସଂଖ୍ୟା ହେଉଛି ଗଣନା ସଂଖ୍ୟା: ୧, ୨, ୩, ୪, ୫, ...</p>
          <h3>ପୂର୍ଣ୍ଣ ସଂଖ୍ୟା</h3>
          <p>ପୂର୍ଣ୍ଣ ସଂଖ୍ୟା ଶୂନ୍ୟ ଏବଂ ସମସ୍ତ ପ୍ରାକୃତିକ ସଂଖ୍ୟା ଅନ୍ତର୍ଭୁକ୍ତ କରେ: ୦, ୧, ୨, ୩, ୪, ୫, ...</p>
        `,
        order: 1
      }
    ]
  },
  {
    id: 'fractions-basic',
    title: 'Introduction to Fractions',
    titleOdia: 'ଭଗ୍ନାଂଶର ପରିଚୟ',
    description: 'Basic concepts of fractions, proper and improper fractions, and simple operations',
    descriptionOdia: 'ଭଗ୍ନାଂଶର ମୌଳିକ ଧାରଣା, ଉଚିତ ଏବଂ ଅନୁଚିତ ଭଗ୍ନାଂଶ, ଏବଂ ସରଳ କାର୍ଯ୍ୟ',
    subject: 'mathematics',
    grade: '6',
    difficulty: 'intermediate',
    estimatedDuration: 60,
    prerequisites: ['numbers-whole-natural'],
    learningObjectives: [
      'Understand what fractions represent',
      'Identify proper and improper fractions',
      'Add and subtract simple fractions'
    ],
    learningObjectivesOdia: [
      'ଭଗ୍ନାଂଶ କଣ ପ୍ରତିନିଧିତ୍ୱ କରେ ବୁଝିବା',
      'ଉଚିତ ଏବଂ ଅନୁଚିତ ଭଗ୍ନାଂଶ ଚିହ୍ନଟ କରିବା',
      'ସରଳ ଭଗ୍ନାଂଶର ଯୋଗ ଏବଂ ବିୟୋଗ କରିବା'
    ],
    keywords: ['fractions', 'numerator', 'denominator', 'proper fraction'],
    keywordsOdia: ['ଭଗ୍ନାଂଶ', 'ଲବ', 'ହର', 'ଉଚିତ ଭଗ୍ନାଂଶ'],
    isOfflineReady: true,
    lastUpdated: new Date('2024-01-15'),
    content: [
      {
        id: 'fractions-intro',
        type: 'lesson',
        title: 'What are Fractions?',
        titleOdia: 'ଭଗ୍ନାଂଶ କଣ?',
        content: `
          <h2>Understanding Fractions</h2>
          <p>A fraction represents a part of a whole. When we divide something into equal parts, each part is a fraction of the whole.</p>
          <p>A fraction has two parts:</p>
          <ul>
            <li><strong>Numerator:</strong> The number on top (tells us how many parts we have)</li>
            <li><strong>Denominator:</strong> The number on bottom (tells us how many equal parts the whole is divided into)</li>
          </ul>
        `,
        contentOdia: `
          <h2>ଭଗ୍ନାଂଶ ବୁଝିବା</h2>
          <p>ଭଗ୍ନାଂଶ ଏକ ସମ୍ପୂର୍ଣ୍ଣର ଏକ ଅଂଶକୁ ପ୍ରତିନିଧିତ୍ୱ କରେ। ଯେତେବେଳେ ଆମେ କିଛି ସମାନ ଭାଗରେ ଭାଗ କରୁ, ପ୍ରତ୍ୟେକ ଅଂଶ ସମ୍ପୂର୍ଣ୍ଣର ଏକ ଭଗ୍ନାଂଶ।</p>
          <p>ଭଗ୍ନାଂଶର ଦୁଇଟି ଅଂଶ ଅଛି:</p>
          <ul>
            <li><strong>ଲବ:</strong> ଉପରେ ଥିବା ସଂଖ୍ୟା (ଆମର କେତୋଟି ଅଂଶ ଅଛି କହେ)</li>
            <li><strong>ହର:</strong> ତଳେ ଥିବା ସଂଖ୍ୟା (ସମ୍ପୂର୍ଣ୍ଣଟି କେତୋଟି ସମାନ ଅଂଶରେ ଭାଗ ହୋଇଛି କହେ)</li>
          </ul>
        `,
        order: 1
      }
    ]
  }
];

export const grade6MathPaths: LearningPath[] = [
  {
    id: 'number-systems',
    name: 'Number Systems Mastery',
    nameOdia: 'ସଂଖ୍ୟା ପଦ୍ଧତି ଦକ୍ଷତା',
    description: 'Master the fundamentals of number systems including whole numbers, fractions, and decimals',
    descriptionOdia: 'ପୂର୍ଣ୍ଣ ସଂଖ୍ୟା, ଭଗ୍ନାଂଶ ଏବଂ ଦଶମିକ ସହିତ ସଂଖ୍ୟା ପଦ୍ଧତିର ମୌଳିକ ବିଷୟରେ ଦକ୍ଷତା ହାସଲ କରନ୍ତୁ',
    subject: 'mathematics',
    grade: '6',
    estimatedDuration: 8, // hours
    topics: ['numbers-whole-natural', 'fractions-basic'],
    prerequisites: [],
    skills: ['Number sense', 'Basic arithmetic', 'Problem solving'],
    skillsOdia: ['ସଂଖ୍ୟା ଜ୍ଞାନ', 'ମୌଳିକ ଗଣିତ', 'ସମସ୍ୟା ସମାଧାନ'],
    badge: 'number-master-6',
    isRecommended: true,
    icon: '🔢',
    color: 'blue'
  }
];
