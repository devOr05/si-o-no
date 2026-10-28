import type { LawBill, NewsArticle, CommunityPoll } from '../types';

export const INITIAL_BILLS: LawBill[] = [
  {
    id: 'bill-1',
    title: 'Proyecto de Ley "Ficha Limpia" para Cargos Públicos Electivos',
    expediente: 'Exp. 0045-D-2024 / HCDN',
    chamber: 'Diputados',
    status: 'Convocado a Sesión',
    date: 'En temario para próxima sesión',
    tags: ['Transparencia', 'Anticorrupción', 'Código Electoral'],
    summary: {
      whatChanges: 'Inhabilita a competir en elecciones nacionales a cualquier ciudadano que posea condena penal confirmada en segunda instancia por delitos de corrupción (cohecho, malversación de fondos públicos, enriquecimiento ilícito) hasta su revocación o cumplimiento de pena.',
      proArgs: 'Evita que dirigentes condenados utilicen fueros parlamentarios como escudo judicial; eleva el estándar ético de los representantes y recupera la confianza pública en las instituciones.',
      conArgs: 'Sectores críticos advierten sobre el riesgo de persecución política (lawfare) o condenas exprés en tribunales politizados que proscriban candidaturas antes de un fallo firme de la Corte Suprema.'
    },
    votesCommunity: {
      yes: 14820,
      no: 2630
    },
    votesCertified: {
      yes: 8940,
      no: 1120
    },
    userVoted: null,
    congressResult: {
      status: 'Pendiente',
      verdict: 'Acordado en Labor Parlamentaria para votarse en el próximo plenario.'
    },
    officialDocUrl: 'https://datos.hcdn.gob.ar/'
  },
  {
    id: 'bill-2',
    title: 'Régimen Penal Juvenil: Modificación de la Edad de Imputabilidad',
    expediente: 'Exp. 0188-PE-2024 / HCDN',
    chamber: 'Diputados',
    status: 'En Debate en Recinto',
    date: 'En comisión de Legislación Penal y Presupuesto',
    tags: ['Seguridad', 'Justicia', 'Juventud'],
    summary: {
      whatChanges: 'Establece un nuevo marco penal aplicable a menores entre 14 y 18 años que cometan delitos graves contra la vida o la integridad física, con regímenes de reclusión especializada y programas socioeducativos.',
      proArgs: 'Termina con la impunidad utilizada por bandas delictivas que reclutan menores sabiendo que no tienen consecuencias penales; brinda contención y tutela antes de que consoliden una carrera criminal.',
      conArgs: 'Especialistas en derechos de la niñez sostienen que bajar la edad no reduce la criminalidad y que el Estado debe invertir en escuelas, clubes y centros de salud antes que en cárceles juveniles.'
    },
    votesCommunity: {
      yes: 19450,
      no: 16820
    },
    votesCertified: {
      yes: 11240,
      no: 9810
    },
    userVoted: null,
    congressResult: {
      status: 'Pendiente',
      verdict: 'En tratamiento de comisiones conjuntas.'
    },
    officialDocUrl: 'https://datos.hcdn.gob.ar/'
  },
  {
    id: 'bill-3',
    title: 'Ley de Financiamiento Universitario e Indexación Salarial Docente',
    expediente: 'Exp. 0312-S-2024 / HCSN',
    chamber: 'Senado',
    status: 'Aprobado en Diputados (Pasa a Senado)',
    date: 'Con media sanción en Diputados',
    tags: ['Educación', 'Presupuesto', 'Universidades'],
    summary: {
      whatChanges: 'Declara la emergencia presupuestaria del sistema universitario nacional y obliga al Poder Ejecutivo a actualizar bimestralmente los gastos de funcionamiento y los salarios docentes de acuerdo al índice de inflación (IPC).',
      proArgs: 'Garantiza el sostenimiento de la ciencia, la investigación y la gratuidad universitaria ante la licuación inflacionaria; protege el poder adquisitivo docente.',
      conArgs: 'El Ministerio de Economía argumenta que compromete el equilibrio fiscal de las cuentas públicas sin identificar la fuente de financiamiento tributario correspondiente.'
    },
    votesCommunity: {
      yes: 32140,
      no: 8490
    },
    votesCertified: {
      yes: 18920,
      no: 4310
    },
    userVoted: null,
    congressResult: {
      status: 'Aprobado',
      yesCount: 143,
      noCount: 87,
      abstainCount: 5,
      date: '2024-09-13',
      verdict: 'Aprobado en Diputados (143 Afirmativos vs 87 Negativos). Pasa a Senado.'
    },
    officialDocUrl: 'https://senado.gob.ar/'
  },
  {
    id: 'bill-4',
    title: 'Marco Regulatorio Nacional para Inteligencia Artificial y Datos Soberanos',
    expediente: 'Exp. 0420-D-2026 / HCDN',
    chamber: 'Diputados',
    status: 'Dictamen de Comisión (Listo para Votar)',
    date: 'Comisión de Ciencia, Tecnología e Innovación',
    tags: ['Tecnología', 'Inteligencia Artificial', 'Privacidad'],
    summary: {
      whatChanges: 'Crea una Agencia de Ética Algorítmica, prohíbe el uso de biometría masiva en espacios públicos sin orden judicial y exige a los modelos de IA generativa identificar obras protegidas por propiedad intelectual usadas para entrenamiento.',
      proArgs: 'Protege a los trabajadores creativos, previene la vigilancia biométrica abusiva y sitúa a la Argentina a la vanguardia de la gobernanza tecnológica ética en la región.',
      conArgs: 'Cámaras de software alertan que una sobrerregulación burocrática espantará inversiones de startups y centros de cómputo GPU hacia países vecinos con marcos más flexibles.'
    },
    votesCommunity: {
      yes: 12430,
      no: 5310
    },
    votesCertified: {
      yes: 7420,
      no: 2890
    },
    userVoted: null,
    congressResult: {
      status: 'Pendiente',
      verdict: 'Dictamen favorable unánime en comisiones. En espera de sesión ordinaria.'
    },
    officialDocUrl: 'https://datos.hcdn.gob.ar/'
  }
];

