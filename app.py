from flask import Flask, render_template, request, jsonify, send_file
import requests
import re
import io
import csv
import openpyxl
from openpyxl.styles import Font, PatternFill
from urllib.parse import unquote, urljoin, urlparse
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

app = Flask(__name__)

BUSINESS_TYPES = {
    "restaurant":  {"tags": [("amenity", "restaurant")], "label": "Restaurant"},
    "cafe":        {"tags": [("amenity", "cafe")], "label": "Cafe"},
    "bar":         {"tags": [("amenity", "bar"), ("amenity", "pub")], "label": "Bar / Pub"},
    "fast_food":   {"tags": [("amenity", "fast_food")], "label": "Fast Food"},
    "sushi":       {"tags": [("amenity", "restaurant"), ("amenity", "fast_food")], "cuisine": "sushi", "label": "Sushi"},
    "pizza":       {"tags": [("amenity", "restaurant"), ("amenity", "fast_food")], "cuisine": "pizza", "label": "Pizza"},
    "burger":      {"tags": [("amenity", "fast_food")], "cuisine": "burger", "label": "Burger"},
    "bakery":      {"tags": [("shop", "bakery")], "label": "Bakery"},
    "gym":          {"tags": [("leisure", "fitness_centre"), ("leisure", "sports_centre"), ("amenity", "gym")], "label": "Gym / Fitness"},
    "pharmacy":     {"tags": [("amenity", "pharmacy"), ("healthcare", "pharmacy")], "label": "Pharmacy"},
    "dentist":      {"tags": [("amenity", "dentist"), ("healthcare", "dentist")], "label": "Dentist"},
    "hospital":     {"tags": [("amenity", "hospital"), ("amenity", "clinic"), ("healthcare", "hospital"), ("healthcare", "clinic")], "label": "Hospital / Clinic"},
    "beauty":       {"tags": [("shop", "beauty"), ("shop", "cosmetics")], "label": "Beauty Salon"},
    "hairdresser":  {"tags": [("shop", "hairdresser")], "label": "Hairdresser"},
    "barber":       {"tags": [("shop", "barber")], "label": "Barber"},
    "supermarket":  {"tags": [("shop", "supermarket"), ("shop", "convenience")], "label": "Supermarket"},
    "clothes":      {"tags": [("shop", "clothes"), ("shop", "fashion")], "label": "Clothes Shop"},
    "electronics":  {"tags": [("shop", "electronics"), ("shop", "computer"), ("shop", "mobile_phone")], "label": "Electronics"},
    "bank":         {"tags": [("amenity", "bank")], "label": "Bank"},
    "hotel":        {"tags": [("tourism", "hotel"), ("tourism", "hostel"), ("tourism", "guest_house"), ("tourism", "motel")], "label": "Hotel / Hostel"},
    "fuel":         {"tags": [("amenity", "fuel")], "label": "Gas Station"},
    "school":       {"tags": [("amenity", "school"), ("amenity", "college"), ("amenity", "university")], "label": "School"},
    "cinema":       {"tags": [("amenity", "cinema")], "label": "Cinema"},
    "nightclub":    {"tags": [("amenity", "nightclub"), ("amenity", "music_venue")], "label": "Nightclub"},
    "atm":          {"tags": [("amenity", "atm"), ("atm", "yes")], "label": "ATM"},
    "laundry":      {"tags": [("shop", "laundry"), ("shop", "dry_cleaning")], "label": "Laundry"},
    "books":        {"tags": [("shop", "books")], "label": "Bookshop"},
    "florist":      {"tags": [("shop", "florist")], "label": "Florist"},
    "optician":     {"tags": [("shop", "optician")], "label": "Optician"},
    "veterinary":   {"tags": [("amenity", "veterinary")], "label": "Veterinary"},
    "car_repair":   {"tags": [("shop", "car_repair")], "label": "Car Repair"},
    "jewelry":      {"tags": [("shop", "jewelry")], "label": "Jewelry"},
    "pet_shop":     {"tags": [("shop", "pet"), ("shop", "pet_supplies"), ("shop", "pets"), ("shop", "pet_shop")], "label": "Pet Shop"},
    "car_wash":     {"tags": [("amenity", "car_wash")], "label": "Car Wash"},
    "post_office":  {"tags": [("amenity", "post_office")], "label": "Post Office"},
    "parking":      {"tags": [("amenity", "parking"), ("amenity", "parking_space")], "label": "Parking"},
    "ice_cream":    {"tags": [("amenity", "ice_cream"), ("shop", "ice_cream")], "label": "Ice Cream"},
    "hardware":     {"tags": [("shop", "hardware"), ("shop", "doityourself")], "label": "Hardware Store"},
    "bicycle":      {"tags": [("shop", "bicycle")], "label": "Bicycle Shop"},
    "alcohol":      {"tags": [("shop", "wine"), ("shop", "alcohol"), ("shop", "beverages")], "label": "Wine / Alcohol"},
    "travel":       {"tags": [("shop", "travel_agency"), ("tourism", "information")], "label": "Travel Agency"},
    "massage":      {"tags": [("shop", "massage"), ("amenity", "spa")], "label": "Massage / Spa"},
    "toys":         {"tags": [("shop", "toys")], "label": "Toy Shop"},
    "sports_shop":  {"tags": [("shop", "sports"), ("shop", "outdoor")], "label": "Sports Shop"},
    "tattoo":       {"tags": [("shop", "tattoo"), ("shop", "piercing")], "label": "Tattoo / Piercing"},
    "photography":  {"tags": [("shop", "photo"), ("shop", "photography")], "label": "Photography"},
    "music_shop":   {"tags": [("shop", "musical_instrument"), ("shop", "music")], "label": "Music Shop"},
    "swimming":     {"tags": [("leisure", "swimming_pool"), ("sport", "swimming"), ("amenity", "public_bath")], "label": "Swimming Pool"},
    "park":         {"tags": [("leisure", "park"), ("leisure", "garden"), ("leisure", "nature_reserve")], "label": "Park / Garden"},
    "playground":   {"tags": [("leisure", "playground")], "label": "Playground"},
}

