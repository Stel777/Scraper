// ── Business Types ──────────────────────────────────────
const BUSINESS_TYPES_DATA = {
    restaurant:  { tags: [["amenity","restaurant"]], label: "Restaurant" },
    cafe:        { tags: [["amenity","cafe"]], label: "Cafe" },
    bar:         { tags: [["amenity","bar"],["amenity","pub"]], label: "Bar / Pub" },
    fast_food:   { tags: [["amenity","fast_food"]], label: "Fast Food" },
    sushi:       { tags: [["amenity","restaurant"],["amenity","fast_food"]], cuisine: "sushi", label: "Sushi" },
    pizza:       { tags: [["amenity","restaurant"],["amenity","fast_food"]], cuisine: "pizza", label: "Pizza" },
    burger:      { tags: [["amenity","fast_food"]], cuisine: "burger", label: "Burger" },
    bakery:      { tags: [["shop","bakery"]], label: "Bakery" },
    gym:         { tags: [["leisure","fitness_centre"],["leisure","sports_centre"],["amenity","gym"]], label: "Gym / Fitness" },
    pharmacy:    { tags: [["amenity","pharmacy"],["healthcare","pharmacy"]], label: "Pharmacy" },
    dentist:     { tags: [["amenity","dentist"],["healthcare","dentist"]], label: "Dentist" },
    hospital:    { tags: [["amenity","hospital"],["amenity","clinic"],["healthcare","hospital"],["healthcare","clinic"]], label: "Hospital / Clinic" },
    beauty:      { tags: [["shop","beauty"],["shop","cosmetics"]], label: "Beauty Salon" },
    hairdresser: { tags: [["shop","hairdresser"]], label: "Hairdresser" },
    barber:      { tags: [["shop","barber"]], label: "Barber" },
    supermarket: { tags: [["shop","supermarket"],["shop","convenience"]], label: "Supermarket" },
    clothes:     { tags: [["shop","clothes"],["shop","fashion"]], label: "Clothes Shop" },
    electronics: { tags: [["shop","electronics"],["shop","computer"],["shop","mobile_phone"]], label: "Electronics" },
    bank:        { tags: [["amenity","bank"]], label: "Bank" },
    hotel:       { tags: [["tourism","hotel"],["tourism","hostel"],["tourism","guest_house"],["tourism","motel"]], label: "Hotel / Hostel" },
    fuel:        { tags: [["amenity","fuel"]], label: "Gas Station" },
    school:      { tags: [["amenity","school"],["amenity","college"],["amenity","university"]], label: "School" },
    cinema:      { tags: [["amenity","cinema"]], label: "Cinema" },
    nightclub:   { tags: [["amenity","nightclub"],["amenity","music_venue"]], label: "Nightclub" },
    atm:         { tags: [["amenity","atm"],["atm","yes"]], label: "ATM" },
    laundry:     { tags: [["shop","laundry"],["shop","dry_cleaning"]], label: "Laundry" },
    books:       { tags: [["shop","books"]], label: "Bookshop" },
    florist:     { tags: [["shop","florist"]], label: "Florist" },
    optician:    { tags: [["shop","optician"]], label: "Optician" },
    veterinary:  { tags: [["amenity","veterinary"]], label: "Veterinary" },
    car_repair:  { tags: [["shop","car_repair"]], label: "Car Repair" },
    jewelry:     { tags: [["shop","jewelry"]], label: "Jewelry" },
    pet_shop:    { tags: [["shop","pet"],["shop","pet_supplies"],["shop","pets"],["shop","pet_shop"]], label: "Pet Shop" },
    car_wash:    { tags: [["amenity","car_wash"]], label: "Car Wash" },
    post_office: { tags: [["amenity","post_office"]], label: "Post Office" },
    parking:     { tags: [["amenity","parking"],["amenity","parking_space"]], label: "Parking" },
    ice_cream:   { tags: [["amenity","ice_cream"],["shop","ice_cream"]], label: "Ice Cream" },
    hardware:    { tags: [["shop","hardware"],["shop","doityourself"]], label: "Hardware Store" },
    bicycle:     { tags: [["shop","bicycle"]], label: "Bicycle Shop" },
    alcohol:     { tags: [["shop","wine"],["shop","alcohol"],["shop","beverages"]], label: "Wine / Alcohol" },
    travel:      { tags: [["shop","travel_agency"],["tourism","information"]], label: "Travel Agency" },
    massage:     { tags: [["shop","massage"],["amenity","spa"]], label: "Massage / Spa" },
    toys:        { tags: [["shop","toys"]], label: "Toy Shop" },
    sports_shop: { tags: [["shop","sports"],["shop","outdoor"]], label: "Sports Shop" },
    tattoo:      { tags: [["shop","tattoo"],["shop","piercing"]], label: "Tattoo / Piercing" },
    photography: { tags: [["shop","photo"],["shop","photography"]], label: "Photography" },
    music_shop:  { tags: [["shop","musical_instrument"],["shop","music"]], label: "Music Shop" },
    swimming:    { tags: [["leisure","swimming_pool"],["sport","swimming"],["amenity","public_bath"]], label: "Swimming Pool" },
    park:        { tags: [["leisure","park"],["leisure","garden"],["leisure","nature_reserve"]], label: "Park / Garden" },
    playground:  { tags: [["leisure","playground"]], label: "Playground" },
};

