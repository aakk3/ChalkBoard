import { SubjectConfig, SubjectId, ColleagueProfile, CanvasElement, StickyNoteItem } from '../types/whiteboard';

export const COLLEAGUES: ColleagueProfile[] = [
  {
    id: 'colleague-1',
    name: 'Mr. Henderson',
    role: 'Head of Science & Physics',
    initials: 'DH',
    avatarColor: 'bg-sky-500',
    activeSubject: 'physics',
  },
  {
    id: 'colleague-2',
    name: 'Ms. A. Patel',
    role: 'Lead Mathematics Teacher',
    initials: 'AP',
    avatarColor: 'bg-emerald-500',
    activeSubject: 'mathematics',
  },
  {
    id: 'colleague-3',
    name: 'Dr. E. Zhang',
    role: 'Senior Chemistry Faculty',
    initials: 'EZ',
    avatarColor: 'bg-violet-500',
    activeSubject: 'chemistry',
  },
  {
    id: 'colleague-4',
    name: 'Mrs. R. Sterling',
    role: 'IGCSE Biology Specialist',
    initials: 'RS',
    avatarColor: 'bg-teal-500',
    activeSubject: 'biology',
  },
  {
    id: 'colleague-5',
    name: 'Mr. J. Wright',
    role: 'English Lang & Lit Coordinator',
    initials: 'JW',
    avatarColor: 'bg-rose-500',
    activeSubject: 'english',
  },
];

