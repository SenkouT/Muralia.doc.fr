// BikeBuilder.com — Complete bike configurator with 10 component categories
// This architecture is designed to be compatible with future API/PriceProvider integrations

// ============================================================================
// 1. COMPONENT CATALOG
// ============================================================================

const bikeComponents = {
  frame: {
    label: 'Cadre',
    category: 'frame',
    options: [
      { id: 'urban-frame-s', name: 'Cadre Urban S', detail: 'Aluminium · taille S', price: 799, specs: { wheelSize: '700c', bbStandard: 'PF86', rearAxle: 'thruAxle', forkMount: 'integrated' } },
      { id: 'urban-frame-m', name: 'Cadre Urban M', detail: 'Aluminium · taille M', price: 799, specs: { wheelSize: '700c', bbStandard: 'PF86', rearAxle: 'thruAxle', forkMount: 'integrated' } },
      { id: 'gravel-frame', name: 'Cadre Gravel', detail: 'Carbone · taille M', price: 1299, specs: { wheelSize: '700c', bbStandard: 'BSA', rearAxle: 'boost', forkMount: 'flatMount' } },
      { id: 'trail-frame-l', name: 'Cadre Trail L', detail: 'Aluminium · taille L', price: 999, specs: { wheelSize: '29', bbStandard: 'PF92', rearAxle: 'boost', forkMount: 'postMount' } },
      { id: 'trail-frame-xl', name: 'Cadre Trail XL', detail: 'Aluminium · taille XL', price: 999, specs: { wheelSize: '29', bbStandard: 'PF92', rearAxle: 'boost', forkMount: 'postMount' } }
    ]
  },
  fork: {
    label: 'Fourche',
    category: 'fork',
    options: [
      { id: 'rigid-fork-700c', name: 'Fourche rigide 700c', detail: 'Acier · 1.125"', price: 199, specs: { wheelSize: '700c', headtube: '1.125"', brakeMount: 'flatMount', compatible: ['urban-frame-s', 'urban-frame-m'] } },
      { id: 'susp-fork-700c', name: 'Fourche suspendue 700c', detail: 'Alu · 50mm · 1.125"', price: 449, specs: { wheelSize: '700c', headtube: '1.125"', brakeMount: 'flatMount', travel: 50, compatible: ['gravel-frame'] } },
      { id: 'susp-fork-29', name: 'Fourche VTT 29"', detail: 'Alu · 100mm · tapered', price: 649, specs: { wheelSize: '29', headtube: 'tapered', brakeMount: 'postMount', travel: 100, compatible: ['trail-frame-l', 'trail-frame-xl'] } }
    ]
  },
  wheels: {
    label: 'Roues',
    category: 'wheels',
    options: [
      { id: 'road-wheels-700c', name: 'Roues Road 700c', detail: 'Alu · 28mm · axe traversant', price: 499, specs: { size: '700c', width: 28, axleType: 'thruAxle', brakeSys: 'disc', cassette: 12 } },
      { id: 'gravel-wheels-700c', name: 'Roues Gravel 700c', detail: 'Alu · 45mm · axe traversant', price: 649, specs: { size: '700c', width: 45, axleType: 'thruAxle', brakeSys: 'disc', cassette: 12 } },
      { id: 'trail-wheels-29', name: 'Roues Trail 29"', detail: 'Tubeless ready · axe boost', price: 749, specs: { size: '29', width: 60, axleType: 'boost', brakeSys: 'disc', cassette: 12, tubeless: true } }
    ]
  },
  tires: {
    label: 'Pneus',
    category: 'tires',
    options: [
      { id: 'tire-road-28', name: 'Pneu Route 28mm', detail: 'Schwalbe · 150g · 100psi', price: 65, specs: { diameter: 700, width: 28, type: 'road', tubeless: false, maxPsi: 100 } },
      { id: 'tire-gravel-45', name: 'Pneu Gravel 45mm', detail: 'Maxxis · Rampage · 450g', price: 89, specs: { diameter: 700, width: 45, type: 'gravel', tubeless: true, maxPsi: 65 } },
      { id: 'tire-trail-29', name: 'Pneu Trail 29" 2.6"', detail: 'Maxxis · 950g · tubeless', price: 125, specs: { diameter: 29, width: 66, type: 'mtb', tubeless: true, maxPsi: 50 } }
    ]
  },
  drivetrain: {
    label: 'Transmission',
    category: 'drivetrain',
    options: [
      { id: 'road-drivetrain-12', name: 'Shimano 105 2×12', detail: 'Cassette 11-34 · chaîne 12v', price: 899, specs: { speeds: 12, crankset: '2x', bbStandard: 'PF86', compatible: ['urban-frame-s', 'urban-frame-m', 'gravel-frame'] } },
      { id: 'gravel-drivetrain-12', name: 'GRX 1×12', detail: 'Cassette 10-45 · chaîne 12v', price: 949, specs: { speeds: 12, crankset: '1x', bbStandard: 'BSA', compatible: ['gravel-frame'] } },
      { id: 'trail-drivetrain-12', name: 'Deore 1×12', detail: 'Cassette 10-51 · chaîne 12v', price: 699, specs: { speeds: 12, crankset: '1x', bbStandard: 'PF92', compatible: ['trail-frame-l', 'trail-frame-xl'] } }
    ]
  },
  brakes: {
    label: 'Freinage',
    category: 'brakes',
    options: [
      { id: 'brakes-road-160', name: 'Disques hydrauliques Road 160mm', detail: 'Shimano · flat mount', price: 329, specs: { type: 'disc', diameter: 160, mount: 'flatMount' } },
      { id: 'brakes-gravel-160', name: 'Disques hydrauliques Gravel 160mm', detail: 'Shimano · flat mount', price: 379, specs: { type: 'disc', diameter: 160, mount: 'flatMount' } },
      { id: 'brakes-trail-180', name: 'Disques hydrauliques Trail 180mm', detail: 'Shimano · post mount', price: 429, specs: { type: 'disc', diameter: 180, mount: 'postMount' } }
    ]
  },
  cockpit: {
    label: 'Poste de pilotage',
    category: 'cockpit',
    options: [
      { id: 'dropbar-al', name: 'Cintre route Alu', detail: 'Aluminium · 420mm · 31.8mm', price: 149, specs: { type: 'dropbar', diameter: 31.8, width: 420, material: 'alu' } },
      { id: 'flarebar-al', name: 'Cintre gravel Alu', detail: 'Évasement 12° · 440mm · 31.8mm', price: 179, specs: { type: 'flarebar', diameter: 31.8, width: 440, flare: 12, material: 'alu' } },
      { id: 'flatbar-alu', name: 'Cintre plat Alu', detail: 'Aluminium · 720mm · 31.8mm', price: 99, specs: { type: 'flatbar', diameter: 31.8, width: 720, material: 'alu' } }
    ]
  },
  saddle: {
    label: 'Selle',
    category: 'saddle',
    options: [
      { id: 'saddle-road', name: 'Selle route cuir', detail: 'Brooks B17 · 160g · cuir', price: 299, specs: { type: 'road', weight: 160, material: 'leather', width: 168 } },
      { id: 'saddle-hybrid', name: 'Selle hybride gel', detail: 'Comfort · 320g · gel', price: 89, specs: { type: 'hybrid', weight: 320, material: 'gel', width: 220 } },
      { id: 'saddle-mtb', name: 'Selle VTT trail', detail: 'WTB · 280g · anatomique', price: 159, specs: { type: 'mtb', weight: 280, material: 'synthetic', width: 150 } }
    ]
  },
  pedals: {
    label: 'Pédales',
    category: 'pedals',
    options: [
      { id: 'pedals-flat', name: 'Pédales plates Alu', detail: 'DMR · 600g · grip plates', price: 149, specs: { type: 'flat', weight: 600, clipless: false } },
      { id: 'pedals-spd', name: 'Pédales SPD', detail: 'Shimano · 380g · VTT', price: 129, specs: { type: 'spd', weight: 380, clipless: true, standard: 'spd' } },
      { id: 'pedals-road', name: 'Pédales route SPD-SL', detail: 'Shimano · 350g · route', price: 249, specs: { type: 'spdsl', weight: 350, clipless: true, standard: 'spdsl' } }
    ]
  },
  accessories: {
    label: 'Accessoires',
    category: 'accessories',
    options: [
      { id: 'acc-none', name: 'Aucun accessoire', detail: 'Configuration minimaliste', price: 0, specs: { type: 'none' } },
      { id: 'acc-lights', name: 'Éclairage USB', detail: 'Avant + arrière · 200lm', price: 89, specs: { type: 'lights', weight: 180, brightness: 200 } },
      { id: 'acc-rack', name: 'Porte-bagages acier', detail: 'Capacité 25kg · noir', price: 79, specs: { type: 'rack', weight: 650, capacity: 25 } }
    ]
  }
};