// ── Field Labels ────────────────────────────────────────
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

// ── Icons ───────────────────────────────────────────────
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
    jewelry:     '💍', barber:      '💈',  pet_shop:    '🐶',
    car_wash:    '🚿', post_office: '📮',  parking:     '🅿️',
    ice_cream:   '🍦', hardware:    '🔨',  bicycle:     '🚲',
    alcohol:     '🍷', travel:      '✈️',  massage:     '💆',
    toys:        '🧸', sports_shop: '⚽',  tattoo:      '🎨',
    photography: '📷', music_shop:  '🎸',  swimming:    '🏊',
    park:        '🌳', playground:  '🛝',
};

// ── State ───────────────────────────────────────────────
const state = {
    step: 1,
    areaType: null,
    areaData: null,
    areaName: '',
    businessKey: null,
    customValue: null,
    businesses: [],
    selectedFields: ['name', 'address', 'phone', 'website', 'opening_hours'],
};

// ── Overpass endpoints ──────────────────────────────────
const OVERPASS_ENDPOINTS = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://overpass.private.coffee/api/interpreter',
    'https://overpass.openstreetmap.ru/api/interpreter',
];

// ── OSM Helpers ─────────────────────────────────────────
function buildAddress(tags) {
    const parts = [];
    const street = tags['addr:street'] || '';
    const house  = tags['addr:housenumber'] || '';
    if (street) parts.push(`${street} ${house}`.trim());
    if (tags['addr:city'])     parts.push(tags['addr:city']);
    if (tags['addr:postcode']) parts.push(tags['addr:postcode']);
    return parts.join(', ');
}

function parseElement(el) {
    const tags = el.tags || {};
    const lat  = el.lat ?? el.center?.lat ?? '';
    const lon  = el.lon ?? el.center?.lon ?? '';
    return {
        name:          tags.name || '',
        address:       buildAddress(tags),
        phone:         tags.phone         || tags['contact:phone']   || '',
        website:       tags.website       || tags['contact:website'] || '',
        email:         tags.email         || tags['contact:email']   || '',
        opening_hours: tags.opening_hours || '',
        rating:        tags.stars         || tags.rating             || '',
        cuisine:       tags.cuisine       || '',
        latitude:      lat,
        longitude:     lon,
    };
}

function dedupKey(b) {
    return `${(b.name || '').toLowerCase().trim()}|${Math.round((parseFloat(b.latitude)  || 0) * 10000)}|${Math.round((parseFloat(b.longitude) || 0) * 10000)}`;
}

