import {
  StudentProfile,
  Course,
  ScheduleEvent,
  Task,
  Project,
  Assessment,
  Note,
  Resource,
  FocusSession,
  Goal,
  Habit,
  Flashcard,
  BrainDumpSticky,
} from './types';

export const initialProfile: StudentProfile = {
  name: 'Miquel Rocas',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  university: 'Universitat Pompeu Fabra (UPF)',
  degree: 'B.A. Audiovisual Communication & Media Studies',
  year: 'Year 3',
  semester: 'Semester 1 (Fall 2026)',
  academicGoals: 'Complete documentary graduation project, maintain ≥ 8.8 GPA for department honors, and submit festival rough cut to Doclisboa & Sheffield DocFest.',
  targetGpa: 8.8,
  totalCreditsRequired: 180,
  earnedCredits: 144,
  preferredStudyTime: '15:00 - 19:30',
  typicalFocusDuration: 50,
};

export const initialCourses: Course[] = [
  {
    id: 'course-algo',
    name: 'Digital Cinema & Post-Production Workshop',
    code: 'MED301',
    professor: 'Prof. Clara Puig',
    room: 'Edit Bay 4B / Studio 1',
    ects: 6,
    semester: 'Semester 1',
    academicYear: '2026/2027',
    targetGrade: 9.0,
    currentGrade: 8.6,
    color: '#f59e0b', // Cinema Amber
    status: 'active',
    attendance: {
      attended: 19,
      total: 20,
      minRequiredPercent: 80,
    },
  },
  {
    id: 'course-ai',
    name: 'Critical Media Theory & Semiotics',
    code: 'MED304',
    professor: 'Dr. David Harvey',
    room: 'Lecture Hall 201',
    ects: 6,
    semester: 'Semester 1',
    academicYear: '2026/2027',
    targetGrade: 8.8,
    currentGrade: 8.2,
    color: '#06b6d4', // Cinema Cyan
    status: 'active',
    attendance: {
      attended: 18,
      total: 20,
      minRequiredPercent: 80,
    },
  },
  {
    id: 'course-db',
    name: 'Visual Journalism & Documentary Ethics',
    code: 'MED302',
    professor: 'Prof. Mireia Soler',
    room: 'Media Lab B',
    ects: 6,
    semester: 'Semester 1',
    academicYear: '2026/2027',
    targetGrade: 8.5,
    currentGrade: 8.4,
    color: '#e07a5f', // Film Terracotta
    status: 'active',
    attendance: {
      attended: 17,
      total: 20,
      minRequiredPercent: 80,
    },
  },
  {
    id: 'course-se',
    name: 'Sound Design & Sonic Media',
    code: 'MED305',
    professor: 'Prof. Liam Gallagher',
    room: 'Audio Studio 2',
    ects: 6,
    semester: 'Semester 1',
    academicYear: '2026/2027',
    targetGrade: 9.5,
    currentGrade: 9.1,
    color: '#10b981', // Studio Sage
    status: 'active',
    attendance: {
      attended: 20,
      total: 20,
      minRequiredPercent: 80,
    },
  },
  {
    id: 'course-res',
    name: 'Transmedia Narratives & Digital Culture',
    code: 'MED308',
    professor: 'Dr. Sarah Jenkins',
    room: 'Seminar Room 104',
    ects: 6,
    semester: 'Semester 1',
    academicYear: '2026/2027',
    targetGrade: 8.5,
    currentGrade: 7.8,
    color: '#a855f7', // Editorial Violet
    status: 'active',
    attendance: {
      attended: 16,
      total: 18,
      minRequiredPercent: 80,
    },
  },
];