// ============================================================================
// 2. COMPATIBILITY ENGINE
// ============================================================================

const compatibilityRules = [
  // Frame ↔ Fork
  { category: 'frame_fork', check: (frame, fork) => {
      const fSpecs = bikeComponents.fork.options.find(o => o.id === fork)?.specs;
      return !fSpecs?.compatible || fSpecs.compatible.includes(frame);
    }, message: 'La fourche n\'est pas compatible avec ce cadre (diamètre de jeu de direction/taille de roue).' },

  // Frame ↔ Wheels
  { category: 'frame_wheels', check: (frame, wheels) => {
      const fSpecs = bikeComponents.frame.options.find(o => o.id === frame)?.specs;
      const wSpecs = bikeComponents.wheels.options.find(o => o.id === wheels)?.specs;
      return fSpecs?.wheelSize === wSpecs?.size;
    }, message: 'Les roues n\'ont pas le bon diamètre pour ce cadre.' },

  // Wheels ↔ Tires
  { category: 'wheels_tires', check: (wheels, tires) => {
      const wSpecs = bikeComponents.wheels.options.find(o => o.id === wheels)?.specs;
      const tSpecs = bikeComponents.tires.options.find(o => o.id === tires)?.specs;
      return wSpecs?.size === tSpecs?.diameter || (wSpecs?.size === '700c' && tSpecs?.diameter === 700);
    }, message: 'Les pneus ne correspondent pas à la taille de roue.' },

  // Frame ↔ Drivetrain (BB standard)
  { category: 'frame_drivetrain', check: (frame, drivetrain) => {
      const fSpecs = bikeComponents.frame.options.find(o => o.id === frame)?.specs;
      const dSpecs = bikeComponents.drivetrain.options.find(o => o.id === drivetrain)?.specs;
      return fSpecs?.bbStandard === dSpecs?.bbStandard;
    }, message: 'La transmission n\'est pas compatible avec le boîtier de pédalier du cadre.' },

  // Drivetrain ↔ Cockpit (road 2x needs dropbar)
  { category: 'drivetrain_cockpit', check: (drivetrain, cockpit) => {
      const dSpecs = bikeComponents.drivetrain.options.find(o => o.id === drivetrain)?.specs;
      const cSpecs = bikeComponents.cockpit.options.find(o => o.id === cockpit)?.specs;
      if (dSpecs?.crankset === '2x' && cSpecs?.type !== 'dropbar') {
        return false;
      }
      return true;
    }, message: 'La transmission 2x nécessite un cintre route pour les leviers de dérailleur avant.' },

  // Frame ↔ Brakes (mount type)
  { category: 'frame_brakes', check: (frame, brakes) => {
      const fSpecs = bikeComponents.frame.options.find(o => o.id === frame)?.specs;
      const bSpecs = bikeComponents.brakes.options.find(o => o.id === brakes)?.specs;
      return fSpecs?.forkMount === bSpecs?.mount;
    }, message: 'Le freinage n\'est pas compatible avec le système de fixation du cadre.' }
];