// ── Overpass Query Builder ──────────────────────────────
function buildOverpassQuery(businessKey, areaType, areaData, customValue) {
    let areaFilter;
    if (areaType === 'polygon') {
        const polyStr = areaData.map(pt => `${pt[0]} ${pt[1]}`).join(' ');
        areaFilter = `(poly:"${polyStr}")`;
    } else {
        const [s, n, w, e] = areaData;
        areaFilter = `(${s},${w},${n},${e})`;
    }

    const parts = [];

    if (businessKey === 'other') {
        if (customValue.includes('=')) {
            const idx = customValue.indexOf('=');
            const k = customValue.slice(0, idx).trim();
            const v = customValue.slice(idx + 1).trim();
            parts.push(`node["${k}"="${v}"]${areaFilter};`);
            parts.push(`way["${k}"="${v}"]${areaFilter};`);
        } else {
            const val     = customValue.replace(/ /g, '_').toLowerCase();
            const valSing = val.replace(/ches$/, 'ch').replace(/ses$/, 's').replace(/ies$/, 'y').replace(/s$/, '');
            const OSM_KEYS = ['amenity','shop','leisure','tourism','man_made','highway','barrier',
                              'landuse','building','office','craft','natural','emergency',
                              'public_transport','historic','power','railway','aeroway','military'];

            // 1. Exact value match across all common keys (both plural and singular)
            const valuesToTry = [...new Set([val, valSing])];
            for (const v of valuesToTry) {
                for (const k of OSM_KEYS) {
                    parts.push(`node["${k}"="${v}"]${areaFilter};`);
                    parts.push(`way["${k}"="${v}"]${areaFilter};`);
                }
            }

            // 2. Value regex — searches any of the major keys for a value matching the term.
            //    This catches e.g. "speed_camera" when user types "traffic camera",
            //    "surveillance" when user types "camera", "bench" for "benches", etc.
            const keyRegex  = OSM_KEYS.join('|');
            const valRegex  = val.replace(/_/g, '.?');        // traffic_camera → traffic.?camera
            const wordRegex = customValue.trim().toLowerCase() // each word as fallback
                .split(/\s+/).filter(w => w.length > 2)
                .map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');

            parts.push(`node[~"${keyRegex}"~"${valRegex}",i]${areaFilter};`);
            parts.push(`way[~"${keyRegex}"~"${valRegex}",i]${areaFilter};`);
            if (wordRegex && wordRegex !== valRegex) {
                parts.push(`node[~"${keyRegex}"~"${wordRegex}",i]${areaFilter};`);
                parts.push(`way[~"${keyRegex}"~"${wordRegex}",i]${areaFilter};`);
            }

            // 3. Name-based fallback for named POIs (parks, venues, etc.)
            const nameEsc = customValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '[ _]');
            parts.push(`node["name"~"${nameEsc}",i]${areaFilter};`);
            parts.push(`way["name"~"${nameEsc}",i]${areaFilter};`);
        }
    } else {
        const bt = BUSINESS_TYPES_DATA[businessKey];
        const cuisine = bt.cuisine || null;
        for (const [k, v] of bt.tags) {
            const cf = cuisine ? `["cuisine"="${cuisine}"]` : '';
            parts.push(`node["${k}"="${v}"]${cf}${areaFilter};`);
            parts.push(`way["${k}"="${v}"]${cf}${areaFilter};`);
        }
    }

    return `[out:json][timeout:90][maxsize:536870912];\n(\n  ${parts.join('\n  ')}\n);\nout center;`;
}

// ── Nominatim Secondary Search ──────────────────────────
async function searchNominatimPois(label, areaType, areaData) {
    let s, n, w, e;
    if (areaType === 'bbox') {
        [s, n, w, e] = areaData;
    } else {
        const lats = areaData.map(pt => pt[0]);
        const lons = areaData.map(pt => pt[1]);
        s = Math.min(...lats); n = Math.max(...lats);
        w = Math.min(...lons); e = Math.max(...lons);
    }

    try {
        const params = new URLSearchParams({
            q: label, format: 'jsonv2', limit: 50,
            bounded: 1, viewbox: `${w},${n},${e},${s}`,
            addressdetails: 1, extratags: 1,
        });
        const resp = await fetch(
            `https://nominatim.openstreetmap.org/search?${params}`,
            { headers: { 'Accept-Language': 'en' } }
        );
        if (!resp.ok) return [];
        const results = await resp.json();

        return results.map(r => {
            const tags = r.extratags || {};
            const addr = r.address   || {};
            const parts = [];
            const road  = addr.road || '';
            const house = addr.house_number || '';
            if (road) parts.push(`${road} ${house}`.trim());
            const city = addr.city || addr.town || addr.village || '';
            if (city) parts.push(city);
            if (addr.postcode) parts.push(addr.postcode);
            return {
                name:          r.name || r.display_name.split(',')[0].trim(),
                address:       parts.join(', '),
                phone:         tags.phone         || tags['contact:phone']   || '',
                website:       tags.website       || tags['contact:website'] || '',
                email:         tags.email         || tags['contact:email']   || '',
                opening_hours: tags.opening_hours || '',
                rating:        tags.stars         || tags.rating             || '',
                cuisine:       tags.cuisine       || '',
                latitude:      parseFloat(r.lat),
                longitude:     parseFloat(r.lon),
            };
        });
    } catch {
        return [];
    }
}

