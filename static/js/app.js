// ── State ──────────────────────────────────────────────
const state = {
    step: 1,
    areaType: null,      // 'polygon' | 'bbox'
    areaData: null,      // [[lat,lng], ...] | [s, n, w, e]
    areaName: '',
    businessKey: null,
    customValue: null,   // used when businessKey === 'other'
    businesses: [],
    selectedFields: ['name', 'address', 'phone', 'website', 'opening_hours'],
};

const FIELD_LABELS = {
    name:          'Business Name',
    address:       'Address',
    phone:         'Phone',
    website:       'Website',
    email:         'Email',
    opening_hours: 'Opening Hours',
    rating:        'Rating',
    cuisine:       'Cuisine',
    latitude:      'Latitude',
    longitude:     'Longitude',
};

const BUSINESS_ICONS = {
    restaurant:  '🍽️', cafe:        '☕',  bar:         '🍺',
    fast_food:   '🍔', sushi:       '🍣',  pizza:       '🍕',
    burger:      '🍔', bakery:      '🥐',  gym:         '💪',
    pharmacy:    '💊', dentist:     '🦷',  hospital:    '🏥',
    beauty:      '💅', hairdresser: '✂️',  supermarket: '🛒',
    clothes:     '👕', electronics: '💻',  bank:        '🏦',
    hotel:       '🏨', fuel:        '⛽',  school:      '🏫',
    cinema:      '🎬', nightclub:   '🎵',  atm:         '💳',
    laundry:     '🧺', books:       '📚',  florist:     '🌸',
    optician:    '👓', veterinary:  '🐾',  car_repair:  '🔧',
    jewelry:     '💍', barber:      '💈', pet_shop:    '🐶',  car_wash:    '🚿',
    post_office: '📮', parking:     '🅿️',  ice_cream:   '🍦',
    hardware:    '🔨', bicycle:     '🚲',  alcohol:     '🍷',
    travel:      '✈️', massage:     '💆',  toys:        '🧸',
    sports_shop: '⚽', tattoo:      '🎨',  photography: '📷',
    music_shop:  '🎸', swimming:    '🏊',  park:        '🌳',
    playground:  '🛝',
};

// ── Map ─────────────────────────────────────────────────
let map, drawnItems, bboxRect, polygonHandler, rectangleHandler;
let resultMarkers = [];
let streetLayer, satelliteLayer, currentMapType = 'street';

function initMap() {
    map = L.map('map').setView([37.97, 23.73], 12);

    streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
    });

    satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri, DigitalGlobe, GeoEye, Earthstar Geographics',
        maxZoom: 19,
    });

    streetLayer.addTo(map);

    drawnItems = new L.FeatureGroup().addTo(map);

    // Init draw handlers (no toolbar shown — we use our own buttons)
    const polyOpts  = { color: '#2563eb', weight: 2, fillOpacity: 0.1 };
    polygonHandler   = new L.Draw.Polygon(map,   { shapeOptions: polyOpts });
    rectangleHandler = new L.Draw.Rectangle(map, { shapeOptions: polyOpts });

    map.on(L.Draw.Event.CREATED, function (e) {
        drawnItems.clearLayers();
        drawnItems.addLayer(e.layer);

        let latlngs = e.layer.getLatLngs();
        // Polygon/rectangle returns [[LatLng, ...]]
        if (Array.isArray(latlngs[0])) latlngs = latlngs[0];

        state.areaType = 'polygon';
        state.areaData = latlngs.map(ll => [ll.lat, ll.lng]);
        state.areaName = 'Drawn area';

        document.getElementById('btn-polygon').classList.remove('active');
        document.getElementById('btn-rectangle').classList.remove('active');
        document.getElementById('btn-clear').classList.remove('hidden');

        setAreaSelected(true, 'Area drawn on map');
    });
}

// ── Draw controls ───────────────────────────────────────
function activateDraw(type) {
    polygonHandler.disable();
    rectangleHandler.disable();

    if (type === 'polygon') {
        polygonHandler.enable();
        document.getElementById('btn-polygon').classList.add('active');
        document.getElementById('btn-rectangle').classList.remove('active');
    } else {
        rectangleHandler.enable();
        document.getElementById('btn-rectangle').classList.add('active');
        document.getElementById('btn-polygon').classList.remove('active');
    }
}

