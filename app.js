// BikeBuilder UI Controller
const BB = window.BikeBuilder;
const CATEGORIES = Object.keys(BB.components);
const LABELS = {
  frame: 'Choisissez la structure de votre vélo',
  fork: 'Sélectionnez la fourche adaptée',
  wheels: 'Choisissez vos roues',
  tires: 'Sélectionnez les pneus',
  drivetrain: 'Choisissez la transmission',
  brakes: 'Sélectionnez le système de freinage',
  cockpit: 'Choisissez le poste de pilotage',
  saddle: 'Sélectionnez votre selle',
  pedals: 'Choisissez vos pédales',
  accessories: 'Ajoutez des accessoires'
};

let currentStep = 0;
let currentBike = {};

// DOM Elements
const componentOptions = document.getElementById('component-options');
const stepLabel = document.getElementById('step-label');
const stepTitle = document.getElementById('step-title');
const stepDescription = document.getElementById('step-description');
const progressFill = document.getElementById('progress-fill');
const selectionCount = document.getElementById('selection-count');
const compatibilityStatus = document.getElementById('compatibility-status');
const selectedComponents = document.getElementById('selected-components');
const bikeTotal = document.getElementById('bike-total');
const prevStepBtn = document.getElementById('prev-step');
const nextStepBtn = document.getElementById('next-step');
const resetBikeBtn = document.getElementById('reset-bike');
const compareOffersBtn = document.getElementById('compare-offers');
const saveConfigBtn = document.getElementById('save-config');
const offersSection = document.getElementById('offers-section');
const offersGrid = document.getElementById('offers-grid');
const backToConfigBtn = document.getElementById('back-to-config');

// Format price for display
function formatPrice(value) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
}

// Update progress bar
function updateProgress() {
  const progress = ((currentStep + 1) / CATEGORIES.length) * 100;
  progressFill.style.width = progress + '%';
  stepLabel.textContent = `Étape ${currentStep + 1}/${CATEGORIES.length}`;
  
  // Update step indicators
  document.querySelectorAll('.step').forEach((el, idx) => {
    el.classList.toggle('active', idx === currentStep);
    el.classList.toggle('completed', idx < currentStep);
  });
  
  // Update navigation buttons
  prevStepBtn.disabled = currentStep === 0;
  nextStepBtn.textContent = currentStep === CATEGORIES.length - 1 ? 'Terminer' : 'Suivant →';
  
  // Update button color for last step
  if (currentStep === CATEGORIES.length - 1) {
    nextStepBtn.classList.add('finish');
  } else {
    nextStepBtn.classList.remove('finish');
  }
}

// Render current step options
function renderStep() {
  const category = CATEGORIES[currentStep];
  const categoryData = BB.components[category];
  
  stepTitle.textContent = categoryData.label;
  stepDescription.textContent = LABELS[category];
  
  componentOptions.innerHTML = categoryData.options.map(option => `
    <label class="component-option ${currentBike[category] === option.id ? 'selected' : ''}">
      <input type="radio" name="${category}" value="${option.id}" ${currentBike[category] === option.id ? 'checked' : ''}>
      <div class="option-content">
        <span class="option-name">${option.name}</span>
        <span class="option-detail">${option.detail}</span>
      </div>
      <span class="option-price">${formatPrice(option.price)}</span>
    </label>
  `).join('');
  
  // Add event listeners
  componentOptions.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', (e) => {
      currentBike[category] = e.target.value;
      renderSummary();
      renderStep();
      offersSection.hidden = true;
    });
  });
  
  updateProgress();
}

// Render summary panel
function renderSummary() {
  const selected = Object.entries(currentBike)
    .map(([cat, id]) => ({ category: BB.components[cat].label, option: BB.components[cat].options.find(o => o.id === id) }))
    .filter(item => item.option);
  
  const status = BB.getCompatibilityStatus(currentBike);
  const total = selected.reduce((sum, item) => sum + item.option.price, 0);
  
  selectionCount.textContent = `${selected.length}/${CATEGORIES.length}`;
  
  selectedComponents.innerHTML = selected.length ? selected.map(item => `
    <div class="selected-item">
      <span>${item.category}</span>
      <strong>${item.option.name}</strong>
    </div>
  `).join('') : '<p class="empty-state">Complétez chaque étape pour assembler votre vélo.</p>';
  
  bikeTotal.textContent = formatPrice(total);
  
  // Compatibility status
  compatibilityStatus.className = `compatibility-status ${
    status.issues.length ? 'is-invalid' :
    status.complete ? 'is-valid' :
    'is-pending'
  }`;
  
  compatibilityStatus.innerHTML = status.issues.length
    ? `<strong>⚠ Configuration incomplète</strong><ul>${status.issues.map(issue => `<li>${issue}</li>`).join('')}</ul>`
    : status.complete
      ? '<strong>✓ Configuration compatible</strong><span>Tous les composants fonctionnent ensemble.</span>'
      : '<strong>En cours...</strong><span>Sélectionnez les composants restants.</span>';
  
  compareOffersBtn.disabled = !status.complete || status.issues.length > 0;
}

// Render offers
function renderOffers() {
  const offers = BB.generateOffers(currentBike);
  
  offersGrid.innerHTML = offers.map((offer, idx) => `
    <article class="offer-card ${offer.isOptimal ? 'recommended' : ''}">
      ${offer.isOptimal ? '<span class="recommendation">Meilleure offre</span>' : ''}
      <h3>${offer.name}</h3>
      <p class="offer-delivery">${offer.delivery}</p>
      <div class="offer-price-section">
        <strong class="offer-price">${formatPrice(offer.total)}</strong>
        <span class="offer-shipping">Livraison ${offer.shipping > 0 ? '+' + formatPrice(offer.shipping) : 'incluse'}</span>
      </div>
      <span class="offer-note">Prix de test · données de démonstration</span>
      <button class="btn-secondary full-width" type="button" disabled>Sélectionner</button>
    </article>
  `).join('');
  
  offersSection.hidden = false;
  offersSection.scrollIntoView({ behavior: 'smooth' });
}

// Step navigation
function goToStep(step) {
  if (step >= 0 && step < CATEGORIES.length) {
    currentStep = step;
    renderStep();
  }
}

prevStepBtn.addEventListener('click', () => goToStep(currentStep - 1));
nextStepBtn.addEventListener('click', () => goToStep(currentStep + 1));

resetBikeBtn.addEventListener('click', () => {
  currentBike = {};
  currentStep = 0;
  offersSection.hidden = true;
  renderStep();
  renderSummary();
});

compareOffersBtn.addEventListener('click', renderOffers);

backToConfigBtn.addEventListener('click', () => {
  offersSection.hidden = true;
});

// Save configuration
saveConfigBtn.addEventListener('click', () => {
  const status = BB.getCompatibilityStatus(currentBike);
  if (!status.complete) {
    alert('Veuillez compléter votre configuration avant de l\'enregistrer.');
    return;
  }
  
  const name = prompt('Nom de votre configuration:', 'Mon vélo');
  if (name) {
    const configId = BB.saveBikeConfig(currentBike, name);
    alert(`Configuration enregistrée ! ID: ${configId}`);
  }
});

// Initialize
renderStep();
renderSummary();