// ── Map ─────────────────────────────────────────────────
let map, drawnItems, bboxRect, polygonHandler, rectangleHandler;
let resultMarkers = [];
let streetLayer, satelliteLayer, darkLayer, currentMapType = 'street';

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

    darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
    });

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    (isDark ? darkLayer : streetLayer).addTo(map);

    drawnItems = new L.FeatureGroup().addTo(map);

    const polyOpts  = { color: '#2563eb', weight: 2, fillOpacity: 0.1 };
    polygonHandler   = new L.Draw.Polygon(map,   { shapeOptions: polyOpts });
    rectangleHandler = new L.Draw.Rectangle(map, { shapeOptions: polyOpts });

    map.on(L.Draw.Event.CREATED, function (e) {
        drawnItems.clearLayers();
        drawnItems.addLayer(e.layer);

        let latlngs = e.layer.getLatLngs();
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

// ── Map type ─────────────────────────────────────────────
function getBaseLayer() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return isDark ? darkLayer : streetLayer;
}

function setMapType(type) {
    if (type === currentMapType) return;
    currentMapType = type;
    if (type === 'satellite') {
        map.removeLayer(streetLayer);
        map.removeLayer(darkLayer);
        satelliteLayer.addTo(map);
    } else {
        map.removeLayer(satelliteLayer);
        getBaseLayer().addTo(map);
    }
    document.getElementById('btn-map-street').classList.toggle('active', type === 'street');
    document.getElementById('btn-map-satellite').classList.toggle('active', type === 'satellite');
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
        const params = new URLSearchParams({ q: city, format: 'json', limit: 5 });
        const resp = await fetch(
            `https://nominatim.openstreetmap.org/search?${params}`,
            { headers: { 'Accept-Language': 'en' } }
        );
        const data = await resp.json();

        if (!data.length) {
            resultsDiv.innerHTML = '<div class="badge error">Location not found</div>';
            return;
        }

        resultsDiv.innerHTML = '';
        data.forEach(r => {
            const result = {
                display_name: r.display_name,
                lat: parseFloat(r.lat),
                lon: parseFloat(r.lon),
                bbox: r.boundingbox.map(Number), // [south, north, west, east]
            };
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.textContent = r.display_name;
            div.onclick = () => selectCity(result);
            resultsDiv.appendChild(div);
        });
    } catch {
        resultsDiv.innerHTML = '<div class="badge error">Search failed. Check your connection.</div>';
    }
}