function clearArea() {
    polygonHandler.disable();
    rectangleHandler.disable();
    drawnItems.clearLayers();
    if (bboxRect) { map.removeLayer(bboxRect); bboxRect = null; }

    state.areaType = null;
    state.areaData = null;
    state.areaName = '';

    document.getElementById('btn-clear').classList.add('hidden');
    document.getElementById('btn-polygon').classList.remove('active');
    document.getElementById('btn-rectangle').classList.remove('active');

    setAreaSelected(false);
    clearMarkers();
}

// ── Geocoding ───────────────────────────────────────────
async function geocodeCity() {
    const city = document.getElementById('city-input').value.trim();
    if (!city) return;

    const resultsDiv = document.getElementById('geocode-results');
    resultsDiv.innerHTML = '<div class="hint" style="padding:4px 0">Searching…</div>';

    try {
        const resp = await fetch('/api/geocode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ city }),
        });
        const data = await resp.json();

        if (data.error) {
            resultsDiv.innerHTML = `<div class="badge error">${data.error}</div>`;
            return;
        }

        resultsDiv.innerHTML = '';
        data.results.forEach(r => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.textContent = r.display_name;
            div.onclick = () => selectCity(r);
            resultsDiv.appendChild(div);
        });
    } catch {
        resultsDiv.innerHTML = '<div class="badge error">Search failed. Check your connection.</div>';
    }
}

function selectCity(result) {
    if (bboxRect) { map.removeLayer(bboxRect); bboxRect = null; }
    drawnItems.clearLayers();

    // Nominatim bbox: [south, north, west, east]
    const [s, n, w, e] = result.bbox;

    bboxRect = L.rectangle([[s, w], [n, e]], {
        color: '#2563eb', weight: 2, fillOpacity: 0.08,
    }).addTo(map);

    map.fitBounds([[s, w], [n, e]], { padding: [20, 20] });

    state.areaType = 'bbox';
    state.areaData = result.bbox;
    state.areaName = result.display_name.split(',')[0].trim();

    document.getElementById('geocode-results').innerHTML = '';
    document.getElementById('city-input').value = state.areaName;
    document.getElementById('btn-clear').classList.remove('hidden');

    setAreaSelected(true, `${state.areaName} selected`);
}

function setAreaSelected(ok, message = '') {
    const badge = document.getElementById('area-badge');
    const btn   = document.getElementById('btn-next-1');
    if (ok) {
        badge.classList.remove('hidden');
        document.getElementById('area-badge-text').textContent = message;
        btn.disabled = false;
    } else {
        badge.classList.add('hidden');
        btn.disabled = true;
    }
}

// ── Step navigation ─────────────────────────────────────
function goToStep(step) {
    document.getElementById(`step-${state.step}`).classList.remove('active');
    state.step = step;
    document.getElementById(`step-${step}`).classList.add('active');

    // Update dots
    for (let i = 1; i <= 3; i++) {
        const dot = document.getElementById(`dot-${i}`);
        dot.classList.remove('active', 'done');
        if (i < step)      dot.classList.add('done');
        else if (i === step) dot.classList.add('active');
    }
    document.getElementById('line-12').classList.toggle('done', step > 1);
    document.getElementById('line-23').classList.toggle('done', step > 2);

    if (step === 2) renderTypeGrid('');
    if (step === 3) renderStep3();
}

// ── Business type grid ──────────────────────────────────
function renderTypeGrid(filter) {
    const grid  = document.getElementById('type-grid');
    const lower = filter.toLowerCase().trim();
    grid.innerHTML = '';

    Object.entries(BUSINESS_TYPES_DATA).forEach(([key, bt]) => {
        if (lower && !bt.label.toLowerCase().includes(lower) && !key.includes(lower)) return;

        const btn = document.createElement('button');
        btn.className = 'type-btn' + (state.businessKey === key ? ' selected' : '');
        btn.innerHTML = `<span class="type-icon">${BUSINESS_ICONS[key] || '🏪'}</span><span>${bt.label}</span>`;
        btn.onclick = () => selectType(key, bt.label, btn);
        grid.appendChild(btn);
    });

    // "Other" button always at the end (hidden when filter active)
    if (!lower) {
        const btn = document.createElement('button');
        btn.className = 'type-btn' + (state.businessKey === 'other' ? ' selected' : '');
        btn.innerHTML = `<span class="type-icon">🔍</span><span>Other</span>`;
        btn.onclick = () => selectOther(btn);
        grid.appendChild(btn);
    }
}