export const IGCSE_SUBJECTS: Record<SubjectId, SubjectConfig> = {
  physics: {
    id: 'physics',
    name: 'Physics',
    icon: 'Atom',
    code: 'CIE 0625 / Edexcel 4PH1',
    level: 'IGCSE Year 10-11',
    color: 'text-sky-500',
    badgeBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30',
    accentHex: '#0ea5e9',
    description: 'Mechanics, Waves, Electricity, Thermal & Nuclear Physics',
    defaultGrid: 'grid',
    quickSymbols: ['λ', 'Ω', 'μ', 'Δ', 'θ', 'π', 'ρ', 'α', 'β', 'γ', 'm/s²', 'N·m', 'kW·h', '10⁻⁶'],
    formulae: [
      {
        category: 'Mechanics & Motion',
        items: [
          { name: 'Velocity', formula: 'v = Δs / Δt' },
          { name: 'Acceleration', formula: 'a = (v - u) / t' },
          { name: "Newton's 2nd Law", formula: 'F = m · a' },
          { name: 'Weight', formula: 'W = m · g  (g ≈ 9.8 m/s²)' },
          { name: 'Kinetic Energy', formula: 'Eₖ = ½ m v²' },
          { name: 'Gravitational Potential', formula: 'ΔEₚ = m · g · Δh' },
          { name: 'Density', formula: 'ρ = m / V' },
          { name: 'Pressure', formula: 'p = F / A = ρ g h' },
        ],
      },
      {
        category: 'Waves & Electricity',
        items: [
          { name: 'Wave Equation', formula: 'v = f · λ' },
          { name: "Snell's Law", formula: 'n = sin(i) / sin(r)' },
          { name: "Ohm's Law", formula: 'V = I · R' },
          { name: 'Electrical Power', formula: 'P = I · V = I² R = V² / R' },
          { name: 'Electrical Energy', formula: 'E = I · V · t' },
          { name: 'Resistors in Series', formula: 'R_total = R₁ + R₂ + ...' },
          { name: 'Resistors in Parallel', formula: '1/R_total = 1/R₁ + 1/R₂' },
        ],
      },
    ],
    templates: [
      {
        id: 'phys-axes',
        name: 'Velocity-Time Graph Axes',
        description: 'Standard coordinate axes with labels for kinematics analysis',
        category: 'Mechanics',
        apply: (ox, oy) => {
          const id = Date.now().toString();
          const elements: CanvasElement[] = [
            // Y-axis (Velocity)
            {
              id: `${id}-y`,
              type: 'arrow',
              points: [
                { x: ox + 60, y: oy + 260 },
                { x: ox + 60, y: oy + 40 },
              ],
              color: '#0ea5e9',
              strokeWidth: 3,
            },
            // X-axis (Time)
            {
              id: `${id}-x`,
              type: 'arrow',
              points: [
                { x: ox + 60, y: oy + 260 },
                { x: ox + 380, y: oy + 260 },
              ],
              color: '#0ea5e9',
              strokeWidth: 3,
            },
            // Label Y
            {
              id: `${id}-ly`,
              type: 'text',
              points: [{ x: ox + 20, y: oy + 20 }],
              text: 'Velocity v (m/s)',
              color: '#0ea5e9',
              fontSize: 16,
              strokeWidth: 1,
            },
            // Label X
            {
              id: `${id}-lx`,
              type: 'text',
              points: [{ x: ox + 320, y: oy + 280 }],
              text: 'Time t (s)',
              color: '#0ea5e9',
              fontSize: 16,
              strokeWidth: 1,
            },
            // Sample slope
            {
              id: `${id}-slope`,
              type: 'line',
              points: [
                { x: ox + 60, y: oy + 260 },
                { x: ox + 220, y: oy + 120 },
                { x: ox + 360, y: oy + 120 },
              ],
              color: '#f59e0b',
              strokeWidth: 3,
              strokeStyle: 'solid',
            },
          ];
          const stickyNotes: StickyNoteItem[] = [
            {
              id: `${id}-note`,
              x: ox + 410,
              y: oy + 50,
              width: 220,
              height: 170,
              title: 'v-t Graph Key Rules',
              content: '• Gradient = Acceleration (a = Δv/Δt)\n• Area under graph = Distance travelled (s)\n• Horizontal line = Constant velocity',
              color: 'blue',
              createdAt: Date.now(),
            },
          ];
          return { elements, stickyNotes };
        },
      },
      {
        id: 'phys-refraction',
        name: "Snell's Law / Refraction Boundary",
        description: 'Interface between two optical media with normal line and rays',
        category: 'Optics',
        apply: (ox, oy) => {
          const id = Date.now().toString();
          const elements: CanvasElement[] = [
            // Interface boundary
            {
              id: `${id}-boundary`,
              type: 'line',
              points: [
                { x: ox + 40, y: oy + 150 },
                { x: ox + 400, y: oy + 150 },
              ],
              color: '#38bdf8',
              strokeWidth: 3,
            },
            // Normal dashed line
            {
              id: `${id}-normal`,
              type: 'line',
              points: [
                { x: ox + 220, y: oy + 30 },
                { x: ox + 220, y: oy + 270 },
              ],
              color: '#94a3b8',
              strokeWidth: 2,
              strokeStyle: 'dashed',
            },
            // Incident ray
            {
              id: `${id}-inc`,
              type: 'arrow',
              points: [
                { x: ox + 110, y: oy + 50 },
                { x: ox + 220, y: oy + 150 },
              ],
              color: '#ef4444',
              strokeWidth: 3,
            },
            // Refracted ray
            {
              id: `${id}-ref`,
              type: 'arrow',
              points: [
                { x: ox + 220, y: oy + 150 },
                { x: ox + 290, y: oy + 260 },
              ],
              color: '#ef4444',
              strokeWidth: 3,
            },
            // Medium 1 label
            {
              id: `${id}-m1`,
              type: 'text',
              points: [{ x: ox + 60, y: oy + 70 }],
              text: 'Medium 1: Air (n₁ = 1.0)',
              color: '#64748b',
              fontSize: 15,
              strokeWidth: 1,
            },
            // Medium 2 label
            {
              id: `${id}-m2`,
              type: 'text',
              points: [{ x: ox + 60, y: oy + 180 }],
              text: 'Medium 2: Glass (n₂ = 1.5)',
              color: '#64748b',
              fontSize: 15,
              strokeWidth: 1,
            },
          ];
          return { elements, stickyNotes: [] };
        },
      },
    ],
  },
  mathematics: {
    id: 'mathematics',
    name: 'Mathematics',
    icon: 'Binary',
    code: 'CIE 0580 / Edexcel 4MA1',
    level: 'IGCSE Core & Extended',
    color: 'text-emerald-500',
    badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    accentHex: '#10b981',
    description: 'Algebra, Geometry, Trigonometry, Calculus & Probability',
    defaultGrid: 'grid',
    quickSymbols: ['π', 'θ', '√', '±', '≠', '≤', '≥', '∫', '²', '³', 'Δ', '∑', '∞', '≈'],
    formulae: [
      {
        category: 'Algebra & Functions',
        items: [
          { name: 'Quadratic Formula', formula: 'x = (-b ± √(b² - 4ac)) / (2a)' },
          { name: 'Slope (Gradient)', formula: 'm = (y₂ - y₁) / (x₂ - x₁)' },
          { name: 'Linear Equation', formula: 'y = mx + c' },
          { name: 'Discriminant', formula: 'Δ = b² - 4ac  (>0: 2 roots, =0: 1, <0: none)' },
        ],
      },
      {
        category: 'Trigonometry & Geometry',
        items: [
          { name: 'Pythagoras', formula: 'a² + b² = c²' },
          { name: 'SOH CAH TOA', formula: 'sin θ = O/H, cos θ = A/H, tan θ = O/A' },
          { name: 'Sine Rule', formula: 'a/sin(A) = b/sin(B) = c/sin(C)' },
          { name: 'Cosine Rule', formula: 'a² = b² + c² - 2bc · cos(A)' },
          { name: 'Triangle Area', formula: 'Area = ½ a b · sin(C)' },
          { name: 'Circle Circumference', formula: 'C = 2πr = πd' },
          { name: 'Circle Area', formula: 'A = πr²' },
          { name: 'Arc Length', formula: 's = (θ / 360°) × 2πr' },
        ],
      },
    ],
    templates: [
      {
        id: 'math-cartesian',
        name: 'Full 4-Quadrant Cartesian Plane',
        description: 'Centered X-Y axes with grid ticks ready for curve sketching',
        category: 'Functions & Graphs',
        apply: (ox, oy) => {
          const id = Date.now().toString();
          const cx = ox + 220;
          const cy = oy + 180;
          const elements: CanvasElement[] = [
            // X-axis
            {
              id: `${id}-x`,
              type: 'arrow',
              points: [
                { x: cx - 180, y: cy },
                { x: cx + 180, y: cy },
              ],
              color: '#10b981',
              strokeWidth: 2,
            },
            // Y-axis
            {
              id: `${id}-y`,
              type: 'arrow',
              points: [
                { x: cx, y: cy + 150 },
                { x: cx, y: cy - 150 },
              ],
              color: '#10b981',
              strokeWidth: 2,
            },
            // Axis labels
            {
              id: `${id}-xl`,
              type: 'text',
              points: [{ x: cx + 185, y: cy - 8 }],
              text: 'x',
              color: '#10b981',
              fontSize: 18,
              strokeWidth: 1,
            },
            {
              id: `${id}-yl`,
              type: 'text',
              points: [{ x: cx - 18, y: cy - 165 }],
              text: 'y',
              color: '#10b981',
              fontSize: 18,
              strokeWidth: 1,
            },
            {
              id: `${id}-origin`,
              type: 'text',
              points: [{ x: cx - 16, y: cy + 6 }],
              text: 'O',
              color: '#64748b',
              fontSize: 14,
              strokeWidth: 1,
            },
          ];
          return { elements, stickyNotes: [] };
        },
      },
      {
        id: 'math-right-triangle',
        name: 'Right-Angled Triangle with SOH CAH TOA',
        description: 'Standard right triangle with angle theta and hypotenuse',
        category: 'Trigonometry',
        apply: (ox, oy) => {
          const id = Date.now().toString();
          const elements: CanvasElement[] = [
            {
              id: `${id}-tri`,
              type: 'line',
              points: [
                { x: ox + 40, y: oy + 220 },
                { x: ox + 320, y: oy + 220 },
                { x: ox + 320, y: oy + 60 },
                { x: ox + 40, y: oy + 220 },
              ],
              color: '#10b981',
              strokeWidth: 3,
            },
            // Right angle symbol
            {
              id: `${id}-ra`,
              type: 'line',
              points: [
                { x: ox + 300, y: oy + 220 },
                { x: ox + 300, y: oy + 200 },
                { x: ox + 320, y: oy + 200 },
              ],
              color: '#10b981',
              strokeWidth: 2,
            },
            // Labels
            {
              id: `${id}-adj`,
              type: 'text',
              points: [{ x: ox + 150, y: oy + 230 }],
              text: 'Adjacent (a)',
              color: '#64748b',
              fontSize: 14,
              strokeWidth: 1,
            },
            {
              id: `${id}-opp`,
              type: 'text',
              points: [{ x: ox + 330, y: oy + 140 }],
              text: 'Opposite (o)',
              color: '#64748b',
              fontSize: 14,
              strokeWidth: 1,
            },
            {
              id: `${id}-hyp`,
              type: 'text',
              points: [{ x: ox + 130, y: oy + 120 }],
              text: 'Hypotenuse (h)',
              color: '#10b981',
              fontSize: 14,
              strokeWidth: 1,
            },
          ];
          return { elements, stickyNotes: [] };
        },
      },
    ],
  },
  chemistry: {
    id: 'chemistry',
    name: 'Chemistry',
    icon: 'FlaskConical',
    code: 'CIE 0620 / Edexcel 4CH1',
    level: 'IGCSE Chemistry',
    color: 'text-violet-500',
    badgeBg: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30',
    accentHex: '#8b5cf6',
    description: 'Stoichiometry, Chemical Reactions, Organic & Periodic Table',
    defaultGrid: 'dotted',
    quickSymbols: ['→', '⇌', 'ΔH', '(s)', '(l)', '(g)', '(aq)', '⁺', '⁻', '²⁺', '³⁻', '°C'],
    formulae: [
      {
        category: 'Mole Calculations',
        items: [
          { name: 'Moles (Solids)', formula: 'n = mass (g) / Mᵣ (g/mol)' },
          { name: 'Moles (Gases)', formula: 'n = Volume (dm³) / 24 dm³ (at r.t.p.)' },
          { name: 'Moles (Solutions)', formula: 'n = Concentration (mol/dm³) × Volume (dm³)' },
          { name: 'Percentage Yield', formula: '(Actual Yield / Theoretical Yield) × 100%' },
        ],
      },
      {
        category: 'Energetics & Rates',
        items: [
          { name: 'Bond Energy ΔH', formula: 'ΔH = Σ(Bonds Broken) - Σ(Bonds Formed)' },
          { name: 'Exothermic', formula: 'ΔH is Negative (< 0), Temperature Rises' },
          { name: 'Endothermic', formula: 'ΔH is Positive (> 0), Temperature Falls' },
        ],
      },
    ],
    templates: [
      {
        id: 'chem-beaker',
        name: 'Reaction Beaker & Solution Setup',
        description: 'Laboratory apparatus outline for titration, precipitate or displacement',
        category: 'Apparatus',
        apply: (ox, oy) => {
          const id = Date.now().toString();
          const elements: CanvasElement[] = [
            // Beaker body
            {
              id: `${id}-beaker`,
              type: 'line',
              points: [
                { x: ox + 80, y: oy + 60 },
                { x: ox + 80, y: oy + 240 },
                { x: ox + 260, y: oy + 240 },
                { x: ox + 260, y: oy + 60 },
              ],
              color: '#8b5cf6',
              strokeWidth: 3,
            },
            // Beaker liquid level
            {
              id: `${id}-liq`,
              type: 'line',
              points: [
                { x: ox + 85, y: oy + 150 },
                { x: ox + 255, y: oy + 150 },
              ],
              color: '#38bdf8',
              strokeWidth: 2,
              strokeStyle: 'dashed',
            },
            // Liquid fill rect
            {
              id: `${id}-fill`,
              type: 'rectangle',
              points: [
                { x: ox + 82, y: oy + 152 },
                { x: ox + 258, y: oy + 238 },
              ],
              color: 'transparent',
              fillColor: 'rgba(56, 189, 248, 0.15)',
              strokeWidth: 0,
            },
            // Stirring rod
            {
              id: `${id}-rod`,
              type: 'line',
              points: [
                { x: ox + 190, y: oy + 20 },
                { x: ox + 130, y: oy + 220 },
              ],
              color: '#94a3b8',
              strokeWidth: 3,
            },
          ];
          const stickyNotes: StickyNoteItem[] = [
            {
              id: `${id}-note`,
              x: ox + 290,
              y: oy + 60,
              width: 220,
              height: 160,
              title: 'CIE Gas Test Checklist',
              content: '• H₂: Lighted splint → Squeaky pop\n• O₂: Glowing splint → Relights\n• CO₂: Limewater → Milky/cloudy\n• Cl₂: Damp litmus → Bleaches white',
              color: 'purple',
              createdAt: Date.now(),
            },
          ];
          return { elements, stickyNotes };
        },
      },
    ],
  },
  biology: {
    id: 'biology',
    name: 'Biology',
    icon: 'Dna',
    code: 'CIE 0610 / Edexcel 4BI1',
    level: 'IGCSE Biology',
    color: 'text-teal-500',
    badgeBg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30',
    accentHex: '#14b8a6',
    description: 'Cell Biology, Genetics, Plant Nutrition, Ecology & Human Physiology',
    defaultGrid: 'blank',
    quickSymbols: ['♀', '♂', 'A', 'a', 'B', 'b', 'Iᴬ', 'Iᴮ', 'i', 'μm', 'CO₂', 'O₂', 'C₆H₁₂O₆'],
    formulae: [
      {
        category: 'Microscopy & Magnification',
        items: [
          { name: 'Magnification Formula', formula: 'Magnification = Image Size (I) / Actual Size (A)' },
          { name: 'Actual Size', formula: 'A = I / M  (Convert mm to μm: × 1000)' },
        ],
      },
      {
        category: 'Bioenergetics',
        items: [
          { name: 'Photosynthesis', formula: '6CO₂ + 6H₂O ⟶ C₆H₁₂O₆ + 6O₂' },
          { name: 'Aerobic Respiration', formula: 'C₆H₁₂O₆ + 6O₂ ⟶ 6CO₂ + 6H₂O + ATP' },
          { name: 'Anaerobic (Yeast)', formula: 'C₆H₁₂O₆ ⟶ 2C₂H₅OH + 2CO₂' },
          { name: 'Anaerobic (Muscles)', formula: 'Glucose ⟶ Lactic acid' },
        ],
      },
    ],
    templates: [
      {
        id: 'bio-punnett',
        name: 'Punnett Square 2x2 Grid',
        description: 'Genetic cross diagram for monohybrid inheritance (e.g. Bb x Bb)',
        category: 'Genetics',
        apply: (ox, oy) => {
          const id = Date.now().toString();
          const elements: CanvasElement[] = [
            // Outer 2x2 box
            {
              id: `${id}-box`,
              type: 'rectangle',
              points: [
                { x: ox + 100, y: oy + 60 },
                { x: ox + 340, y: oy + 300 },
              ],
              color: '#14b8a6',
              strokeWidth: 3,
            },
            // Horizontal divider
            {
              id: `${id}-hdiv`,
              type: 'line',
              points: [
                { x: ox + 100, y: oy + 180 },
                { x: ox + 340, y: oy + 180 },
              ],
              color: '#14b8a6',
              strokeWidth: 2,
            },
            // Vertical divider
            {
              id: `${id}-vdiv`,
              type: 'line',
              points: [
                { x: ox + 220, y: oy + 60 },
                { x: ox + 220, y: oy + 300 },
              ],
              color: '#14b8a6',
              strokeWidth: 2,
            },
            // Parent alleles
            {
              id: `${id}-p1a`,
              type: 'text',
              points: [{ x: ox + 150, y: oy + 25 }],
              text: 'B',
              color: '#14b8a6',
              fontSize: 22,
              strokeWidth: 1,
            },
            {
              id: `${id}-p1b`,
              type: 'text',
              points: [{ x: ox + 270, y: oy + 25 }],
              text: 'b',
              color: '#14b8a6',
              fontSize: 22,
              strokeWidth: 1,
            },
            {
              id: `${id}-p2a`,
              type: 'text',
              points: [{ x: ox + 65, y: oy + 110 }],
              text: 'B',
              color: '#14b8a6',
              fontSize: 22,
              strokeWidth: 1,
            },
            {
              id: `${id}-p2b`,
              type: 'text',
              points: [{ x: ox + 65, y: oy + 230 }],
              text: 'b',
              color: '#14b8a6',
              fontSize: 22,
              strokeWidth: 1,
            },
          ];
          const stickyNotes: StickyNoteItem[] = [
            {
              id: `${id}-note`,
              x: ox + 370,
              y: oy + 70,
              width: 220,
              height: 160,
              title: 'Phenotype Ratio Guide',
              content: '• Genotypes: 1 BB : 2 Bb : 1 bb\n• Phenotypes: 3 Dominant : 1 Recessive\n• Probability of heterozygous offspring = 50%',
              color: 'green',
              createdAt: Date.now(),
            },
          ];
          return { elements, stickyNotes };
        },
      },
    ],
  },
  english: {
    id: 'english',
    name: 'English',
    icon: 'BookOpen',
    code: 'CIE 0500 / Edexcel 4EA1',
    level: 'IGCSE First Language & Lit',
    color: 'text-rose-500',
    badgeBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
    accentHex: '#f43f5e',
    description: 'Text Analysis, Narrative Writing, PEEL Paragraphs & Rhetoric',
    defaultGrid: 'lined',
    quickSymbols: ['“', '”', '—', '…', '§', '¶', '→', '★', '⚡', '✓'],
    formulae: [
      {
        category: 'PEEL Structure',
        items: [
          { name: 'P - Point', formula: 'Make a clear, concise topic statement directly answering the question.' },
          { name: 'E - Evidence', formula: 'Embed short, precise quotation(s) from the text.' },
          { name: 'E - Explanation', formula: 'Analyze writer’s method, connotation, tone & effect on reader.' },
          { name: 'L - Link', formula: 'Connect back to the main question and broader thematic significance.' },
        ],
      },
      {
        category: 'Language Analysis Techniques',
        items: [
          { name: 'Metaphor / Simile', formula: 'Implicit comparison vs direct comparison using like/as' },
          { name: 'Pathetic Fallacy', formula: 'Nature/weather mirroring human emotions or tension' },
          { name: 'Sensory Imagery', formula: 'Visual, auditory, olfactory, tactile, gustatory details' },
          { name: 'Juxtaposition', formula: 'Contrasting ideas placed side-by-side to highlight differences' },
        ],
      },
    ],
    templates: [
      {
        id: 'eng-peel',
        name: 'PEEL Analytical Paragraph Frame',
        description: 'Structured column framework for composing grade-9 literary responses',
        category: 'Essay Structure',
        apply: (ox, oy) => {
          const id = Date.now().toString();
          const stickyNotes: StickyNoteItem[] = [
            {
              id: `${id}-p`,
              x: ox + 40,
              y: oy + 40,
              width: 170,
              height: 200,
              title: 'Point (P)',
              content: 'What claim or observation are you asserting about the text?',
              color: 'amber',
              createdAt: Date.now(),
            },
            {
              id: `${id}-e1`,
              x: ox + 230,
              y: oy + 40,
              width: 170,
              height: 200,
              title: 'Evidence (E)',
              content: 'Insert key quotations:\n"..."\nSelect individual powerful words.',
              color: 'yellow',
              createdAt: Date.now(),
            },
            {
              id: `${id}-e2`,
              x: ox + 420,
              y: oy + 40,
              width: 180,
              height: 200,
              title: 'Explanation (E)',
              content: '• Connotations?\n• Techniques used?\n• Reader psychological response?',
              color: 'pink',
              createdAt: Date.now(),
            },
            {
              id: `${id}-l`,
              x: ox + 620,
              y: oy + 40,
              width: 170,
              height: 200,
              title: 'Link (L)',
              content: 'Tie back to the overall authorial purpose or exam prompt.',
              color: 'purple',
              createdAt: Date.now(),
            },
          ];
          return { elements: [], stickyNotes };
        },
      },
    ],
  },
};