function selectCity(result) {
    if (bboxRect) { map.removeLayer(bboxRect); bboxRect = null; }
    drawnItems.clearLayers();

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

    for (let i = 1; i <= 3; i++) {
        const dot = document.getElementById(`dot-${i}`);
        dot.classList.remove('active', 'done');
        if (i < step)       dot.classList.add('done');
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
        const elapsed   = Date.now() - _progressStart;
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
        const query = buildOverpassQuery(state.businessKey, state.areaType, state.areaData, state.customValue);

        // Try Overpass endpoints in order
        let overpassElements = [];
        let overpassResponded = false;
        for (const endpoint of OVERPASS_ENDPOINTS) {
            try {
                const resp = await fetch(endpoint, {
                    method: 'POST',
                    body: query,
                    signal: AbortSignal.timeout(95000),
                });
                if (!resp.ok) continue;
                const data = await resp.json();
                overpassElements = data.elements || [];
                overpassResponded = true;
                break;
            } catch {
                continue;
            }
        }

        // Deduplicate Overpass results
        const seen = new Set();
        const businesses = [];

        for (const el of overpassElements) {
            const b = parseElement(el);
            const k = dedupKey(b);
            if (!seen.has(k)) { seen.add(k); businesses.push(b); }
        }

        // Secondary: Nominatim
        const label = state.businessKey === 'other'
            ? state.customValue
            : (BUSINESS_TYPES_DATA[state.businessKey]?.label || '');

        const nominatimResults = await searchNominatimPois(label, state.areaType, state.areaData);
        for (const b of nominatimResults) {
            const k = dedupKey(b);
            if (!seen.has(k)) { seen.add(k); businesses.push(b); }
        }

        if (!overpassResponded) {
            errorDiv.textContent = 'All map data servers are currently busy. Please wait a moment and try again.';
            errorDiv.classList.remove('hidden');
            return;
        }

        if (businesses.length === 0) {
            errorDiv.textContent = `No results found for "${state.customValue || ''}" in this area.`;
            errorDiv.classList.remove('hidden');
            return;
        }

        stopProgress();
        state.businesses = businesses;
        placeMarkers(businesses);
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
    const label = bt ? bt.label.toLowerCase() : (state.customValue || 'business');

    document.getElementById('results-summary').textContent =
        `Found ${count} ${label}${count !== 1 ? 'es' : ''} in ${state.areaName}`;

    renderFieldsList();
    updateExportSizes();
    renderTable();
    updateEnrichButton();
}

function hasIncompleteData(b) {
    return b.latitude && b.longitude && (
        !b.website || !b.phone || !b.email || !b.opening_hours
    );
}

function setEnrichStatus(text) {
    ['enrich-status', 'enrich-status-fs'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.textContent = text; el.classList.remove('hidden'); }
    });
}

function setEnrichButtons(label, disabled, hide) {
    ['btn-enrich', 'btn-enrich-fs'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.textContent = label;
        el.disabled = disabled;
        if (hide) el.classList.add('hidden');
        else el.classList.remove('hidden');
    });
}

function updateEnrichButton() {
    const missing = state.businesses.filter(hasIncompleteData);
    if (missing.length > 0) {
        setEnrichButtons(`🔍 Fill Missing Data (${missing.length})`, false, false);
        ['enrich-status', 'enrich-status-fs'].forEach(id => {
            const el = document.getElementById(id);
            if (el) { el.textContent = ''; }
        });
        document.getElementById('enrich-status').classList.add('hidden');
    } else {
        document.getElementById('btn-enrich').classList.add('hidden');
    }
}

// ── Preview Fullscreen ───────────────────────────────────
function toggleFullscreen() {
    const section = document.getElementById('preview-section');
    const btnFS   = document.getElementById('btn-fullscreen');
    const isFS    = section.classList.toggle('fullscreen');
    btnFS.textContent = isFS ? 'Minimize' : 'Fullscreen';
}

// ── Real-time cell helpers ───────────────────────────────
function markCellsLoading(busIdx, fields) {
    const row = document.querySelector(`#results-tbody tr[data-idx="${busIdx}"]`);
    if (!row) return;
    for (const f of fields) {
        const cell = row.querySelector(`td[data-field="${f}"]`);
        if (cell && !cell.textContent.trim())
            cell.innerHTML = '<span class="cell-spinner"></span>';
    }
}

function updateTableCell(busIdx, field, value) {
    const row = document.querySelector(`#results-tbody tr[data-idx="${busIdx}"]`);
    if (!row) return;
    const cell = row.querySelector(`td[data-field="${field}"]`);
    if (!cell) return;
    cell.classList.remove('cell-filled');
    cell.innerHTML = escHtml(value);
    cell.title = value;
    if (value) {
        // Force reflow so animation restarts
        void cell.offsetWidth;
        cell.classList.add('cell-filled');
    }
}