// Anchored around 2026-09-10 (Thursday)
export const initialScheduleEvents: ScheduleEvent[] = [
  {
    id: 'evt-1',
    title: 'Critical Media Theory Lecture: Semiotics & Visual Culture',
    courseId: 'course-ai',
    type: 'class',
    date: '2026-09-10',
    startTime: '10:00',
    endTime: '11:30',
    location: 'Lecture Hall 201',
    notes: 'Roland Barthes: Mythologies, denotation vs. connotation in contemporary algorithmic media.',
  },
  {
    id: 'evt-2',
    title: 'Digital Cinema Lab: Color Grading & Post-Production',
    courseId: 'course-algo',
    type: 'class',
    date: '2026-09-10',
    startTime: '14:00',
    endTime: '15:30',
    location: 'Edit Bay 4B / Studio 1',
    notes: 'Hands-on grading session in DaVinci Resolve: Color wheels, log exposure balancing, and print film emulation.',
  },
  {
    id: 'evt-3',
    title: 'Documentary Audio Mixdown Session',
    courseId: 'course-se',
    type: 'study',
    date: '2026-09-10',
    startTime: '16:00',
    endTime: '17:30',
    location: 'Audio Studio 2',
    notes: 'Dialogue denoising with iZotope RX and atmospheric room tone layers.',
  },
  {
    id: 'evt-4',
    title: 'Visual Journalism Lab: Observational Shoot Review',
    courseId: 'course-db',
    type: 'class',
    date: '2026-09-11',
    startTime: '09:00',
    endTime: '11:00',
    location: 'Media Lab B',
    notes: 'Screening raw documentary rushes & discussing subject consent ethics.',
  },
  {
    id: 'evt-5',
    title: 'Transmedia Narratives Seminar: Participatory Fandoms',
    courseId: 'course-res',
    type: 'class',
    date: '2026-09-11',
    startTime: '12:00',
    endTime: '13:30',
    location: 'Seminar Room 104',
    notes: 'Discussion of Henry Jenkins & platform convergence on TikTok and YouTube.',
  },
  {
    id: 'evt-6',
    title: 'Director Cut Screening & Edit Review',
    courseId: 'course-algo',
    type: 'study',
    date: '2026-09-12',
    startTime: '15:00',
    endTime: '17:00',
    location: 'Screening Pod 3',
  },
  {
    id: 'evt-7',
    title: 'Cinema Aesthetics Midterm Defense',
    courseId: 'course-algo',
    type: 'exam',
    date: '2026-09-17',
    startTime: '10:00',
    endTime: '12:30',
    location: 'Cinema Screening Hall A',
    notes: 'Formal oral defense of directing choices and montage theory in 10-minute short film cut.',
  },
];

export const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Color Grade 5-Minute Documentary Rough Cut in DaVinci',
    description: 'Balance log gamma exposure, apply Kodak 2383 print LUT, and match vectorscope skin tone line across all interview shots.',
    courseId: 'course-algo',
    dueDate: '2026-09-11',
    priority: 'urgent',
    status: 'todo',
    estimatedMinutes: 50,
    actualMinutes: 0,
    tags: ['editing', 'davinci', 'color'],
    subtasks: [
      { id: 'sub-1', text: 'Apply CST (Camera Space Transform) from Sony S-Log3 to Rec.709', completed: true },
      { id: 'sub-2', text: 'Match interview shot lighting across 3 takes', completed: true },
      { id: 'sub-3', text: 'Export ProRes 422 HQ preview file for Prof. Puig', completed: false },
    ],
  },
  {
    id: 'task-2',
    title: 'Annotate Stuart Hall: "Encoding and Decoding in Television Discourse"',
    description: 'Read chapters 2 & 4. Highlight dominant-hegemonic, negotiated, and oppositional decoding positions for Friday seminar.',
    courseId: 'course-ai',
    dueDate: '2026-09-13',
    priority: 'high',
    status: 'in_progress',
    estimatedMinutes: 60,
    actualMinutes: 25,
    tags: ['theory', 'reading', 'semiotics'],
    subtasks: [
      { id: 'sub-4', text: 'Summarize 3 hypothetical decoding positions', completed: true },
      { id: 'sub-5', text: 'Draft 2 seminar discussion questions on modern algorithmic feeds', completed: false },
    ],
  },
  {
    id: 'task-3',
    title: 'Sound Foley & Atmospheric Mixdown for Scene 3',
    description: 'Clean subway station ambient hum, record footsteps on concrete, and balance stereo field width.',
    courseId: 'course-se',
    dueDate: '2026-09-15',
    priority: 'medium',
    status: 'todo',
    estimatedMinutes: 90,
    actualMinutes: 0,
    tags: ['audio', 'foley', 'sound-design'],
    subtasks: [
      { id: 'sub-6', text: 'Clean 50Hz hum from boom mic recording in iZotope', completed: true },
      { id: 'sub-7', text: 'Set dialogue loudness to -24 LKFS broadcast standard', completed: false },
    ],
  },
  {
    id: 'task-4',
    title: 'Draft Documentary Subject Informed Consent & Ethics Protocol',
    description: 'Legal releases for street vendors featured in documentary short film "Echoes of Poblenou".',
    courseId: 'course-db',
    dueDate: '2026-09-10',
    priority: 'high',
    status: 'completed',
    estimatedMinutes: 45,
    actualMinutes: 40,
    tags: ['ethics', 'legal', 'documentary'],
    subtasks: [
      { id: 'sub-8', text: 'Bilingual consent release template (Catalan/Spanish)', completed: true },
      { id: 'sub-9', text: 'Department ethics committee approval stamp', completed: true },
    ],
  },
  {
    id: 'task-5',
    title: 'Prepare Cinema Aesthetics Presentation Slides',
    description: 'Montage theory: Metric, Rhythmic, Tonal, Overtonal, and Intellectual Montage with video clip examples.',
    courseId: 'course-algo',
    dueDate: '2026-09-16',
    priority: 'urgent',
    status: 'todo',
    estimatedMinutes: 60,
    actualMinutes: 0,
    tags: ['presentation', 'cinema', 'montage'],
    subtasks: [],
  },
];