export const INITIAL_NEWS: NewsArticle[] = [
  {
    id: 'news-1',
    source: 'Infobae',
    sourceLogoText: 'INFOBAE',
    category: 'Política',
    title: 'El Congreso debate el Presupuesto con foco en el superávit primario y el gasto social',
    timeAgo: 'Hace 45 min',
    bullets: [
      'Los bloques de la oposición exigen partidas fijas para salud, educación y jubilaciones mientras el oficialismo sostiene la meta de déficit cero.',
      'Se reunió la Comisión de Presupuesto y Hacienda para escuchar a secretarios de Estado sobre previsiones de tipo de cambio e inflación.',
      'La votación final en el recinto de Diputados se proyecta para antes del cierre del período de sesiones ordinarias.'
    ],
    readTime: '2 min',
    url: 'https://infobae.com',
    likes: 421,
    votes: { yes: 840, no: 290 },
    userVoted: null
  },
  {
    id: 'news-2',
    source: 'La Nación',
    sourceLogoText: 'LA NACION',
    category: 'Economía',
    title: 'El Banco Central acelera la compra de divisas y los bonos soberanos marcan nuevos máximos',
    timeAgo: 'Hace 2 horas',
    bullets: [
      'Las reservas netas sumaron compras consecutivas impulsadas por la liquidación de exportaciones y financiamiento corporativo.',
      'El riesgo país perforó un nuevo piso anual, mejorando el costo de fondeo para empresas locales que emiten obligaciones negociables.',
      'Analistas del mercado proyectan una desaceleración en la tasa de política monetaria en los próximos meses.'
    ],
    readTime: '3 min',
    url: 'https://lanacion.com.ar',
    likes: 310,
    votes: { yes: 620, no: 180 },
    userVoted: null
  },
  {
    id: 'news-3',
    source: 'Clarín',
    sourceLogoText: 'CLARIN',
    category: 'Sociedad',
    title: 'Lanzan un plan de modernización en el transporte metropolitano con pago contactless y QR',
    timeAgo: 'Hace 3 horas',
    bullets: [
      'Se habilita la posibilidad de pagar boletos de colectivos y trenes con tarjetas de débito, crédito y billeteras virtuales además de la tarjeta SUBE.',
      'La primera etapa comenzará en ciudades del interior y se extenderá progresivamente al Área Metropolitana de Buenos Aires.',
      'El sistema busca agilizar los accesos y evitar las trabas de recarga física de tarjetas.'
    ],
    readTime: '2 min',
    url: 'https://clarin.com',
    likes: 852,
    votes: { yes: 1450, no: 95 },
    userVoted: null
  },
  {
    id: 'news-4',
    source: 'BBC Mundo',
    sourceLogoText: 'BBC',
    category: 'Tecnología',
    title: 'El auge de la identidad digital descentralizada y las pruebas ZK frente a las granjas de bots',
    timeAgo: 'Hace 5 horas',
    bullets: [
      'Las redes sociales y plataformas de votación aceleran la adopción de "Proof of Humanity" para combatir cuentas creadas por IA.',
      'Las Pruebas de Conocimiento Cero (Zero-Knowledge) permiten demostrar que un usuario es una persona real sin revelar su nombre ni documento.',
      'Argentina figura en los primeros puestos mundiales de verificación voluntaria con más de 3 millones de personas autenticadas.'
    ],
    readTime: '4 min',
    url: 'https://bbc.com/mundo',
    likes: 645,
    votes: { yes: 980, no: 120 },
    userVoted: null
  },
  {
    id: 'news-5',
    source: 'Olé',
    sourceLogoText: 'OLE',
    category: 'Deportes',
    title: 'Scaloni prepara una lista con recambio generacional para la próxima doble fecha de Eliminatorias',
    timeAgo: 'Hace 6 horas',
    bullets: [
      'El cuerpo técnico de la Selección Argentina evalúa convocar a jóvenes figuras que brillan en ligas europeas y el fútbol local.',
      'Messi y los referentes respaldan la integración progresiva de caras nuevas con miras a la consolidación del plantel.',
      'El combinado nacional lidera la tabla de posiciones con un rendimiento sostenido.'
    ],
    readTime: '2 min',
    url: 'https://ole.com.ar',
    likes: 1205,
    votes: { yes: 1820, no: 240 },
    userVoted: null
  },
  {
    id: 'news-6',
    source: 'Rolling Stone',
    sourceLogoText: 'ROLLING STONE',
    category: 'Espectáculos',
    title: 'El festival de música independiente más grande del país anuncia su grilla con más de 50 bandas',
    timeAgo: 'Hace 8 horas',
    bullets: [
      'El evento se llevará a cabo durante tres jornadas con escenarios simultáneos dedicados al rock, indie, trap y electrónica.',
      'Habrá espacios interactivos con tecnología sonora inmersiva y experiencias visuales creadas con inteligencia artificial.',
      'Las entradas de preventa se agotaron en menos de 45 minutos.'
    ],
    readTime: '3 min',
    url: 'https://rollingstone.com',
    likes: 490,
    votes: { yes: 510, no: 80 },
    userVoted: null
  }
];

