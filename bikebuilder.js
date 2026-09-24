const bikeComponents = {
    frame: { label: 'Cadre', options: [
        { id: 'urban-frame', name: 'Cadre Urban', detail: 'Aluminium · taille M', price: 799 },
        { id: 'gravel-frame', name: 'Cadre Gravel', detail: 'Carbone · taille M', price: 1299 },
        { id: 'trail-frame', name: 'Cadre Trail', detail: 'Aluminium · taille L', price: 999 }
    ] },
    wheels: { label: 'Roues', options: [
        { id: 'road-wheels', name: 'Roues Road 700c', detail: 'Pneus 28 mm · axe traversant', price: 499 },
        { id: 'gravel-wheels', name: 'Roues Gravel 700c', detail: 'Pneus 45 mm · axe traversant', price: 649 },
        { id: 'trail-wheels', name: 'Roues Trail 29"', detail: 'Tubeless ready · axe boost', price: 749 }
    ] },
    drivetrain: { label: 'Transmission', options: [
        { id: 'road-drivetrain', name: 'Shimano 105 2×12', detail: 'Route · cassette 11-34', price: 899 },
        { id: 'gravel-drivetrain', name: 'GRX 1×12', detail: 'Gravel · cassette 10-45', price: 949 },
        { id: 'trail-drivetrain', name: 'Deore 1×12', detail: 'VTT · cassette 10-51', price: 699 }
    ] },
    brakes: { label: 'Freinage', options: [
        { id: 'road-brakes', name: 'Disques hydrauliques Road', detail: '160 mm', price: 329 },
        { id: 'gravel-brakes', name: 'Disques hydrauliques Gravel', detail: '160 mm · flat mount', price: 379 },
        { id: 'trail-brakes', name: 'Disques hydrauliques Trail', detail: '180 mm · post mount', price: 429 }
    ] },
    cockpit: { label: 'Poste de pilotage', options: [
        { id: 'dropbar', name: 'Cintre route', detail: 'Aluminium · 420 mm', price: 149 },
        { id: 'flarebar', name: 'Cintre gravel', detail: 'Évasement 12° · 440 mm', price: 179 },
        { id: 'flatbar', name: 'Cintre plat', detail: 'Aluminium · 720 mm', price: 99 }
    ] }
};

const compatibilityRules = [
    { when: ['urban-frame', 'gravel-wheels'], message: 'Les roues Gravel 700c ne sont pas compatibles avec le cadre Urban (dégagement insuffisant).' },
    { when: ['urban-frame', 'trail-wheels'], message: 'Les roues Trail 29" ne rentrent pas dans le cadre Urban.' },
    { when: ['gravel-frame', 'trail-wheels'], message: 'Le cadre Gravel accepte des roues 700c, pas des roues Trail 29".' },
    { when: ['trail-frame', 'road-wheels'], message: 'Les roues Road ne correspondent pas aux axes Boost du cadre Trail.' },
    { when: ['road-drivetrain', 'flatbar'], message: 'La transmission Road 2×12 nécessite un cintre route avec leviers adaptés.' },
    { when: ['trail-drivetrain', 'dropbar'], message: 'La transmission Deore Trail n’est pas compatible avec un cintre route.' },
    { when: ['road-brakes', 'trail-frame'], message: 'Le cadre Trail requiert un freinage post mount spécifique.' }
];

// PriceProvider-compatible demo adapters. Replace this list with API-backed providers later.
const demoPriceProviders = [
    { id: 'bikebuilder-demo', name: 'BikeBuilder Demo', delivery: 'Livraison estimée : 3 à 5 jours', multiplier: 1, shipping: 0 },
    { id: 'velo-direct', name: 'Vélo Direct', delivery: 'Livraison estimée : 5 à 7 jours', multiplier: 1.03, shipping: 19.9 },
    { id: 'atelier-local', name: 'Atelier Local', delivery: 'Retrait atelier sous 48 h', multiplier: 1.07, shipping: 0 }
];