FIELD_LABELS = {
    "name":          "Business Name",
    "address":       "Address",
    "phone":         "Phone",
    "website":       "Website",
    "email":         "Email",
    "opening_hours": "Opening Hours",
    "rating":        "Rating",
    "cuisine":       "Cuisine",
    "latitude":      "Latitude",
    "longitude":     "Longitude",
}


def build_address(tags):
    parts = []
    street = tags.get("addr:street", "")
    housenumber = tags.get("addr:housenumber", "")
    if street:
        parts.append(f"{street} {housenumber}".strip())
    if tags.get("addr:city"):
        parts.append(tags["addr:city"])
    if tags.get("addr:postcode"):
        parts.append(tags["addr:postcode"])
    return ", ".join(parts)


def parse_element(element):
    tags = element.get("tags", {})
    lat = element.get("lat") or element.get("center", {}).get("lat", "")
    lon = element.get("lon") or element.get("center", {}).get("lon", "")
    return {
        "name":          tags.get("name", ""),
        "address":       build_address(tags),
        "phone":         tags.get("phone", tags.get("contact:phone", "")),
        "website":       tags.get("website", tags.get("contact:website", "")),
        "email":         tags.get("email", tags.get("contact:email", "")),
        "opening_hours": tags.get("opening_hours", ""),
        "rating":        tags.get("stars", tags.get("rating", "")),
        "cuisine":       tags.get("cuisine", ""),
        "latitude":      lat,
        "longitude":     lon,
    }