function getCompatibilityStatus(bike) {
  const issues = [];
  const checks = [
    ['frame', 'fork', 'frame_fork'],
    ['frame', 'wheels', 'frame_wheels'],
    ['wheels', 'tires', 'wheels_tires'],
    ['frame', 'drivetrain', 'frame_drivetrain'],
    ['drivetrain', 'cockpit', 'drivetrain_cockpit'],
    ['frame', 'brakes', 'frame_brakes']
  ];

  checks.forEach(([cat1, cat2, ruleId]) => {
    if (bike[cat1] && bike[cat2]) {
      const rule = compatibilityRules.find(r => r.category === ruleId);
      if (rule && !rule.check(bike[cat1], bike[cat2])) {
        issues.push(rule.message);
      }
    }
  });

  return {
    valid: issues.length === 0,
    issues: issues,
    complete: Object.keys(bikeComponents).every(cat => bike[cat])
  };
}

// ============================================================================
// 3. PRICE PROVIDER INTERFACE
// ============================================================================

const demoPriceProviders = [
  {
    id: 'bikebuilder-store',
    name: 'BikeBuilder Store',
    delivery: '3–5 jours',
    multiplier: 1.0,
    shipping: 0,
    returnDays: 30
  },
  {
    id: 'velo-direct',
    name: 'Vélo Direct',
    delivery: '5–7 jours',
    multiplier: 1.03,
    shipping: 19.9,
    returnDays: 60
  },
  {
    id: 'atelier-local',
    name: 'Atelier Local',
    delivery: '2 jours (retrait)',
    multiplier: 1.07,
    shipping: 0,
    returnDays: 14
  }
];