// ── Data Enrichment ───────────────────────────────────────
async function enrichMissingWebsites() {
    const missing = state.businesses.filter(hasIncompleteData);
    if (!missing.length) return;

    setEnrichButtons('Checking…', true, false);
    let enriched = 0;

    for (let i = 0; i < missing.length; i++) {
        const b      = missing[i];
        const busIdx = state.businesses.indexOf(b);

        setEnrichStatus(`Searching ${i + 1} of ${missing.length}: ${b.name || ''}…`);

        const emptyFields = ['website', 'phone', 'email'].filter(f => !b[f]);
        markCellsLoading(busIdx, emptyFields);

        try {
            const resp = await fetch('/api/enrich', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({
                    name:    b.name,
                    address: b.address,
                    lat:     b.latitude,
                    lon:     b.longitude,
                    current: { website: b.website, phone: b.phone, email: b.email },
                }),
            });

            if (resp.ok) {
                const data = await resp.json();
                let filledAny = false;

                for (const field of ['website', 'phone', 'email']) {
                    if (!b[field] && data[field]) {
                        b[field] = data[field];
                        updateTableCell(busIdx, field, data[field]);
                        filledAny = true;
                    } else if (!b[field]) {
                        updateTableCell(busIdx, field, '');
                    }
                }

                if (filledAny) enriched++;
            } else {
                emptyFields.forEach(f => updateTableCell(busIdx, f, ''));
            }
        } catch {
            emptyFields.forEach(f => updateTableCell(busIdx, f, ''));
        }
    }

    const remaining = state.businesses.filter(hasIncompleteData);
    const summary = enriched > 0
        ? `✓ Filled data for ${enriched} business${enriched !== 1 ? 'es' : ''}!`
        : 'No data found — businesses may not have a public web presence.';
    setEnrichStatus(summary);

    if (remaining.length > 0) {
        setEnrichButtons(`🔍 Fill Missing Data (${remaining.length})`, false, false);
    } else {
        document.getElementById('btn-enrich').classList.add('hidden');
        document.getElementById('btn-enrich-fs').classList.add('hidden');
    }

    updateExportSizes();
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
        lbl.htmlFor     = `field-${key}`;
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
    const avg = 20;

    document.getElementById('size-csv').textContent  = fmt(n * f * avg + f * 15);
    document.getElementById('size-xlsx').textContent = fmt(n * f * 12 + 10240);
    document.getElementById('size-txt').textContent  = fmt(n * f * avg + f * 15);
}

function fmt(bytes) {
    if (bytes < 1024)        return `~${bytes}B`;
    if (bytes < 1024 * 1024) return `~${Math.round(bytes / 1024)}KB`;
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
        shown.map((b, i) =>
            `<tr data-idx="${i}">` + fields.map(f =>
                `<td data-field="${f}" title="${escHtml(String(b[f] || ''))}">${escHtml(String(b[f] || ''))}</td>`
            ).join('') + '</tr>'
        ).join('');
}

function escHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── Export ───────────────────────────────────────────────
function triggerDownload(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function exportData(format) {
    if (!state.businesses.length) return;
    if (!state.selectedFields.length) {
        alert('Please select at least one field to export.');
        return;
    }

    const fields  = state.selectedFields;
    const headers = fields.map(f => FIELD_LABELS[f] || f);
    const rows    = state.businesses.map(b => fields.map(f => String(b[f] || '')));

    if (format === 'csv') {
        const lines = [headers, ...rows].map(row =>
            row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')
        );
        triggerDownload('\uFEFF' + lines.join('\n'), 'businesses.csv', 'text/csv;charset=utf-8');
    }

    else if (format === 'txt') {
        const lines = [headers, ...rows].map(row => row.join('\t'));
        triggerDownload(lines.join('\n'), 'businesses.txt', 'text/plain;charset=utf-8');
    }

    else if (format === 'xlsx') {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        // Column widths
        ws['!cols'] = headers.map((h, i) => ({
            wch: Math.min(50, Math.max(h.length, ...rows.map(r => (r[i] || '').length)) + 2)
        }));
        XLSX.utils.book_append_sheet(wb, ws, 'Businesses');
        XLSX.writeFile(wb, 'businesses.xlsx');
    }
}

// ── Dark mode ─────────────────────────────────────────────
function toggleDark() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    document.getElementById('dark-toggle').textContent = next === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('theme', next);

    // Swap map tile only when not on satellite
    if (currentMapType !== 'satellite' && map) {
        if (next === 'dark') {
            map.removeLayer(streetLayer);
            darkLayer.addTo(map);
        } else {
            map.removeLayer(darkLayer);
            streetLayer.addTo(map);
        }
    }
}

// ── Init ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    document.getElementById('dark-toggle').textContent = saved === 'dark' ? '☀️' : '🌙';
    initMap();
});