function filterTypes(value) {
    renderTypeGrid(value);
}

function selectType(key, label, btnEl) {
    state.businessKey = key;
    state.customValue = null;
    document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('selected'));
    btnEl.classList.add('selected');

    document.getElementById('other-input-wrap').classList.add('hidden');

    const badge = document.getElementById('type-badge');
    badge.classList.remove('hidden');
    document.getElementById('type-badge-label').textContent = label;

    document.getElementById('btn-search').disabled = false;
}

function selectOther(btnEl) {
    state.businessKey = 'other';
    state.customValue = '';
    document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('selected'));
    btnEl.classList.add('selected');

    document.getElementById('other-input-wrap').classList.remove('hidden');
    document.getElementById('other-input').value = '';
    document.getElementById('other-input').focus();

    document.getElementById('type-badge').classList.add('hidden');
    document.getElementById('btn-search').disabled = true;
}

function onOtherInput(value) {
    state.customValue = value.trim();
    const hasValue = state.customValue.length > 0;
    document.getElementById('btn-search').disabled = !hasValue;
    const badge = document.getElementById('type-badge');
    if (hasValue) {
        badge.classList.remove('hidden');
        document.getElementById('type-badge-label').textContent = state.customValue;
    } else {
        badge.classList.add('hidden');
    }
}

// ── Progress bar ────────────────────────────────────────
const ESTIMATED_MS = 35000;
let _progressTimer = null;
let _progressStart = null;

function startProgress() {
    _progressStart = Date.now();
    const fill = document.getElementById('progress-fill');
    const eta  = document.getElementById('progress-eta');

    fill.style.transition = 'none';
    fill.style.width = '0%';

    requestAnimationFrame(() => {
        fill.style.transition = `width ${ESTIMATED_MS}ms linear`;
        fill.style.width = '85%';
    });

    function tick() {
        const elapsed  = Date.now() - _progressStart;
        const remaining = Math.max(0, Math.round((ESTIMATED_MS - elapsed) / 1000));
        eta.textContent = remaining > 0 ? `~${remaining}s` : 'Almost done...';
    }
    tick();
    _progressTimer = setInterval(tick, 1000);
}

function stopProgress() {
    if (_progressTimer) { clearInterval(_progressTimer); _progressTimer = null; }
    const fill = document.getElementById('progress-fill');
    const eta  = document.getElementById('progress-eta');
    fill.style.transition = 'width 0.3s ease';
    fill.style.width = '100%';
    eta.textContent = 'Done!';
}

// ── Search ──────────────────────────────────────────────
async function searchBusinesses() {
    const loading  = document.getElementById('search-loading');
    const errorDiv = document.getElementById('search-error');
    const btn      = document.getElementById('btn-search');

    loading.classList.remove('hidden');
    errorDiv.classList.add('hidden');
    btn.disabled = true;
    startProgress();

    try {
        const resp = await fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                business_type: state.businessKey,
                area_type:     state.areaType,
                area_data:     state.areaData,
                custom_value:  state.customValue || '',
            }),
        });
        const data = await resp.json();

        if (data.error) {
            errorDiv.textContent = data.error;
            errorDiv.classList.remove('hidden');
            return;
        }

        stopProgress();
        state.businesses = data.businesses;
        placeMarkers(data.businesses);
        goToStep(3);

    } catch {
        errorDiv.textContent = 'Search failed. Check your connection.';
        errorDiv.classList.remove('hidden');
    } finally {
        setTimeout(() => {
            loading.classList.add('hidden');
            btn.disabled = false;
        }, 350);
    }
}

// ── Markers ─────────────────────────────────────────────
function placeMarkers(businesses) {
    clearMarkers();
    businesses.forEach((b, i) => {
        if (!b.latitude || !b.longitude) return;
        const delay = Math.min(i * 25, 1500);
        const icon = L.divIcon({
            className: '',
            html: `<div class="map-pin" style="animation-delay:${delay}ms">📍</div>`,
            iconSize: [28, 36],
            iconAnchor: [14, 34],
            popupAnchor: [0, -32],
        });
        const m = L.marker([b.latitude, b.longitude], { icon })
            .bindPopup(`<strong>${escHtml(b.name || '—')}</strong>${b.address ? '<br>' + escHtml(b.address) : ''}`);
        m.addTo(map);
        resultMarkers.push(m);
    });
}