def search_nominatim_pois(label, area_type, area_data):
    """Secondary POI search via Nominatim — catches places Overpass may miss."""
    if area_type == "bbox":
        s, n, w, e = area_data
    else:
        lats = [pt[0] for pt in area_data]
        lons = [pt[1] for pt in area_data]
        s, n, w, e = min(lats), max(lats), min(lons), max(lons)

    try:
        resp = requests.get(
            "https://nominatim.openstreetmap.org/search",
            params={
                "q": label,
                "format": "jsonv2",
                "limit": 50,
                "bounded": 1,
                "viewbox": f"{w},{n},{e},{s}",  # west,north,east,south
                "addressdetails": 1,
                "extratags": 1,
            },
            headers={"User-Agent": "Scraper/1.0 (business-data-tool)"},
            timeout=15,
        )
        resp.raise_for_status()
    except requests.RequestException:
        return []

    results = []
    for r in resp.json():
        tags = r.get("extratags") or {}
        addr = r.get("address") or {}

        parts = []
        road = addr.get("road", "")
        house = addr.get("house_number", "")
        if road:
            parts.append(f"{road} {house}".strip())
        city = addr.get("city") or addr.get("town") or addr.get("village") or ""
        if city:
            parts.append(city)
        if addr.get("postcode"):
            parts.append(addr["postcode"])

        name = r.get("name") or r.get("display_name", "").split(",")[0].strip()

        results.append({
            "name":          name,
            "address":       ", ".join(parts),
            "phone":         tags.get("phone", tags.get("contact:phone", "")),
            "website":       tags.get("website", tags.get("contact:website", "")),
            "email":         tags.get("email", tags.get("contact:email", "")),
            "opening_hours": tags.get("opening_hours", ""),
            "rating":        tags.get("stars", tags.get("rating", "")),
            "cuisine":       tags.get("cuisine", ""),
            "latitude":      float(r["lat"]),
            "longitude":     float(r["lon"]),
        })
    return results


@app.route("/")
def index():
    return render_template("index.html", business_types=BUSINESS_TYPES)


@app.route("/api/geocode", methods=["POST"])
def geocode():
    city = request.json.get("city", "").strip()
    if not city:
        return jsonify({"error": "No location provided"}), 400

    try:
        resp = requests.get(
            "https://nominatim.openstreetmap.org/search",
            params={"q": city, "format": "json", "limit": 5},
            headers={"User-Agent": "Scraper/1.0 (business-data-tool)"},
            timeout=10,
        )
        resp.raise_for_status()
    except requests.RequestException as e:
        return jsonify({"error": f"Geocoding failed: {e}"}), 502

    results = resp.json()
    if not results:
        return jsonify({"error": "Location not found"}), 404

    out = []
    for r in results:
        out.append({
            "display_name": r["display_name"],
            "lat": float(r["lat"]),
            "lon": float(r["lon"]),
            "bbox": [float(x) for x in r["boundingbox"]],  # [south, north, west, east]
        })
    return jsonify({"results": out})