export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'Graduation Documentary Short: "Echoes of Poblenou"',
    description: 'A 15-minute observational documentary exploring gentrification, industrial heritage, and artist squats in Barcelona\'s Poblenou district.',
    courseId: 'course-algo',
    deadline: '2026-11-25',
    progress: 68,
    estimatedHours: 65,
    actualHours: 42,
    milestones: [
      { id: 'm-1', title: 'Principal Photography & B-Roll Capture', completed: true },
      { id: 'm-2', title: 'Assembly Cut (22 minutes)', completed: true },
      { id: 'm-3', title: 'Fine Cut & Music Score Integration', completed: false, dueDate: '2026-10-10' },
      { id: 'm-4', title: 'Color Grading & Final DCP Export', completed: false, dueDate: '2026-11-20' },
    ],
  },
  {
    id: 'proj-2',
    title: 'B.A. Critical Thesis: Semiotics in Short-Form Algorithmic Video',
    description: 'Investigating how hyper-accelerated video editing on TikTok reconstructs visual attention and ideological framing.',
    courseId: 'course-ai',
    deadline: '2026-12-18',
    progress: 35,
    estimatedHours: 50,
    actualHours: 18,
    milestones: [
      { id: 'm-5', title: 'Thesis Proposal & Advisor Sign-off', completed: true },
      { id: 'm-6', title: 'Corpus Analysis of 100 Viral Media Artefacts', completed: false, dueDate: '2026-10-25' },
      { id: 'm-7', title: 'Theoretical Chapters: Barthes & Baudrillard', completed: false, dueDate: '2026-11-30' },
    ],
  },
];

export const initialAssessments: Assessment[] = [
  {
    id: 'exam-1',
    name: 'Midterm Defense: Visual Storytelling & Cinema Aesthetics',
    courseId: 'course-algo',
    type: 'midterm',
    date: '2026-09-17',
    time: '10:00',
    weight: 35,
    expectedGrade: 9.0,
    status: 'upcoming',
    topics: [
      { name: 'Montage Theory (Eisenstein vs Bazin)', readiness: 94 },
      { name: 'Color Science & Gamut Transforms in Post', readiness: 86 },
      { name: 'Cinematic Framing & Aspect Ratio Ethics', readiness: 78 },
      { name: 'Directorial Voice & Mise-en-scène', readiness: 88 },
    ],
    notes: 'Screen 5-minute scene from rough cut and defend editorial pacing choices before jury panel.',
  },
  {
    id: 'exam-2',
    name: 'Critical Essay: Media Hegemony & Audience Reception',
    courseId: 'course-ai',
    type: 'assignment',
    date: '2026-09-24',
    time: '14:00',
    weight: 25,
    expectedGrade: 8.8,
    status: 'upcoming',
    topics: [
      { name: 'Stuart Hall Encoding/Decoding Model', readiness: 85 },
      { name: 'Gramsci: Cultural Hegemony & Manufacturing Consent', readiness: 80 },
      { name: 'The Gaze in Cinema: Laura Mulvey & John Berger', readiness: 92 },
    ],
    notes: '2,500 words essay with Q1 academic references.',
  },
  {
    id: 'exam-3',
    name: 'Soundscape & Foley Portfolio Submission',
    courseId: 'course-se',
    type: 'assignment',
    date: '2026-09-04',
    weight: 30,
    grade: 9.2,
    status: 'graded',
    topics: [
      { name: 'Multi-Track Spatial Panning & Automation', readiness: 96 },
      { name: 'Acoustic Room Tone & Foley Synchronization', readiness: 92 },
    ],
    notes: 'Outstanding mix quality. The sub-bass textures in the industrial sequence were masterfully balanced.',
  },
  {
    id: 'exam-4',
    name: 'Documentary Ethics Protocol & Pilot Screening',
    courseId: 'course-db',
    type: 'presentation',
    date: '2026-09-06',
    weight: 25,
    grade: 8.6,
    status: 'graded',
    topics: [
      { name: 'Ethics of the Observational Camera', readiness: 90 },
      { name: 'Interviewee Rights & Power Dynamics in Non-Fiction', readiness: 88 },
    ],
  },
];