export const INITIAL_COMMUNITY_POLLS: CommunityPoll[] = [
  {
    id: 'poll-1',
    author: 'Facundo M.',
    isAuthorVerified: true,
    category: 'Sociedad',
    question: '¿Estás de acuerdo con reducir la jornada laboral en Argentina a 36 horas semanales (o 4 días) manteniendo el salario?',
    context: 'Varios países de Europa ensayaron esquemas de 4 días laborales con aumento de productividad y menor estrés laboral.',
    votes: {
      yes: 1842,
      no: 312
    },
    userVoted: null,
    commentsCount: 94,
    timeAgo: 'Hace 2 horas',
    isTrending: true
  },
  {
    id: 'poll-2',
    author: 'Lucía V.',
    isAuthorVerified: true,
    category: 'Justicia',
    question: '¿Todos los jueces y fiscales deberían tributar Impuesto a las Ganancias en igualdad de condiciones con cualquier trabajador?',
    context: 'Históricamente existió una exención para magistrados nombrados antes de 2017 que genera constante debate ético.',
    votes: {
      yes: 2450,
      no: 110
    },
    userVoted: null,
    commentsCount: 142,
    timeAgo: 'Hace 4 horas',
    isTrending: true
  },
  {
    id: 'poll-3',
    author: 'Martín T.',
    isAuthorVerified: false,
    category: 'Educación',
    question: '¿Deberían prohibirse los teléfonos celulares dentro de las aulas en escuelas secundarias para mejorar la concentración?',
    context: 'CABA y varias provincias comenzaron a restringir el uso de smartphones en clases por dispersión y problemas de atención.',
    votes: {
      yes: 1120,
      no: 890
    },
    userVoted: null,
    commentsCount: 68,
    timeAgo: 'Hace 6 horas'
  },
  {
    id: 'poll-4',
    author: 'Camila R.',
    isAuthorVerified: true,
    category: 'Deportes',
    question: '¿Te parece positivo que los clubes de fútbol argentinos puedan convertirse voluntariamente en Sociedades Anónimas Deportivas (SAD)?',
    context: 'El debate enfrenta el modelo social tradicional de los clubes de barrio con la inyección de capital privado internacional.',
    votes: {
      yes: 740,
      no: 1650
    },
    userVoted: null,
    commentsCount: 215,
    timeAgo: 'Hace 9 horas'
  }
];