function clearMarkers() {
    resultMarkers.forEach(m => map.removeLayer(m));
    resultMarkers = [];
}

// ── Step 3 render ────────────────────────────────────────
function renderStep3() {
    const count = state.businesses.length;
    const bt    = BUSINESS_TYPES_DATA[state.businessKey];
    const label = bt ? bt.label.toLowerCase() : 'business';

    document.getElementById('results-summary').textContent =
        `Found ${count} ${label}${count !== 1 ? 'es' : ''} in ${state.areaName}`;

    renderFieldsList();
    updateExportSizes();
    renderTable();
}

function renderFieldsList() {
    const container = document.getElementById('fields-list');
    container.innerHTML = '';

    Object.entries(FIELD_LABELS).forEach(([key, label]) => {
        const item = document.createElement('div');
        item.className = 'field-item';

        const cb = document.createElement('input');
        cb.type    = 'checkbox';
        cb.id      = `field-${key}`;
        cb.checked = state.selectedFields.includes(key);
        cb.onchange = () => {
            if (cb.checked) {
                if (!state.selectedFields.includes(key)) state.selectedFields.push(key);
            } else {
                state.selectedFields = state.selectedFields.filter(f => f !== key);
            }
            updateExportSizes();
            renderTable();
        };

        const lbl = document.createElement('label');
        lbl.htmlFor   = `field-${key}`;
        lbl.textContent = label;

        item.appendChild(cb);
        item.appendChild(lbl);
        container.appendChild(item);
    });
}

function toggleAllFields(on) {
    state.selectedFields = on ? Object.keys(FIELD_LABELS) : [];
    document.querySelectorAll('.field-item input[type="checkbox"]')
        .forEach(cb => { cb.checked = on; });
    updateExportSizes();
    renderTable();
}

// ── File size estimates ──────────────────────────────────
function updateExportSizes() {
    const n = state.businesses.length;
    const f = state.selectedFields.length;
    const avg = 20; // avg chars per field

    document.getElementById('size-csv').textContent  = fmt(n * f * avg + f * 15);
    document.getElementById('size-xlsx').textContent = fmt(n * f * 12 + 10240);
    document.getElementById('size-txt').textContent  = fmt(n * f * avg + f * 15);
}

function fmt(bytes) {
    if (bytes < 1024)              return `~${bytes}B`;
    if (bytes < 1024 * 1024)       return `~${Math.round(bytes / 1024)}KB`;
    return `~${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

// ── Table preview ────────────────────────────────────────
function renderTable() {
    const fields = state.selectedFields;
    const shown  = state.businesses.slice(0, 50);

    document.getElementById('preview-count').textContent =
        `(showing ${shown.length} of ${state.businesses.length})`;

    document.getElementById('results-thead').innerHTML =
        '<tr>' + fields.map(f => `<th>${FIELD_LABELS[f] || f}</th>`).join('') + '</tr>';

    document.getElementById('results-tbody').innerHTML =
        shown.map(b =>
            '<tr>' + fields.map(f =>
                `<td title="${escHtml(String(b[f] || ''))}">${escHtml(String(b[f] || ''))}</td>`
            ).join('') + '</tr>'
        ).join('');
}

function escHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Export ───────────────────────────────────────────────
async function exportData(format) {
    if (!state.businesses.length) return;
    if (!state.selectedFields.length) {
        alert('Please select at least one field to export.');
        return;
    }

    try {
        const resp = await fetch('/api/export', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                businesses: state.businesses,
                fields:     state.selectedFields,
                format,
            }),
        });

        if (!resp.ok) {
            alert('Export failed. Please try again.');
            return;
        }

        const blob = await resp.blob();
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = `businesses.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch {
        alert('Export failed. Check your connection.');
    }
}

// ── Map type ─────────────────────────────────────────────
function setMapType(type) {
    if (type === currentMapType) return;
    currentMapType = type;
    if (type === 'satellite') {
        map.removeLayer(streetLayer);
        satelliteLayer.addTo(map);
    } else {
        map.removeLayer(satelliteLayer);
        streetLayer.addTo(map);
    }
    document.getElementById('btn-map-street').classList.toggle('active', type === 'street');
    document.getElementById('btn-map-satellite').classList.toggle('active', type === 'satellite');
}

// ── Init ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', initMap);