export const initialNotes: Note[] = [
  {
    id: 'note-1',
    title: 'Montage Theory: Sergei Eisenstein vs. André Bazin',
    courseId: 'course-algo',
    folder: 'Film Aesthetics',
    tags: ['editing', 'cinema-theory', 'midterm-prep'],
    isPinned: true,
    isFavorite: true,
    updatedAt: '2026-09-09',
    content: `# Eisenstein vs. Bazin: The Dialectic of Cinema

## Sergei Eisenstein — The Collision of Shots
Cinema is not an aggregation of scenes; it is a collision of independent ideas producing a third new psychological meaning:

1. **Metric Montage**: Cutting determined by physical length of film strips according to musical tempo.
2. **Rhythmic Montage**: Cutting determined by movement *within* the frame (e.g. soldiers marching down the Odessa Steps).
3. **Tonal Montage**: Cuts determined by emotional luminosity, texture, graphic grain.
4. **Overtonal Montage**: The complex synthesis of metric, rhythmic, and tonal vibrations.
5. **Intellectual Montage**: Conceptual juxtaposition (e.g. cutting from striking workers to slaughterhouse cattle).

## André Bazin — The Ontological Realism of Deep Focus
In opposition to Soviet montage, Bazin argues that montage *robs the spectator of freedom*:
- Respect the continuum of reality via **deep focus** (Gregg Toland / Orson Welles).
- The **long take** (plan-séquence) allows the spectator to choose where to look.
- Cutting fragments what reality left whole.

> **Key takeaway for my film**: Use Bazin's long takes for the craftsman's workshop scenes, but switch to rhythmic Eisenstein cuts when capturing the demolition bulldozers.`,
  },
  {
    id: 'note-2',
    title: 'Color Science in DaVinci Resolve: S-Log3, Gamut Mapping & Film Stocks',
    courseId: 'course-algo',
    folder: 'Post-Production',
    tags: ['color-grading', 'davinci', 'workflow'],
    isPinned: false,
    isFavorite: true,
    updatedAt: '2026-09-08',
    content: `# Color Grading Workflow Blueprint

## Why We Shoot Log:
Linear sensors record light linearly, but human vision perceives lightness logarithmically (Weber-Fechner Law). Shooting S-Log3 captures 14+ stops of dynamic range without clipping highlights or crushing shadow detail.

## Node Tree Hierarchy:
1. **Node 1: Clean & Balance**: Exposure offset wheel and white balance tint.
2. **Node 2: Contrast & Pivot**: S-curve with custom pivot point (usually 0.435 for 18% middle gray).
3. **Node 3: Skin Tones Qualifier**: Isolate skin on Vectorscope (must align with the I-line regardless of ethnicity).
4. **Node 4: Color Separation**: Complementary warm highlights (3200K) vs cool shadows (5600K).
5. **Node 5: Film Print Emulation**: Kodak 2383 D60 film matrix for organic density and halation.`,
  },
  {
    id: 'note-3',
    title: 'Roland Barthes: Mythologies, Denotation & Connotation in Visual Media',
    courseId: 'course-ai',
    folder: 'Semiotics & Culture',
    tags: ['semiotics', 'barthes', 'theory'],
    isPinned: false,
    isFavorite: false,
    updatedAt: '2026-09-03',
    content: `# Semiotic Analysis Framework

## The Two Orders of Signification:
1. **Denotation (First Order)**: The literal, mechanical recording of the signifier. (e.g., A photograph of a street fruit stall).
2. **Connotation (Second Order)**: The cultural values, associations, and ideological baggage attached to the image (e.g., Authenticity, local resistance against globalization, artisanal nostalgia).
3. **Myth (Third Order)**: When culturally constructed connotations are made to appear "natural", inevitable, and universal.`,
  },
];