@app.route("/api/search", methods=["POST"])
def search():
    data = request.json
    business_key = data.get("business_type", "restaurant")
    area_type = data.get("area_type")   # "polygon" or "bbox"
    area_data = data.get("area_data")

    if not area_type or not area_data:
        return jsonify({"error": "No area selected"}), 400

    # Build area filter string
    if area_type == "polygon":
        poly_str = " ".join([f"{pt[0]} {pt[1]}" for pt in area_data])
        area_filter = f'(poly:"{poly_str}")'
    else:
        s, n, w, e = area_data
        area_filter = f"({s},{w},{n},{e})"

    # Build query parts (node + way for each tag pair)
    parts = []

    if business_key == "other":
        custom_value = data.get("custom_value", "").strip()
        if not custom_value:
            return jsonify({"error": "Please enter a search term"}), 400
        if "=" in custom_value:
            tag_key, tag_val = custom_value.split("=", 1)
            tag_pairs = [(tag_key.strip(), tag_val.strip())]
        else:
            val = custom_value.replace(" ", "_").lower()
            tag_pairs = [("amenity", val), ("shop", val), ("leisure", val), ("tourism", val)]
        for tag_key, tag_val in tag_pairs:
            parts.append(f'node["{tag_key}"="{tag_val}"]{area_filter};')
            parts.append(f'way["{tag_key}"="{tag_val}"]{area_filter};')
    else:
        bt = BUSINESS_TYPES.get(business_key)
        if not bt:
            return jsonify({"error": "Unknown business type"}), 400
        cuisine = bt.get("cuisine")
        for tag_key, tag_val in bt["tags"]:
            cuisine_filter = f'["cuisine"="{cuisine}"]' if cuisine else ""
            parts.append(f'node["{tag_key}"="{tag_val}"]{cuisine_filter}{area_filter};')
            parts.append(f'way["{tag_key}"="{tag_val}"]{cuisine_filter}{area_filter};')

    query = f"""[out:json][timeout:90][maxsize:536870912];
(
  {"".join(parts)}
);
out center;"""

    overpass_endpoints = [
        "https://overpass-api.de/api/interpreter",
        "https://overpass.kumi.systems/api/interpreter",
        "https://overpass.private.coffee/api/interpreter",
        "https://overpass.openstreetmap.ru/api/interpreter",
    ]

    resp = None
    last_error = None
    for endpoint in overpass_endpoints:
        try:
            resp = requests.post(endpoint, data=query, timeout=95)
            resp.raise_for_status()
            break
        except requests.RequestException as e:
            last_error = e
            continue

    if resp is None or not resp.ok:
        return jsonify({"error": "All map data servers are currently busy. Please wait a moment and try again."}), 502

    elements = resp.json().get("elements", [])

    # Dedup key: (lowercase name, lat rounded to ~10m, lon rounded to ~10m)
    def dedup_key(b):
        return (
            (b["name"] or "").lower().strip(),
            round(float(b["latitude"]  or 0), 4),
            round(float(b["longitude"] or 0), 4),
        )

    seen = set()
    businesses = []
    for el in elements:
        b = parse_element(el)
        k = dedup_key(b)
        if k not in seen:
            seen.add(k)
            businesses.append(b)

    # Secondary source: Nominatim POI search
    label = BUSINESS_TYPES[business_key]["label"] if business_key != "other" else data.get("custom_value", "")
    for b in search_nominatim_pois(label, area_type, area_data):
        k = dedup_key(b)
        if k not in seen:
            seen.add(k)
            businesses.append(b)

    return jsonify({"businesses": businesses, "count": len(businesses)})


@app.route("/api/export", methods=["POST"])
def export():
    data = request.json
    businesses = data.get("businesses", [])
    fields = data.get("fields", [])
    fmt = data.get("format", "csv")

    if not businesses:
        return jsonify({"error": "No data to export"}), 400
    if not fields:
        return jsonify({"error": "No fields selected"}), 400

    headers = [FIELD_LABELS.get(f, f) for f in fields]
    rows = [[str(b.get(f, "") or "") for f in fields] for b in businesses]

    if fmt == "csv":
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(headers)
        writer.writerows(rows)
        return send_file(
            io.BytesIO(output.getvalue().encode("utf-8-sig")),
            mimetype="text/csv",
            as_attachment=True,
            download_name="businesses.csv",
        )

    elif fmt == "xlsx":
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Businesses"

        header_fill = PatternFill("solid", fgColor="2563EB")
        header_font = Font(bold=True, color="FFFFFF")
        ws.append(headers)
        for cell in ws[1]:
            cell.fill = header_fill
            cell.font = header_font

        for row in rows:
            ws.append(row)

        for col in ws.columns:
            max_len = max((len(str(c.value or "")) for c in col), default=10)
            ws.column_dimensions[col[0].column_letter].width = min(max_len + 2, 50)

        output = io.BytesIO()
        wb.save(output)
        output.seek(0)
        return send_file(
            output,
            mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            as_attachment=True,
            download_name="businesses.xlsx",
        )

    elif fmt == "txt":
        lines = ["\t".join(headers)]
        for row in rows:
            lines.append("\t".join(row))
        content = "\n".join(lines)
        return send_file(
            io.BytesIO(content.encode("utf-8")),
            mimetype="text/plain",
            as_attachment=True,
            download_name="businesses.txt",
        )

    return jsonify({"error": "Invalid format"}), 400