export const COLOR_PALETTE = [
  { name: 'White / Dark', light: '#0f172a', dark: '#f8fafc' },
  { name: 'Cambridge Navy', light: '#1e3a8a', dark: '#60a5fa' },
  { name: 'Electric Cyan', light: '#0284c7', dark: '#38bdf8' },
  { name: 'Emerald Green', light: '#059669', dark: '#34d399' },
  { name: 'Crimson Red', light: '#dc2626', dark: '#f87171' },
  { name: 'Amber Gold', light: '#d97706', dark: '#fbbf24' },
  { name: 'Amethyst Purple', light: '#7c3aed', dark: '#a78bfa' },
  { name: 'Hot Pink', light: '#db2777', dark: '#f472b6' },
  { name: 'Slate Gray', light: '#475569', dark: '#94a3b8' },
];

export const STICKY_COLORS = [
  { id: 'yellow', bg: 'bg-amber-100 dark:bg-amber-950/80', border: 'border-amber-300 dark:border-amber-700', text: 'text-amber-950 dark:text-amber-100', dot: '#f59e0b' },
  { id: 'pink', bg: 'bg-pink-100 dark:bg-pink-950/80', border: 'border-pink-300 dark:border-pink-700', text: 'text-pink-950 dark:text-pink-100', dot: '#ec4899' },
  { id: 'green', bg: 'bg-emerald-100 dark:bg-emerald-950/80', border: 'border-emerald-300 dark:border-emerald-700', text: 'text-emerald-950 dark:text-emerald-100', dot: '#10b981' },
  { id: 'blue', bg: 'bg-sky-100 dark:bg-sky-950/80', border: 'border-sky-300 dark:border-sky-700', text: 'text-sky-950 dark:text-sky-100', dot: '#0ea5e9' },
  { id: 'purple', bg: 'bg-purple-100 dark:bg-purple-950/80', border: 'border-purple-300 dark:border-purple-700', text: 'text-purple-950 dark:text-purple-100', dot: '#8b5cf6' },
  { id: 'amber', bg: 'bg-orange-100 dark:bg-orange-950/80', border: 'border-orange-300 dark:border-orange-700', text: 'text-orange-950 dark:text-orange-100', dot: '#f97316' },
];