export const initialResources: Resource[] = [
  {
    id: 'res-1',
    title: 'UPF Audiovisual Lab & Edit Bay Booking Regulations 2026.pdf',
    type: 'pdf',
    url: 'https://example.com/upf-media-lab-handbook.pdf',
    courseId: 'course-algo',
    tag: 'Lab Protocol',
    isFavorite: true,
    size: '1.4 MB',
  },
  {
    id: 'res-2',
    title: 'DaVinci Resolve Studio 19 Advanced Colorist Manual',
    type: 'link',
    url: 'https://blackmagicdesign.com/davinci-resolve',
    courseId: 'course-algo',
    tag: 'Manual',
    isFavorite: true,
  },
  {
    id: 'res-3',
    title: 'Documentary Ethics: Statement of Subject Rights & Informed Consent',
    type: 'document',
    url: 'https://example.com/doc-ethics-charter.pdf',
    courseId: 'course-db',
    tag: 'Legal / Ethics',
    isFavorite: true,
    size: '850 KB',
  },
  {
    id: 'res-4',
    title: 'Stuart Hall — Culture, Media, Language (Classic Q1 Reader)',
    type: 'pdf',
    url: 'https://example.com/stuart-hall-reader.pdf',
    courseId: 'course-ai',
    tag: 'Theory Reader',
    isFavorite: false,
    size: '4.2 MB',
  },
  {
    id: 'res-5',
    title: 'Cinematic Soundscapes & Foley Library (Industrial WAV Pack)',
    type: 'document',
    url: 'https://freesound.org',
    courseId: 'course-se',
    tag: 'Audio Assets',
    isFavorite: false,
    size: '340 MB',
  },
];

export const initialFocusSessions: FocusSession[] = [
  {
    id: 'foc-1',
    courseId: 'course-algo',
    taskId: 'task-1',
    durationMinutes: 50,
    date: '2026-09-10',
    timestamp: Date.now() - 3600000 * 3,
    completed: true,
    notes: 'Color graded documentary interview sequence 2. Matched skin tones in DaVinci.',
  },
  {
    id: 'foc-2',
    courseId: 'course-ai',
    taskId: 'task-2',
    durationMinutes: 52,
    date: '2026-09-09',
    timestamp: Date.now() - 86400000,
    completed: true,
    notes: 'Annotated Stuart Hall chapter 3. Outlined oppositional decoding arguments.',
  },
  {
    id: 'foc-3',
    courseId: 'course-se',
    durationMinutes: 45,
    date: '2026-09-08',
    timestamp: Date.now() - 86400000 * 2,
    completed: true,
    notes: 'Foley sound mix and stereo spatial panning.',
  },
];

export const initialGoals: Goal[] = [
  {
    id: 'goal-1',
    title: 'Graduate with ≥ 8.8 / 10.0 Semester GPA (Honors)',
    description: 'Qualify for Department Outstanding Distinction and Master\'s Direct Directing Grant.',
    currentProgress: 8.52,
    targetProgress: 8.8,
    unit: 'GPA',
    deadline: '2026-12-22',
    category: 'academic',
    status: 'active',
  },
  {
    id: 'goal-2',
    title: 'Complete 15-Minute Film Festival Cut ("Echoes of Poblenou")',
    description: 'Fine cut lock, 5.1 surround sound mixdown, and official festival color grade.',
    currentProgress: 10,
    targetProgress: 15,
    unit: 'Minutes',
    deadline: '2026-11-20',
    category: 'study',
    status: 'active',
  },
  {
    id: 'goal-3',
    title: 'Accumulate 180 ECTS for Degree Graduation',
    description: 'Degree requirement for B.A. Audiovisual Media & Critical Studies.',
    currentProgress: 144,
    targetProgress: 180,
    unit: 'ECTS',
    deadline: '2027-06-30',
    category: 'university',
    status: 'active',
  },
];

export const initialHabits: Habit[] = [
  {
    id: 'habit-1',
    title: 'Daily 50-Min Cinema Edit or Writing Session',
    category: 'Studio Craft',
    streak: 14,
    targetDaysPerWeek: 6,
    completedDates: ['2026-09-07', '2026-09-08', '2026-09-09', '2026-09-10'],
    frequency: 'daily',
  },
  {
    id: 'habit-2',
    title: 'Log Audio Field Recordings or B-Roll Visuals',
    category: 'Production',
    streak: 9,
    targetDaysPerWeek: 5,
    completedDates: ['2026-09-08', '2026-09-09', '2026-09-10'],
    frequency: 'daily',
  },
  {
    id: 'habit-3',
    title: '100% Studio & Lecture Attendance',
    category: 'Attendance',
    streak: 18,
    targetDaysPerWeek: 5,
    completedDates: ['2026-09-08', '2026-09-09', '2026-09-10'],
    frequency: 'daily',
  },
  {
    id: 'habit-4',
    title: 'Read 1 Landmark Media Theory Text / Journal Paper',
    category: 'Theory',
    streak: 5,
    targetDaysPerWeek: 4,
    completedDates: ['2026-09-08', '2026-09-09'],
    frequency: 'daily',
  },
];

