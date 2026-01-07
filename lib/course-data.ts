// Course detailed information for Digital Renaissance Music Institute

export const ROOMS = [
  { name: 'Production Class', code: 'G20' },
  { name: 'Rehearsal Room', code: 'G19' },
  { name: 'Office', code: 'G18' },
  { name: 'Recording Studio', code: 'G11/G12' },
  { name: 'Multipurpose', code: 'G41' },
]

export const TEACHERS = [
  { name: 'Samir Lajmi', courses: ['Ableton Live', 'DJ'] },
  { name: 'Tayeb Santo', courses: ['Songwriting', 'Portfolio Project'] },
  { name: 'Alhadi Gebreel', courses: ['Music Theory & Ear Training', 'Composition & Arrangement'] },
  { name: 'Alber M. Carter', courses: ['Music Industry 101', 'Management 101'] },
  { name: 'Tiece Edwards', courses: ['Marketing 101', 'A&R', 'Portfolio Project'] },
]

export interface CourseModule {
  name: string
  description: string
}

export interface CourseDetails {
  category: 'certificate' | 'short' | 'module'
  duration: string
  hours: number
  fee: string
  format: string
  goal: string
  modules: CourseModule[]
  outcome?: string
  teacher?: string
}

export const COURSE_DETAILS: Record<string, CourseDetails> = {
  // Certificate Programs (6 Months)
  'Certificate: Audio Engineering': {
    category: 'certificate',
    duration: '6 months',
    hours: 180,
    fee: 'AED 20,000 (VAT excluded)',
    format: 'In-person, 6 times a week',
    goal: 'Master the complete workflow of professional audio production, from signal theory to studio mixing and mastering.',
    modules: [
      { name: 'Audio Technologies', description: 'Physics of sound, perception, tonal systems, audio signals, transducers, and gear routing.' },
      { name: 'Pro Tools', description: 'Interface mastery, recording audio/MIDI, editing essentials, playlist management, and mixing concepts.' },
      { name: 'Live Sound Engineering', description: 'Signal flow, FOH mixing, monitor systems (wedges/IEMs), and show automation.' },
      { name: 'Studio Recording', description: 'Multitrack recording, microphone placement (stereo/drum), and session management.' },
      { name: 'Mixing & Mastering Skills', description: 'Balancing, EQ, compression, spatial processing, and finalizing tracks for release.' },
      { name: 'Portfolio Project', description: 'Creation of a professional-quality project highlighting recording, editing, mixing, and mastering skills.' },
    ],
  },
  'Certificate: Music Production & DJ': {
    category: 'certificate',
    duration: '6 months',
    hours: 180,
    fee: 'AED 20,000 (VAT excluded)',
    format: 'In-person, 6 times a week',
    goal: 'Train students in professional music production using Ableton Live and live DJ performance.',
    teacher: 'Samir Lajmi',
    modules: [
      { name: 'Music Theory & Ear Training', description: 'Intervals, tonality, chord progressions, and rhythm fundamentals.' },
      { name: 'Ableton Live (DAW)', description: 'MIDI/Audio handling, sound design (Wavetable/Samplers), arrangement, and live performance tools.' },
      { name: 'DJ Skills', description: 'Setup, beatmatching, EQ/filtering, mix programming, and using Rekordbox.' },
      { name: 'Composition & Arrangement', description: 'Song structure, melody writing, layering, and genre adaptation.' },
      { name: 'Mixing & Mastering', description: 'Session prep, dynamics, creative FX, and finalizing tracks for delivery.' },
      { name: 'Portfolio Project', description: 'Production of an EP or DJ set with promotional assets and a final showcase.' },
    ],
  },
  'Certificate: Singing-Songwriting': {
    category: 'certificate',
    duration: '6 months',
    hours: 180,
    fee: 'AED 20,000 (VAT excluded)',
    format: 'In-person, 6 times a week',
    goal: 'Bridge songwriting, vocal performance, and music production to help artists develop their creative identity.',
    teacher: 'Tayeb Santo',
    modules: [
      { name: 'Music Theory & Ear Training', description: 'Practical theory applied to production and songwriting.' },
      { name: 'Ableton Live', description: 'Self-production skills, recording, and beat-making.' },
      { name: 'Vocal', description: 'Anatomy, diction, intonation, stylistic performance, and ensemble singing.' },
      { name: 'Composition & Arrangement', description: 'Structuring musical ideas, layering, and orchestration.' },
      { name: 'Songwriting', description: 'Lyrics, prosody, storytelling, rhyme schemes, and rhythm/line length.' },
      { name: 'Portfolio Project', description: 'Writing, recording, producing, and performing original material.' },
    ],
  },
  'Certificate: Music Performance': {
    category: 'certificate',
    duration: '6 months',
    hours: 180,
    fee: 'AED 20,000 (VAT excluded)',
    format: 'In-person, 6 times a week',
    goal: 'Train independent musicians to compose, produce, and perform original music in professional settings.',
    modules: [
      { name: 'Music Theory & Ear Training', description: 'Foundations of harmony, melody, and rhythm.' },
      { name: 'Ableton Live', description: 'DAW fluency for backing tracks, recording, and live set preparation.' },
      { name: 'Instrumental Performance I', description: 'Choice of Piano, Guitar, Bass, or Drums.' },
      { name: 'Composition & Arrangement', description: 'Generating musical ideas and developing them into full arrangements.' },
      { name: 'Instrumental Performance II', description: 'Advanced techniques on the chosen instrument.' },
      { name: 'Portfolio Project', description: 'Creation of a rehearsed live show and accompanying music portfolio.' },
    ],
  },
  'Certificate: Music Industry': {
    category: 'certificate',
    duration: '6 months',
    hours: 180,
    fee: 'AED 20,000 (VAT excluded)',
    format: 'In-person, 6 times a week',
    goal: 'Provide an in-depth understanding of business, management, marketing, and legal frameworks in the music world.',
    teacher: 'Alber M. Carter',
    modules: [
      { name: 'Management 101', description: 'Organizational logic, team roles, business plans, and project management.' },
      { name: 'Marketing 101', description: 'Brand strategy, social media, PR, DSP marketing, and campaign design.' },
      { name: 'Music Industry 101', description: 'Rights, royalties, contracts, distribution, and sync licensing.' },
      { name: 'A&R', description: 'Talent discovery, artist identity, content creation, and analytics.' },
      { name: 'Music Events & Venues', description: 'Live industry structure, budgeting, booking, logistics, and technical production.' },
      { name: 'Portfolio Project', description: 'Development of a strategic business project or artist campaign pitch.' },
    ],
  },

  // Short Courses (3 Months)
  'Shorts: Ableton Live': {
    category: 'short',
    duration: '3 months (Normal) / 1 month (Fast Track)',
    hours: 36,
    fee: 'AED 4,000 (VAT excluded)',
    format: 'In-person group classes',
    goal: 'From basics to your first track.',
    teacher: 'Samir Lajmi',
    modules: [
      { name: 'Interface Navigation', description: 'Getting started with Ableton Live workspace and tools.' },
      { name: 'Audio/MIDI Techniques', description: 'Recording, warping, and editing audio and MIDI.' },
      { name: 'Effects & Automation', description: 'Using effects, creating automation, and dynamic changes.' },
      { name: 'Sound Design', description: 'Wavetable and Samplers for creating unique sounds.' },
      { name: 'Arrangement', description: 'Building full tracks from ideas.' },
      { name: 'Session View', description: 'Live performance and jamming techniques.' },
    ],
    outcome: 'Completion of a fully original track.',
  },
  'Shorts: DJ': {
    category: 'short',
    duration: '3 months (Normal) / 1 month (Fast Track)',
    hours: 36,
    fee: 'AED 4,000 (VAT excluded)',
    format: 'In-person group classes',
    goal: 'Performing live sets and crafting musical journeys.',
    teacher: 'Samir Lajmi',
    modules: [
      { name: 'Setup & Signal Flow', description: 'Equipment setup and understanding signal routing.' },
      { name: 'Rekordbox Prep', description: 'Library management and track preparation.' },
      { name: 'Beatmatching', description: 'Beatmatching by ear and using visual aids.' },
      { name: 'EQ & Filtering', description: 'Using EQ and filters for smooth transitions.' },
      { name: 'Looping & FX', description: 'Creative use of loops and effects.' },
      { name: 'Back-to-Back Mixing', description: 'Collaborative DJ techniques.' },
    ],
    outcome: 'Recording and performing a professional 20-30 minute DJ mix.',
  },
  'Shorts: Bass': {
    category: 'short',
    duration: '3 months (Normal) / 1 month (Fast Track)',
    hours: 36,
    fee: 'AED 4,000 (VAT excluded)',
    format: 'In-person group classes',
    goal: 'Build groove, rhythm, and musicality.',
    modules: [
      { name: 'Technique', description: 'Right/left-hand technique, plucking and fretting.' },
      { name: 'Root Notes & Reading', description: 'Understanding root notes and reading notation.' },
      { name: 'Scales', description: 'Major, Minor, and Pentatonic scales.' },
      { name: 'Rhythmic Variations', description: 'Developing rhythmic feel and groove.' },
      { name: 'Playing Styles', description: 'Rock, Pop, Funk, and Blues techniques.' },
      { name: 'Improvisation', description: 'Creative bass playing and jamming.' },
    ],
    outcome: 'Performance of a bassline and participation in a group jam.',
  },
  'Shorts: Drums': {
    category: 'short',
    duration: '3 months (Normal) / 1 month (Fast Track)',
    hours: 36,
    fee: 'AED 4,000 (VAT excluded)',
    format: 'In-person group classes',
    goal: 'Develop rhythm, timing, and performance skills.',
    modules: [
      { name: 'Grip & Control', description: 'Proper stick grip and drum control.' },
      { name: 'Rhythm & Timing', description: 'Developing solid time-keeping skills.' },
      { name: 'Rudiments', description: 'Essential drum rudiments and patterns.' },
      { name: 'Fills', description: 'Creative drum fills and transitions.' },
      { name: 'Performance Styles', description: 'Rock, Pop, Jazz, and Latin styles.' },
      { name: 'Groove Development', description: 'Building pocket and feel.' },
    ],
    outcome: 'Performance in a group setting.',
  },
  'Shorts: Guitar': {
    category: 'short',
    duration: '3 months (Normal) / 1 month (Fast Track)',
    hours: 36,
    fee: 'AED 4,000 (VAT excluded)',
    format: 'In-person group classes',
    goal: 'Master guitar techniques across multiple genres.',
    modules: [
      { name: 'Fretting & Picking', description: 'Proper technique for both hands.' },
      { name: 'Chords', description: 'Open and barre chords.' },
      { name: 'Scales', description: 'Major, Minor, and Pentatonic scales.' },
      { name: 'Rhythm Guitar', description: 'Strumming patterns and accompaniment.' },
      { name: 'Blues Techniques', description: 'Blues-specific techniques and feel.' },
      { name: 'Lead Playing', description: 'Soloing and improvisation basics.' },
    ],
    outcome: 'Performance of rhythm and lead guitar parts.',
  },
  'Shorts: Piano': {
    category: 'short',
    duration: '3 months (Normal) / 1 month (Fast Track)',
    hours: 36,
    fee: 'AED 4,000 (VAT excluded)',
    format: 'In-person group classes',
    goal: 'Learn piano fundamentals from beginner to intermediate level.',
    modules: [
      { name: 'Hand Technique', description: 'Proper hand position and finger technique.' },
      { name: 'Reading Notation', description: 'Music reading and sight-reading basics.' },
      { name: 'Chords & Harmony', description: 'Building and playing chord progressions.' },
      { name: 'Accompaniment', description: 'Playing with other musicians.' },
      { name: 'Improvisation', description: 'Creative piano playing and soloing.' },
      { name: 'Repertoire', description: 'Learning essential piano pieces.' },
    ],
    outcome: 'Performance of piano repertoire and accompaniment.',
  },
  'Shorts: Vocal': {
    category: 'short',
    duration: '3 months (Normal) / 1 month (Fast Track)',
    hours: 36,
    fee: 'AED 4,000 (VAT excluded)',
    format: 'In-person group classes',
    goal: 'Develop vocal technique, tone, and performance skills.',
    modules: [
      { name: 'Anatomy & Breathing', description: 'Understanding the voice and breath control.' },
      { name: 'Diction', description: 'Clear articulation and pronunciation.' },
      { name: 'Intonation', description: 'Pitch accuracy and ear training.' },
      { name: 'Melisma', description: 'Vocal runs and ornamentation.' },
      { name: 'Styling', description: 'Genre-specific vocal techniques.' },
      { name: 'Performance', description: 'Stage presence and microphone technique.' },
    ],
    outcome: 'Solo vocal performance.',
  },
  'Shorts: Songwriting': {
    category: 'short',
    duration: '3 months (Normal) / 1 month (Fast Track)',
    hours: 36,
    fee: 'AED 4,000 (VAT excluded)',
    format: 'In-person group classes',
    goal: 'Craft compelling songs with melody, lyrics, and structure.',
    teacher: 'Tayeb Santo',
    modules: [
      { name: 'Lyric Writing', description: 'Crafting meaningful and memorable lyrics.' },
      { name: 'Prosody', description: 'Matching lyrics to melody effectively.' },
      { name: 'Storytelling', description: 'Narrative techniques in songwriting.' },
      { name: 'Rhyme Schemes', description: 'Using rhyme creatively.' },
      { name: 'Song Form', description: 'Verse, chorus, bridge structures.' },
      { name: 'Co-Writing', description: 'Collaborative songwriting techniques.' },
    ],
    outcome: 'Completion of original songs.',
  },
  'Shorts: Pro Tools': {
    category: 'short',
    duration: '3 months (Normal) / 1 month (Fast Track)',
    hours: 36,
    fee: 'AED 4,000 (VAT excluded)',
    format: 'In-person group classes',
    goal: 'Professional audio recording and editing with Pro Tools.',
    modules: [
      { name: 'Interface', description: 'Pro Tools workspace and navigation.' },
      { name: 'Recording', description: 'Audio and MIDI recording workflows.' },
      { name: 'Editing', description: 'Audio editing and playlist management.' },
      { name: 'Mixing', description: 'Basic mixing concepts and techniques.' },
      { name: 'Plugins', description: 'Using effects and virtual instruments.' },
      { name: 'Delivery', description: 'Exporting and delivery formats.' },
    ],
    outcome: 'Completion of a mixed session.',
  },

  // Basic Skills (longer short courses)
  'Basic Skills: Music Production & DJ': {
    category: 'short',
    duration: '3 months',
    hours: 60,
    fee: 'AED 6,000 (VAT excluded)',
    format: 'In-person group classes',
    goal: 'Comprehensive introduction to music production and DJing techniques.',
    teacher: 'Samir Lajmi',
    modules: [
      { name: 'Ableton Live Basics', description: 'Interface, recording, and arrangement.' },
      { name: 'DJ Fundamentals', description: 'Setup, beatmatching, and mixing.' },
      { name: 'Sound Design Intro', description: 'Creating sounds with synthesizers.' },
      { name: 'Music Theory Basics', description: 'Rhythm, melody, and harmony.' },
    ],
    outcome: 'Original track and DJ mix.',
  },
  'Basic Skills: Singing-Songwriting': {
    category: 'short',
    duration: '3 months',
    hours: 60,
    fee: 'AED 6,000 (VAT excluded)',
    format: 'In-person group classes',
    goal: 'Combine vocal performance with songwriting to create original music.',
    teacher: 'Tayeb Santo',
    modules: [
      { name: 'Vocal Technique', description: 'Breathing, tone, and projection.' },
      { name: 'Songwriting Basics', description: 'Lyrics, melody, and structure.' },
      { name: 'Basic Production', description: 'Recording and arranging your songs.' },
      { name: 'Performance', description: 'Stage presence and delivery.' },
    ],
    outcome: 'Original song performance.',
  },
  'Basic Skills: Music Performance': {
    category: 'short',
    duration: '3 months',
    hours: 60,
    fee: 'AED 6,000 (VAT excluded)',
    format: 'In-person group classes',
    goal: 'Develop stage presence and performance skills across instruments.',
    modules: [
      { name: 'Instrumental Basics', description: 'Technique on your chosen instrument.' },
      { name: 'Music Theory', description: 'Understanding harmony and rhythm.' },
      { name: 'Ensemble Playing', description: 'Playing with other musicians.' },
      { name: 'Performance Skills', description: 'Stage presence and confidence.' },
    ],
    outcome: 'Group performance.',
  },
  'Basic Skills: Audio Engineering': {
    category: 'short',
    duration: '3 months',
    hours: 60,
    fee: 'AED 6,000 (VAT excluded)',
    format: 'In-person group classes',
    goal: 'Learn the fundamentals of recording, mixing, and mastering.',
    modules: [
      { name: 'Audio Fundamentals', description: 'Physics of sound and signal flow.' },
      { name: 'Recording Basics', description: 'Microphone techniques and setup.' },
      { name: 'Mixing Introduction', description: 'Balance, EQ, and compression.' },
      { name: 'DAW Skills', description: 'Pro Tools or Ableton basics.' },
    ],
    outcome: 'Mixed recording project.',
  },
  'Basic Skills: Music Industry': {
    category: 'short',
    duration: '3 months',
    hours: 60,
    fee: 'AED 6,000 (VAT excluded)',
    format: 'In-person group classes',
    goal: 'Understand the business side of music, from contracts to distribution.',
    teacher: 'Alber M. Carter',
    modules: [
      { name: 'Industry Overview', description: 'How the music business works.' },
      { name: 'Rights & Royalties', description: 'Understanding music rights.' },
      { name: 'Marketing Basics', description: 'Promoting music effectively.' },
      { name: 'Career Planning', description: 'Building your music career.' },
    ],
    outcome: 'Career development plan.',
  },

  // Individual modules
  'Music Theory & Ear Training': {
    category: 'module',
    duration: '3 months',
    hours: 36,
    fee: 'AED 4,000 (VAT excluded)',
    format: 'In-person group classes',
    goal: 'Develop your musical ear and understanding of music theory.',
    teacher: 'Alhadi Gebreel',
    modules: [
      { name: 'Intervals', description: 'Recognizing and singing intervals.' },
      { name: 'Scales & Modes', description: 'Major, minor, and modal scales.' },
      { name: 'Chord Theory', description: 'Building and recognizing chords.' },
      { name: 'Rhythm', description: 'Time signatures and rhythmic patterns.' },
      { name: 'Ear Training', description: 'Melodic and harmonic dictation.' },
      { name: 'Sight Singing', description: 'Reading and singing music.' },
    ],
  },
  'Composition & Arrangement': {
    category: 'module',
    duration: '3 months',
    hours: 36,
    fee: 'AED 4,000 (VAT excluded)',
    format: 'In-person group classes',
    goal: 'Create original compositions and arrangements.',
    teacher: 'Alhadi Gebreel',
    modules: [
      { name: 'Musical Form', description: 'Song structures and forms.' },
      { name: 'Melody Writing', description: 'Crafting memorable melodies.' },
      { name: 'Harmony', description: 'Chord progressions and voicings.' },
      { name: 'Groove & Rhythm', description: 'Creating rhythmic interest.' },
      { name: 'Layering', description: 'Building arrangements with layers.' },
      { name: 'Genre Techniques', description: 'Genre-specific arrangement styles.' },
    ],
    outcome: 'Original composition with full arrangement.',
  },
  'Mixing & Mastering': {
    category: 'module',
    duration: '3 months',
    hours: 36,
    fee: 'AED 4,000 (VAT excluded)',
    format: 'In-person group classes',
    goal: 'Advanced mixing and mastering for professional releases.',
    modules: [
      { name: 'Session Prep', description: 'Organizing and preparing sessions.' },
      { name: 'Balance & Panning', description: 'Creating space in the mix.' },
      { name: 'EQ', description: 'Shaping tone and frequency balance.' },
      { name: 'Compression', description: 'Dynamics control and punch.' },
      { name: 'Spatial Processing', description: 'Reverb, delay, and width.' },
      { name: 'Mastering', description: 'Finalizing tracks for release.' },
    ],
    outcome: 'Professionally mixed and mastered track.',
  },
  'Live Sound Engineering': {
    category: 'module',
    duration: '3 months',
    hours: 36,
    fee: 'AED 4,000 (VAT excluded)',
    format: 'In-person group classes',
    goal: 'Master live sound reinforcement and engineering.',
    modules: [
      { name: 'Signal Flow', description: 'Understanding live sound systems.' },
      { name: 'FOH Mixing', description: 'Front of house mixing techniques.' },
      { name: 'Monitor Systems', description: 'Wedges and in-ear monitors.' },
      { name: 'Stage Setup', description: 'Stage plots and input lists.' },
      { name: 'Troubleshooting', description: 'Common issues and solutions.' },
      { name: 'Show Production', description: 'Running a live show.' },
    ],
  },
  'Studio Recording': {
    category: 'module',
    duration: '3 months',
    hours: 36,
    fee: 'AED 4,000 (VAT excluded)',
    format: 'In-person group classes',
    goal: 'Professional studio recording techniques and workflows.',
    modules: [
      { name: 'Microphone Techniques', description: 'Mic types and placement.' },
      { name: 'Multitrack Recording', description: 'Recording multiple sources.' },
      { name: 'Session Management', description: 'Organizing recording sessions.' },
      { name: 'Drum Recording', description: 'Capturing drums professionally.' },
      { name: 'Vocal Recording', description: 'Getting great vocal takes.' },
      { name: 'Post-Production', description: 'Editing and preparation for mix.' },
    ],
  },
  'Audio Technologies': {
    category: 'module',
    duration: '3 months',
    hours: 36,
    fee: 'AED 4,000 (VAT excluded)',
    format: 'In-person group classes',
    goal: 'Explore cutting-edge audio technology and digital tools.',
    modules: [
      { name: 'Physics of Sound', description: 'How sound works.' },
      { name: 'Human Perception', description: 'How we hear and perceive sound.' },
      { name: 'Audio Signals', description: 'Analog and digital signals.' },
      { name: 'Transducers', description: 'Microphones and speakers.' },
      { name: 'Gear Routing', description: 'Connecting audio equipment.' },
      { name: 'Acoustics', description: 'Room acoustics and treatment.' },
    ],
  },
  'Music Events & Venues Management': {
    category: 'module',
    duration: '3 months',
    hours: 36,
    fee: 'AED 4,000 (VAT excluded)',
    format: 'In-person group classes',
    goal: 'Learn to manage music events and venue operations.',
    modules: [
      { name: 'Event Planning', description: 'Planning and organizing events.' },
      { name: 'Budgeting', description: 'Financial management for events.' },
      { name: 'Booking', description: 'Artist booking and negotiations.' },
      { name: 'Logistics', description: 'Venue logistics and operations.' },
      { name: 'Technical Riders', description: 'Understanding technical requirements.' },
      { name: 'Safety & Compliance', description: 'Event safety and regulations.' },
    ],
  },
  'Management 101': {
    category: 'module',
    duration: '3 months',
    hours: 36,
    fee: 'AED 4,000 (VAT excluded)',
    format: 'In-person group classes',
    goal: 'Essential management skills for music professionals.',
    teacher: 'Alber M. Carter',
    modules: [
      { name: 'Business Plans', description: 'Creating effective business plans.' },
      { name: 'Team Roles', description: 'Understanding team structure.' },
      { name: 'Budgeting', description: 'Financial planning and management.' },
      { name: 'Operations', description: 'Day-to-day business operations.' },
      { name: 'Project Management', description: 'Managing music projects.' },
      { name: 'Legal Basics', description: 'Contracts and agreements.' },
    ],
  },
  'Marketing 101': {
    category: 'module',
    duration: '3 months',
    hours: 36,
    fee: 'AED 4,000 (VAT excluded)',
    format: 'In-person group classes',
    goal: 'Music marketing strategies for the digital age.',
    teacher: 'Tiece Edwards',
    modules: [
      { name: 'Brand Strategy', description: 'Building your artist brand.' },
      { name: 'Social Media', description: 'Effective social media marketing.' },
      { name: 'PR', description: 'Public relations for musicians.' },
      { name: 'DSP Marketing', description: 'Spotify, Apple Music, etc.' },
      { name: 'Campaign Design', description: 'Planning marketing campaigns.' },
      { name: 'Analytics', description: 'Measuring marketing success.' },
    ],
  },
  'Music Industry 101': {
    category: 'module',
    duration: '3 months',
    hours: 36,
    fee: 'AED 4,000 (VAT excluded)',
    format: 'In-person group classes',
    goal: 'Introduction to the music business ecosystem.',
    teacher: 'Alber M. Carter',
    modules: [
      { name: 'Industry Structure', description: 'How the music industry works.' },
      { name: 'Rights & Royalties', description: 'Understanding music rights.' },
      { name: 'Contracts', description: 'Common music contracts.' },
      { name: 'Distribution', description: 'Getting music to listeners.' },
      { name: 'Sync Licensing', description: 'Music in film, TV, and ads.' },
      { name: 'Revenue Streams', description: 'How artists make money.' },
    ],
  },
  'A&R': {
    category: 'module',
    duration: '3 months',
    hours: 36,
    fee: 'AED 4,000 (VAT excluded)',
    format: 'In-person group classes',
    goal: 'Artist & Repertoire: talent scouting and artist development.',
    teacher: 'Tiece Edwards',
    modules: [
      { name: 'Talent Scouting', description: 'Finding and evaluating talent.' },
      { name: 'Artist Identity', description: 'Developing artist branding.' },
      { name: 'Content Strategy', description: 'Planning content releases.' },
      { name: 'Creative Teams', description: 'Building creative teams.' },
      { name: 'Analytics', description: 'Using data for A&R decisions.' },
      { name: 'Pitch Decks', description: 'Presenting artists to labels.' },
    ],
  },
}