const selectedBike = {};
const componentGroups = document.getElementById('component-groups');
const selectedComponents = document.getElementById('selected-components');
const compatibilityStatus = document.getElementById('compatibility-status');
const bikeTotal = document.getElementById('bike-total');
const selectionCount = document.getElementById('selection-count');
const offersSection = document.getElementById('offers-section');
const offersGrid = document.getElementById('offers-grid');
const compareOffersButton = document.getElementById('compare-offers');

const formatPrice = value => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
const findOption = id => Object.values(bikeComponents).flatMap(group => group.options).find(option => option.id === id);
const getCompatibilityIssues = () => {
    const ids = Object.values(selectedBike);
    return compatibilityRules.filter(rule => rule.when.every(id => ids.includes(id))).map(rule => rule.message);
};

function renderConfigurator() {
    componentGroups.innerHTML = Object.entries(bikeComponents).map(([key, group]) => `
        <fieldset class="component-group">
            <legend>${group.label}</legend>
            <div class="component-options">${group.options.map(option => `
                <label class="component-option ${selectedBike[key] === option.id ? 'selected' : ''}">
                    <input type="radio" name="${key}" value="${option.id}" ${selectedBike[key] === option.id ? 'checked' : ''}>
                    <span><strong>${option.name}</strong><small>${option.detail}</small></span>
                    <b>${formatPrice(option.price)}</b>
                </label>`).join('')}</div>
        </fieldset>`).join('');
    componentGroups.querySelectorAll('input').forEach(input => input.addEventListener('change', event => {
        selectedBike[event.target.name] = event.target.value;
        offersSection.hidden = true;
        renderBikeSummary();
        renderConfigurator();
    }));
}

function renderBikeSummary() {
    const selected = Object.entries(selectedBike).map(([key, id]) => ({ group: bikeComponents[key].label, option: findOption(id) }));
    const issues = getCompatibilityIssues();
    const total = selected.reduce((sum, item) => sum + item.option.price, 0);
    selectionCount.textContent = `${selected.length}/${Object.keys(bikeComponents).length}`;
    selectedComponents.innerHTML = selected.length ? selected.map(item => `<div class="selected-item"><span>${item.group}</span><strong>${item.option.name}</strong></div>`).join('') : '<p class="empty-state">Choisissez un composant dans chaque catégorie.</p>';
    bikeTotal.textContent = formatPrice(total);
    compatibilityStatus.className = `compatibility-status ${issues.length ? 'is-invalid' : selected.length === Object.keys(bikeComponents).length ? 'is-valid' : 'is-pending'}`;
    compatibilityStatus.innerHTML = issues.length
        ? `<strong>Configuration incompatible</strong><ul>${issues.map(issue => `<li>${issue}</li>`).join('')}</ul>`
        : selected.length === Object.keys(bikeComponents).length
            ? '<strong>Configuration compatible</strong><span>Tous les composants sélectionnés fonctionnent ensemble.</span>'
            : '<strong>Vérification en attente</strong><span>Sélectionnez les composants restants pour lancer le contrôle.</span>';
    compareOffersButton.disabled = selected.length !== Object.keys(bikeComponents).length || issues.length > 0;
}

function renderOffers() {
    const baseTotal = Object.values(selectedBike).map(findOption).reduce((sum, option) => sum + option.price, 0);
    const offers = demoPriceProviders.map(provider => ({ ...provider, total: baseTotal * provider.multiplier + provider.shipping }));
    offersGrid.innerHTML = offers.map((offer, index) => `
        <article class="offer-card ${index === 0 ? 'recommended' : ''}">
            ${index === 0 ? '<span class="recommendation">Meilleure offre</span>' : ''}
            <h3>${offer.name}</h3><p>${offer.delivery}</p><strong>${formatPrice(offer.total)}</strong>
            <span class="offer-note">Prix de test · livraison incluse</span>
            <button class="secondary-button" type="button" disabled>Voir le détail</button>
        </article>`).join('');
    offersSection.hidden = false;
    offersSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.getElementById('reset-bike').addEventListener('click', () => {
    Object.keys(selectedBike).forEach(key => delete selectedBike[key]);
    offersSection.hidden = true;
    renderConfigurator();
    renderBikeSummary();
});
compareOffersButton.addEventListener('click', renderOffers);
renderConfigurator();
renderBikeSummary();