export const initialFlashcards: Flashcard[] = [
  {
    id: 'card-1',
    courseId: 'course-algo',
    front: 'What is the Kuleshov Effect in film editing psychology?',
    back: 'A cognitive phenomenon where viewers derive more meaning from the interaction of two sequential shots than from a single shot in isolation (e.g. Mozzhukhin\'s neutral face juxtaposed with soup, a child, or a coffin).',
    repetitions: 4,
    intervalDays: 5,
    lastReviewed: '2026-09-08',
  },
  {
    id: 'card-2',
    courseId: 'course-ai',
    front: 'What does Laura Mulvey define as "The Male Gaze" in her 1975 essay "Visual Pleasure and Narrative Cinema"?',
    back: 'The gaze of the camera, the male protagonist, and the spectator that objectifies female characters as passive erotic spectacles to be looked at, reinforcing patriarchal power structures.',
    repetitions: 5,
    intervalDays: 7,
    lastReviewed: '2026-09-09',
  },
  {
    id: 'card-3',
    courseId: 'course-algo',
    front: 'What is the difference between S-Log3 and Rec.709 color spaces?',
    back: 'S-Log3 is a wide-gamut logarithmic gamma curve retaining maximum sensor dynamic range (14+ stops). Rec.709 is a standardized broadcast display space with narrower gamut and standard contrast.',
    repetitions: 3,
    intervalDays: 3,
    lastReviewed: '2026-09-07',
  },
  {
    id: 'card-4',
    courseId: 'course-se',
    front: 'What is the distinction between Diegetic and Non-Diegetic sound?',
    back: 'Diegetic sound originates from within the fictional story world (characters can hear it). Non-diegetic sound exists outside the story space (mood soundtrack score, external narrator).',
    repetitions: 5,
    intervalDays: 6,
    lastReviewed: '2026-09-06',
  },
  {
    id: 'card-5',
    courseId: 'course-ai',
    front: 'According to Walter Benjamin, what happens to the "Aura" of a work of art in the age of mechanical reproduction?',
    back: 'The aura—its unique presence in time and space, tied to ritual and authenticity—withers when the artwork is infinitely reproduced (via print, photography, film), democratizing access but detaching it from tradition.',
    repetitions: 4,
    intervalDays: 6,
    lastReviewed: '2026-09-09',
  },
];

export const initialBrainDumpStickies: BrainDumpSticky[] = [
  {
    id: 'sticky-1',
    text: 'Clara: Bring external NVMe drive to Edit Bay 4B today! Lab computers wipe local storage every night at 23:00!! 🎬',
    color: 'yellow',
    rotation: -2,
    createdAt: '15 mins ago',
    tag: 'EDIT LAB',
    isPinned: true,
  },
  {
    id: 'sticky-2',
    text: 'Quote for Friday semiotics essay: "The medium is the message because it is the medium that shapes and controls the scale and form of human association." — McLuhan 1964',
    color: 'pink',
    rotation: 1.8,
    createdAt: '1 hr ago',
    tag: 'ESSAY QUOTE',
    isPinned: true,
  },
  {
    id: 'sticky-3',
    text: 'Camera gear cage closes at 16:30! Reserve the Sony FX3 + 35mm f/1.4 GM prime for Saturday harbor shoot!',
    color: 'cyan',
    rotation: -1.2,
    createdAt: 'Today',
    tag: 'GEAR RESERVATION',
    isPinned: true,
  },
  {
    id: 'sticky-4',
    text: 'Color grading fix: tungsten lights in scene 2 are reading too magenta. Drop green offset -0.03 on Node 2.',
    color: 'green',
    rotation: 2.2,
    createdAt: 'Yesterday',
    tag: 'DAVINCI NOTE',
    isPinned: false,
  },
  {
    id: 'sticky-5',
    text: 'Espresso #2 down. Exporting 4K ProRes 422 HQ proxy files in background while reading Stuart Hall.',
    color: 'purple',
    rotation: -2.5,
    createdAt: 'Yesterday',
    tag: 'STUDIO LIFE',
    isPinned: false,
  },
];