// Helper function to find course details by title (fuzzy match)
export function getCourseDetails(title: string): CourseDetails | null {
  // Direct match
  if (COURSE_DETAILS[title]) {
    return COURSE_DETAILS[title]
  }

  // Try matching without prefix
  const normalizedTitle = title.replace(/^(Shorts:|Certificate:|Basic Skills:)\s*/i, '').trim()

  for (const [key, value] of Object.entries(COURSE_DETAILS)) {
    const normalizedKey = key.replace(/^(Shorts:|Certificate:|Basic Skills:)\s*/i, '').trim()
    if (normalizedKey.toLowerCase() === normalizedTitle.toLowerCase()) {
      return value
    }
  }

  // Partial match
  for (const [key, value] of Object.entries(COURSE_DETAILS)) {
    if (key.toLowerCase().includes(normalizedTitle.toLowerCase()) ||
        normalizedTitle.toLowerCase().includes(key.replace(/^(Shorts:|Certificate:|Basic Skills:)\s*/i, '').toLowerCase())) {
      return value
    }
  }

  return null
}

// Get teacher for a course
export function getCourseTeacher(courseTitle: string): string | null {
  const details = getCourseDetails(courseTitle)
  if (details?.teacher) {
    return details.teacher
  }

  // Check teachers list
  for (const teacher of TEACHERS) {
    for (const course of teacher.courses) {
      if (courseTitle.toLowerCase().includes(course.toLowerCase())) {
        return teacher.name
      }
    }
  }

  return null
}