BROWSER_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}

SKIP_DOMAINS = [
    "facebook.com", "instagram.com", "twitter.com", "x.com",
    "linkedin.com", "youtube.com", "tiktok.com", "pinterest.com",
    "yelp.com", "tripadvisor.com", "foursquare.com", "zomato.com",
    "google.com", "maps.google", "wikipedia.org", "wikidata.org",
    "booking.com", "expedia.com", "openstreetmap.org",
    "duckduckgo.com", "bing.com", "yahoo.com",
]

FAKE_EMAIL_WORDS = [
    "example", "domain", "email", "yourname", "user@", "sentry",
    "schema", "wixpress", "squarespace", "wordpress", "cloudflare",
    "noreply", "no-reply", "support@sentry", "privacy@",
]


def ddg_search_website(query):
    """Search DuckDuckGo HTML and return the first non-social result URL."""
    try:
        resp = requests.get(
            "https://html.duckduckgo.com/html/",
            params={"q": query},
            headers=BROWSER_HEADERS,
            timeout=10,
        )
        resp.raise_for_status()
        urls = re.findall(r'uddg=(https?[^&"]+)', resp.text)
        for raw in urls:
            url = unquote(raw)
            if not any(s in url.lower() for s in SKIP_DOMAINS):
                return url
    except Exception:
        pass
    return ""


def scrape_contact(url):
    """Fetch a page and extract the first email and phone number found."""
    try:
        r = requests.get(url, headers=BROWSER_HEADERS, timeout=8, verify=False)
        r.raise_for_status()
        text = r.text[:80000]

        emails = re.findall(
            r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}", text
        )
        emails = [
            e for e in emails
            if not any(w in e.lower() for w in FAKE_EMAIL_WORDS)
            and len(e) < 80
        ]

        phones = re.findall(
            r"(?:\+\d{1,3}[\s.\-]?)?(?:\(?\d{2,4}\)?[\s.\-]?){2,}\d{3,4}", text
        )
        phones = [
            p.strip() for p in phones
            if len(re.sub(r"\D", "", p)) >= 7
        ]

        return emails[0] if emails else "", phones[0] if phones else ""
    except Exception:
        return "", ""


@app.route("/api/enrich", methods=["POST"])
def enrich():
    data     = request.json or {}
    name     = data.get("name", "").strip()
    address  = data.get("address", "").strip()
    current  = data.get("current", {})   # fields already filled — skip re-fetching

    if not name:
        return jsonify({}), 400

    result = {"website": "", "phone": "", "email": ""}

    # ── Step 1: find the website ──────────────────────────
    website = current.get("website", "")
    if not website:
        query   = f'"{name}" {address} official website'
        website = ddg_search_website(query)
        # Retry with just the name if nothing found
        if not website:
            website = ddg_search_website(f'"{name}" contact')
        result["website"] = website

    # ── Step 2: scrape website for email / phone ──────────
    if website and (not current.get("email") or not current.get("phone")):
        email, phone = scrape_contact(website)

        # Try /contact and /contact-us if main page came up empty
        if not email and not phone:
            base = website.rstrip("/")
            parsed = urlparse(base)
            origin = f"{parsed.scheme}://{parsed.netloc}"
            for path in ["/contact", "/contact-us", "/about", "/about-us"]:
                e, p = scrape_contact(origin + path)
                if e or p:
                    email, phone = e, p
                    break

        if not current.get("email"):
            result["email"] = email
        if not current.get("phone"):
            result["phone"] = phone

    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