function generateOffers(bike) {
  const baseTotal = Object.entries(bike)
    .map(([cat, id]) => bikeComponents[cat].options.find(o => o.id === id)?.price || 0)
    .reduce((a, b) => a + b, 0);

  return demoPriceProviders.map((provider, idx) => ({
    ...provider,
    baseTotal: baseTotal,
    discount: idx === 0 ? 0 : 0,
    total: Math.round((baseTotal * provider.multiplier + provider.shipping) * 100) / 100,
    isOptimal: idx === 0
  }));
}

// ============================================================================
// 4. CONFIGURATION STORAGE
// ============================================================================

const STORAGE_KEY = 'bikebuilder_current_config';
const STORAGE_SAVED_CONFIGS = 'bikebuilder_saved_configs';

function saveBikeConfig(bike, name = 'Ma configuration') {
  const config = {
    id: Date.now().toString(),
    name: name,
    timestamp: new Date().toISOString(),
    bike: { ...bike }
  };
  
  const saved = JSON.parse(localStorage.getItem(STORAGE_SAVED_CONFIGS) || '[]');
  saved.push(config);
  localStorage.setItem(STORAGE_SAVED_CONFIGS, JSON.stringify(saved));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bike));
  
  return config.id;
}

function loadBikeConfig(id) {
  if (id === 'current') {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  }
  const saved = JSON.parse(localStorage.getItem(STORAGE_SAVED_CONFIGS) || '[]');
  return saved.find(c => c.id === id)?.bike || {};
}

function getSavedConfigs() {
  return JSON.parse(localStorage.getItem(STORAGE_SAVED_CONFIGS) || '[]');
}

function deleteSavedConfig(id) {
  const saved = JSON.parse(localStorage.getItem(STORAGE_SAVED_CONFIGS) || '[]');
  const filtered = saved.filter(c => c.id !== id);
  localStorage.setItem(STORAGE_SAVED_CONFIGS, JSON.stringify(filtered));
}

// ============================================================================
// 5. EXPORT FOR FRONTEND
// ============================================================================

if (typeof window !== 'undefined') {
  window.BikeBuilder = {
    components: bikeComponents,
    rules: compatibilityRules,
    providers: demoPriceProviders,
    getCompatibilityStatus,
    generateOffers,
    saveBikeConfig,
    loadBikeConfig,
    getSavedConfigs,
    deleteSavedConfig
  };
}
