// ========== ADVANCED INTERACTIVE MAPS APPLICATION ==========
// Author: wondrv
// Features: Modern UI, Advanced Search, Routing, Drawing Tools, Location Services, Sharing
// ============================================================

class AdvancedMaps {
  constructor() {
    this.map = null;
    this.currentLocation = null;
    this.routingControl = null;
    this.drawnItems = null;
    this.drawControl = null;
    this.markers = [];
    this.savedPlaces = JSON.parse(localStorage.getItem("savedPlaces")) || [];
    this.savedDrawings =
      JSON.parse(localStorage.getItem("savedDrawings")) || [];
    this.searchHistory =
      JSON.parse(localStorage.getItem("searchHistory")) || [];
    this.currentLocationMarker = null;
    this.isDrawingMode = false;
    this.currentTool = null;

    this.init();
  }

  async init() {
    this.showLoadingScreen();
    await this.loadApp();
    this.initializeMap();
    this.setupEventListeners();
    this.detectUserLocation();
    this.hideLoadingScreen();
  }

  showLoadingScreen() {
    document.getElementById("loadingScreen").style.display = "flex";
  }

  hideLoadingScreen() {
    setTimeout(() => {
      document.getElementById("loadingScreen").style.display = "none";
      document.getElementById("app").style.display = "flex";
    }, 2000);
  }

  async loadApp() {
    // Simulate app loading
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }

  initializeMap() {
    // Initialize Leaflet map
    this.map = L.map("map", {
      zoomControl: false,
      attributionControl: false,
    }).setView([40.7128, -74.006], 13);

    // Add zoom control in bottom right
    L.control
      .zoom({
        position: "bottomright",
      })
      .addTo(this.map);

    // Add attribution
    L.control
      .attribution({
        position: "bottomright",
        prefix: "Advanced Maps",
      })
      .addTo(this.map);

    // Map layers
    this.mapLayers = {
      streets: L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution: "© OpenStreetMap contributors",
        }
      ),
      satellite: L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "© Esri",
        }
      ),
      terrain: L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenTopoMap contributors",
      }),
      dark: L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution: "© CartoDB",
        }
      ),
    };

    // Set default layer
    this.mapLayers.streets.addTo(this.map);
    this.currentMapStyle = "streets";

    // Initialize drawing
    this.initializeDrawing();

    // Map events
    this.map.on("click", (e) => this.onMapClick(e));
    this.map.on("moveend", () => this.updateLocationInfo());
  }

  initializeDrawing() {
    this.drawnItems = new L.FeatureGroup();
    this.map.addLayer(this.drawnItems);

    this.drawControl = new L.Control.Draw({
      position: "topright",
      draw: {
        polygon: true,
        polyline: true,
        rectangle: true,
        circle: true,
        marker: true,
      },
      edit: {
        featureGroup: this.drawnItems,
        remove: true,
      },
    });

    // Drawing events
    this.map.on(L.Draw.Event.CREATED, (e) => {
      this.drawnItems.addLayer(e.layer);
      this.saveDrawingsToStorage();
    });

    this.map.on(L.Draw.Event.EDITED, () => {
      this.saveDrawingsToStorage();
    });

    this.map.on(L.Draw.Event.DELETED, () => {
      this.saveDrawingsToStorage();
    });

    // Load saved drawings
    this.loadDrawingsFromStorage();
  }

  setupEventListeners() {
    // Search
    document
      .getElementById("searchBtn")
      .addEventListener("click", () => this.performSearch());
    document.getElementById("searchInput").addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.performSearch();
    });

    // Header buttons
    document
      .getElementById("myLocationBtn")
      .addEventListener("click", () => this.goToCurrentLocation());
    document
      .getElementById("layersBtn")
      .addEventListener("click", () => this.showPanel("layers"));
    document
      .getElementById("drawingBtn")
      .addEventListener("click", () => this.showPanel("drawing"));
    document
      .getElementById("shareBtn")
      .addEventListener("click", () => this.showShareModal());
    document
      .getElementById("settingsBtn")
      .addEventListener("click", () => this.showSettingsModal());
    document
      .getElementById("themeToggle")
      .addEventListener("click", () => this.toggleTheme());

    // Quick actions
    document
      .getElementById("navigationToggle")
      .addEventListener("click", () => this.showPanel("navigation"));
    document
      .getElementById("placesToggle")
      .addEventListener("click", () => this.showPanel("places"));
    document
      .getElementById("measureBtn")
      .addEventListener("click", () => this.toggleMeasureMode());
    document
      .getElementById("fullscreenBtn")
      .addEventListener("click", () => this.toggleFullscreen());

    // Panel close
    document
      .getElementById("closePanelBtn")
      .addEventListener("click", () => this.hidePanel());

    // Route controls
    document
      .getElementById("routeBtn")
      .addEventListener("click", () => this.calculateRoute());
    document
      .getElementById("clearRouteBtn")
      .addEventListener("click", () => this.clearRoute());

    // Location buttons in route inputs
    document.querySelectorAll(".location-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const target = e.currentTarget.dataset.target;
        this.selectLocationForRoute(target);
      });
    });

    // Map style changes
    document.querySelectorAll('input[name="mapStyle"]').forEach((radio) => {
      radio.addEventListener("change", (e) =>
        this.changeMapStyle(e.target.value)
      );
    });

    // Route type changes
    document.querySelectorAll('input[name="routeType"]').forEach((radio) => {
      radio.addEventListener("change", () => this.calculateRoute());
    });

    // Drawing tools
    document.querySelectorAll(".tool-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const tool = e.currentTarget.dataset.tool;
        this.selectDrawingTool(tool);
      });
    });

    // Drawing actions
    document
      .getElementById("saveDrawingBtn")
      .addEventListener("click", () => this.saveCurrentDrawing());
    document
      .getElementById("clearDrawingBtn")
      .addEventListener("click", () => this.clearAllDrawings());

    // Location info actions
    document
      .getElementById("saveLocationBtn")
      .addEventListener("click", () => this.saveCurrentLocation());
    document
      .getElementById("shareLocationBtn")
      .addEventListener("click", () => this.shareCurrentLocation());

    // Modal close buttons
    document.querySelectorAll(".modal-close").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.currentTarget.closest(".modal").classList.remove("show");
      });
    });

    // Share actions
    document
      .getElementById("copyUrlBtn")
      .addEventListener("click", () => this.copyShareUrl());
    document.querySelectorAll(".share-btn-social").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const platform = e.currentTarget.dataset.platform;
        this.shareToSocial(platform);
      });
    });

    // Settings
    document
      .getElementById("clearDataBtn")
      .addEventListener("click", () => this.clearAllData());

    // Close modals on backdrop click
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("show");
        }
      });
    });

    // Overlay toggles
    document
      .getElementById("trafficOverlay")
      .addEventListener("change", (e) => {
        this.toggleTrafficOverlay(e.target.checked);
      });
    document
      .getElementById("weatherOverlay")
      .addEventListener("change", (e) => {
        this.toggleWeatherOverlay(e.target.checked);
      });
    document
      .getElementById("transitOverlay")
      .addEventListener("change", (e) => {
        this.toggleTransitOverlay(e.target.checked);
      });
  }

  async performSearch() {
    const query = document.getElementById("searchInput").value.trim();
    if (!query) return;

    this.showStatus("Searching...");

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5`
      );
      const results = await response.json();

      if (results.length > 0) {
        const result = results[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);

        this.map.setView([lat, lng], 15);

        // Add search result marker
        const marker = L.marker([lat, lng])
          .addTo(this.map)
          .bindPopup(
            `
            <div class="search-result-popup">
              <h4>${result.display_name}</h4>
              <div class="popup-actions">
                <button onclick="advancedMaps.savePlace('${result.display_name}', ${lat}, ${lng})" class="save-btn">
                  <i class="fas fa-bookmark"></i> Save
                </button>
                <button onclick="advancedMaps.shareLocation(${lat}, ${lng})" class="share-btn">
                  <i class="fas fa-share"></i> Share
                </button>
              </div>
            </div>
          `
          )
          .openPopup();

        this.markers.push(marker);
        this.addToSearchHistory(query);
        this.showStatus("Location found!", "success");
      } else {
        this.showStatus("No results found", "error");
      }
    } catch (error) {
      this.showStatus("Search failed", "error");
      console.error("Search error:", error);
    }
  }

  detectUserLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          if (this.currentLocationMarker) {
            this.map.removeLayer(this.currentLocationMarker);
          }

          this.currentLocationMarker = L.circleMarker(
            [this.currentLocation.lat, this.currentLocation.lng],
            {
              color: "#3b82f6",
              fillColor: "#3b82f6",
              fillOpacity: 0.8,
              radius: 8,
            }
          ).addTo(this.map);

          this.map.setView(
            [this.currentLocation.lat, this.currentLocation.lng],
            13
          );
          this.showStatus("Location detected!", "success");
        },
        (error) => {
          console.error("Geolocation error:", error);
          this.showStatus("Could not detect location", "warning");
        }
      );
    }
  }

  goToCurrentLocation() {
    if (this.currentLocation) {
      this.map.setView(
        [this.currentLocation.lat, this.currentLocation.lng],
        16
      );
      this.showStatus("Centered on your location", "success");
    } else {
      this.detectUserLocation();
    }
  }

  showPanel(panelType) {
    // Update panel title and show appropriate content
    const titles = {
      navigation: "Navigation",
      layers: "Map Layers",
      drawing: "Drawing Tools",
      places: "Places",
    };

    document.getElementById("panelTitle").textContent = titles[panelType];

    // Hide all panels
    document.querySelectorAll(".panel-section").forEach((panel) => {
      panel.classList.remove("active");
    });

    // Show selected panel
    document.getElementById(`${panelType}Panel`).classList.add("active");

    // Update quick action buttons
    document.querySelectorAll(".quick-btn").forEach((btn) => {
      btn.classList.remove("active");
    });

    if (panelType === "navigation") {
      document.getElementById("navigationToggle").classList.add("active");
    } else if (panelType === "places") {
      document.getElementById("placesToggle").classList.add("active");
    }

    // Show side panel
    document.getElementById("sidePanel").classList.remove("hidden");
  }

  hidePanel() {
    document.getElementById("sidePanel").classList.add("hidden");
    document.querySelectorAll(".quick-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
  }

  async calculateRoute() {
    const from = document.getElementById("fromInput").value.trim();
    const to = document.getElementById("toInput").value.trim();

    if (!from || !to) {
      this.showStatus(
        "Please enter both starting point and destination",
        "warning"
      );
      return;
    }

    this.showStatus("Calculating route...");

    try {
      // Geocode addresses
      const fromCoords = await this.geocodeAddress(from);
      const toCoords = await this.geocodeAddress(to);

      if (!fromCoords || !toCoords) {
        this.showStatus("Could not find one or more locations", "error");
        return;
      }

      // Clear existing route
      if (this.routingControl) {
        this.map.removeControl(this.routingControl);
      }

      // Get selected route type
      const routeType = document.querySelector(
        'input[name="routeType"]:checked'
      ).value;

      // Create routing control
      this.routingControl = L.Routing.control({
        waypoints: [
          L.latLng(fromCoords.lat, fromCoords.lng),
          L.latLng(toCoords.lat, toCoords.lng),
        ],
        routeWhileDragging: true,
        geocoder: L.Control.Geocoder.nominatim(),
        router: L.Routing.osrmv1({
          serviceUrl: `https://router.project-osrm.org/route/v1/${routeType}`,
        }),
        lineOptions: {
          styles: [{ color: "#3b82f6", weight: 6, opacity: 0.8 }],
        },
        createMarker: (i, waypoint, n) => {
          const marker = L.marker(waypoint.latLng, {
            icon: L.divIcon({
              className: "route-marker",
              html: `<div class="route-marker-content">${
                i === 0 ? "A" : "B"
              }</div>`,
              iconSize: [30, 30],
            }),
          });
          return marker;
        },
      }).addTo(this.map);

      this.routingControl.on("routesfound", (e) => {
        const route = e.routes[0];
        const distance = (route.summary.totalDistance / 1000).toFixed(1);
        const time = Math.round(route.summary.totalTime / 60);

        document.getElementById("routeInfo").innerHTML = `
          <div class="route-summary">
            <div class="route-stat">
              <i class="fas fa-route"></i>
              <span>${distance} km</span>
            </div>
            <div class="route-stat">
              <i class="fas fa-clock"></i>
              <span>${time} min</span>
            </div>
          </div>
        `;
        document.getElementById("routeInfo").style.display = "block";
        document.getElementById("clearRouteBtn").style.display = "block";

        this.showStatus("Route calculated!", "success");
      });
    } catch (error) {
      this.showStatus("Failed to calculate route", "error");
      console.error("Routing error:", error);
    }
  }

  clearRoute() {
    if (this.routingControl) {
      this.map.removeControl(this.routingControl);
      this.routingControl = null;
    }

    document.getElementById("fromInput").value = "";
    document.getElementById("toInput").value = "";
    document.getElementById("routeInfo").style.display = "none";
    document.getElementById("clearRouteBtn").style.display = "none";

    this.showStatus("Route cleared", "success");
  }

  async geocodeAddress(address) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}&limit=1`
      );
      const results = await response.json();

      if (results.length > 0) {
        return {
          lat: parseFloat(results[0].lat),
          lng: parseFloat(results[0].lon),
        };
      }
      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  }

  selectLocationForRoute(target) {
    this.showStatus(
      `Click on the map to select ${
        target === "from" ? "starting point" : "destination"
      }`,
      "info"
    );

    this.map.once("click", (e) => {
      const input = document.getElementById(`${target}Input`);
      input.value = `${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`;
      this.showStatus("Location selected!", "success");
    });
  }

  changeMapStyle(style) {
    // Remove current layer
    this.map.removeLayer(this.mapLayers[this.currentMapStyle]);

    // Add new layer
    this.mapLayers[style].addTo(this.map);
    this.currentMapStyle = style;

    this.showStatus(`Map style changed to ${style}`, "success");
  }

  selectDrawingTool(tool) {
    // Clear previous tool selection
    document.querySelectorAll(".tool-btn").forEach((btn) => {
      btn.classList.remove("active");
    });

    // Activate selected tool
    document.querySelector(`[data-tool="${tool}"]`).classList.add("active");
    this.currentTool = tool;

    // Add draw control if not already added
    if (!this.map.hasLayer(this.drawControl)) {
      this.map.addControl(this.drawControl);
    }

    // Trigger appropriate drawing mode
    this.startDrawing(tool);
  }

  startDrawing(tool) {
    const drawHandlers = {
      marker: new L.Draw.Marker(this.map),
      line: new L.Draw.Polyline(this.map),
      polygon: new L.Draw.Polygon(this.map),
      circle: new L.Draw.Circle(this.map),
      rectangle: new L.Draw.Rectangle(this.map),
    };

    if (drawHandlers[tool]) {
      drawHandlers[tool].enable();
      this.isDrawingMode = true;
      this.showStatus(`Drawing mode: ${tool}`, "info");
    }
  }

  saveCurrentDrawing() {
    if (this.drawnItems.getLayers().length === 0) {
      this.showStatus("No drawings to save", "warning");
      return;
    }

    const name = prompt("Enter a name for this drawing:");
    if (!name) return;

    const drawing = {
      id: Date.now(),
      name: name,
      data: this.drawnItems.toGeoJSON(),
      created: new Date().toISOString(),
    };

    this.savedDrawings.push(drawing);
    this.saveDrawingsToStorage();
    this.updateDrawingsList();
    this.showStatus("Drawing saved!", "success");
  }

  clearAllDrawings() {
    if (confirm("Are you sure you want to clear all drawings?")) {
      this.drawnItems.clearLayers();
      this.saveDrawingsToStorage();
      this.showStatus("All drawings cleared", "success");
    }
  }

  saveDrawingsToStorage() {
    const geoJSON = this.drawnItems.toGeoJSON();
    localStorage.setItem("currentDrawing", JSON.stringify(geoJSON));
  }

  loadDrawingsFromStorage() {
    const saved = localStorage.getItem("currentDrawing");
    if (saved) {
      const geoJSON = JSON.parse(saved);
      L.geoJSON(geoJSON).eachLayer((layer) => {
        this.drawnItems.addLayer(layer);
      });
    }
  }

  updateDrawingsList() {
    const list = document.getElementById("drawingsList");
    list.innerHTML = "";

    this.savedDrawings.forEach((drawing) => {
      const item = document.createElement("div");
      item.className = "drawing-item";
      item.innerHTML = `
        <div class="drawing-info">
          <h5>${drawing.name}</h5>
          <small>${new Date(drawing.created).toLocaleDateString()}</small>
        </div>
        <div class="drawing-actions">
          <button onclick="advancedMaps.loadDrawing(${
            drawing.id
          })" class="load-btn">
            <i class="fas fa-eye"></i>
          </button>
          <button onclick="advancedMaps.deleteDrawing(${
            drawing.id
          })" class="delete-btn">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      list.appendChild(item);
    });
  }

  loadDrawing(id) {
    const drawing = this.savedDrawings.find((d) => d.id === id);
    if (drawing) {
      this.drawnItems.clearLayers();
      L.geoJSON(drawing.data).eachLayer((layer) => {
        this.drawnItems.addLayer(layer);
      });
      this.showStatus(`Drawing "${drawing.name}" loaded`, "success");
    }
  }

  deleteDrawing(id) {
    if (confirm("Are you sure you want to delete this drawing?")) {
      this.savedDrawings = this.savedDrawings.filter((d) => d.id !== id);
      localStorage.setItem("savedDrawings", JSON.stringify(this.savedDrawings));
      this.updateDrawingsList();
      this.showStatus("Drawing deleted", "success");
    }
  }

  onMapClick(e) {
    if (!this.isDrawingMode) {
      this.showLocationInfo(e.latlng);
    }
  }

  async showLocationInfo(latlng) {
    const locationInfo = document.getElementById("locationInfo");
    locationInfo.style.display = "block";

    // Update coordinates immediately
    document.getElementById("locationLat").textContent = latlng.lat.toFixed(6);
    document.getElementById("locationLng").textContent = latlng.lng.toFixed(6);

    // Try to get address information
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`
      );
      const data = await response.json();

      if (data.display_name) {
        document.getElementById("locationName").textContent =
          data.name || "Selected Location";
        document.getElementById("locationAddress").textContent =
          data.display_name;
      } else {
        document.getElementById("locationName").textContent =
          "Unknown Location";
        document.getElementById("locationAddress").textContent =
          "No address information available";
      }
    } catch (error) {
      document.getElementById("locationName").textContent = "Selected Location";
      document.getElementById("locationAddress").textContent =
        "Address lookup failed";
    }

    this.selectedLocation = latlng;
  }

  saveCurrentLocation() {
    if (!this.selectedLocation) return;

    const name = prompt("Enter a name for this location:");
    if (!name) return;

    const place = {
      id: Date.now(),
      name: name,
      lat: this.selectedLocation.lat,
      lng: this.selectedLocation.lng,
      created: new Date().toISOString(),
    };

    this.savedPlaces.push(place);
    localStorage.setItem("savedPlaces", JSON.stringify(this.savedPlaces));
    this.updateSavedPlacesList();
    this.showStatus("Location saved!", "success");
  }

  savePlace(name, lat, lng) {
    const place = {
      id: Date.now(),
      name: name,
      lat: lat,
      lng: lng,
      created: new Date().toISOString(),
    };

    this.savedPlaces.push(place);
    localStorage.setItem("savedPlaces", JSON.stringify(this.savedPlaces));
    this.updateSavedPlacesList();
    this.showStatus("Place saved!", "success");
  }

  updateSavedPlacesList() {
    const list = document.getElementById("savedPlacesList");
    list.innerHTML = "";

    this.savedPlaces.forEach((place) => {
      const item = document.createElement("div");
      item.className = "place-item";
      item.innerHTML = `
        <div class="place-info">
          <h5>${place.name}</h5>
          <small>${place.lat.toFixed(4)}, ${place.lng.toFixed(4)}</small>
          <small>${new Date(place.created).toLocaleDateString()}</small>
        </div>
        <div class="place-actions">
          <button onclick="advancedMaps.goToPlace(${place.lat}, ${
        place.lng
      })" class="goto-btn">
            <i class="fas fa-location-arrow"></i>
          </button>
          <button onclick="advancedMaps.deletePlace(${
            place.id
          })" class="delete-btn">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      list.appendChild(item);
    });
  }

  goToPlace(lat, lng) {
    this.map.setView([lat, lng], 16);
    this.showStatus("Navigated to saved place", "success");
  }

  deletePlace(id) {
    if (confirm("Are you sure you want to delete this place?")) {
      this.savedPlaces = this.savedPlaces.filter((p) => p.id !== id);
      localStorage.setItem("savedPlaces", JSON.stringify(this.savedPlaces));
      this.updateSavedPlacesList();
      this.showStatus("Place deleted", "success");
    }
  }

  shareCurrentLocation() {
    if (!this.selectedLocation) return;
    this.shareLocation(this.selectedLocation.lat, this.selectedLocation.lng);
  }

  shareLocation(lat, lng) {
    const url = `${window.location.origin}${window.location.pathname}?lat=${lat}&lng=${lng}&zoom=16`;
    document.getElementById("shareUrl").value = url;
    document.getElementById("shareModal").classList.add("show");
  }

  showShareModal() {
    const center = this.map.getCenter();
    const zoom = this.map.getZoom();
    const url = `${window.location.origin}${window.location.pathname}?lat=${center.lat}&lng=${center.lng}&zoom=${zoom}`;
    document.getElementById("shareUrl").value = url;
    document.getElementById("shareModal").classList.add("show");
  }

  copyShareUrl() {
    const input = document.getElementById("shareUrl");
    input.select();
    document.execCommand("copy");
    this.showStatus("Link copied to clipboard!", "success");
  }

  shareToSocial(platform) {
    const url = document.getElementById("shareUrl").value;
    const text = "Check out this location on Advanced Maps!";

    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], "_blank");
    }
  }

  showSettingsModal() {
    document.getElementById("settingsModal").classList.add("show");
  }

  toggleTheme() {
    const body = document.body;
    const themeBtn = document.getElementById("themeToggle");

    if (body.getAttribute("data-theme") === "dark") {
      body.removeAttribute("data-theme");
      themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
      localStorage.setItem("theme", "light");
    } else {
      body.setAttribute("data-theme", "dark");
      themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
      localStorage.setItem("theme", "dark");
    }
  }

  toggleMeasureMode() {
    // Simple distance measurement tool
    this.showStatus("Click two points to measure distance", "info");
    let firstPoint = null;
    let measureLine = null;

    const measureHandler = (e) => {
      if (!firstPoint) {
        firstPoint = e.latlng;
        this.showStatus("Click second point to complete measurement", "info");
      } else {
        const distance = this.calculateDistance(firstPoint, e.latlng);

        if (measureLine) {
          this.map.removeLayer(measureLine);
        }

        measureLine = L.polyline([firstPoint, e.latlng], {
          color: "#ff6b6b",
          weight: 3,
          dashArray: "5, 10",
        }).addTo(this.map);

        L.popup()
          .setLatLng(e.latlng)
          .setContent(`Distance: ${distance.toFixed(2)} km`)
          .openOn(this.map);

        this.showStatus(
          `Distance measured: ${distance.toFixed(2)} km`,
          "success"
        );

        // Reset
        firstPoint = null;
        this.map.off("click", measureHandler);
      }
    };

    this.map.on("click", measureHandler);
  }

  calculateDistance(latlng1, latlng2) {
    const R = 6371; // Earth's radius in km
    const dLat = ((latlng2.lat - latlng1.lat) * Math.PI) / 180;
    const dLng = ((latlng2.lng - latlng1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((latlng1.lat * Math.PI) / 180) *
        Math.cos((latlng2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      document.getElementById("fullscreenBtn").innerHTML =
        '<i class="fas fa-compress"></i>';
    } else {
      document.exitFullscreen();
      document.getElementById("fullscreenBtn").innerHTML =
        '<i class="fas fa-expand"></i>';
    }
  }

  toggleTrafficOverlay(show) {
    // Demo traffic overlay (in production, you'd use real traffic data)
    if (show) {
      this.showStatus("Traffic overlay enabled (demo)", "info");
      // Add your traffic layer here
    } else {
      this.showStatus("Traffic overlay disabled", "info");
      // Remove traffic layer here
    }
  }

  toggleWeatherOverlay(show) {
    // Demo weather overlay (in production, you'd use weather service)
    if (show) {
      this.showStatus("Weather overlay enabled (demo)", "info");
      // Add your weather layer here
      // Example with OpenWeatherMap:
      const weatherLayer = L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`, {
         opacity: 0.6
       });
      // weatherLayer.addTo(this.map);
    } else {
      this.showStatus("Weather overlay disabled", "info");
      // Remove weather layer here
    }
  }

  toggleTransitOverlay(show) {
    // Demo transit overlay
    if (show) {
      this.showStatus("Transit overlay enabled (demo)", "info");
      // Add your transit layer here
    } else {
      this.showStatus("Transit overlay disabled", "info");
      // Remove transit layer here
    }
  }

  addToSearchHistory(query) {
    if (!this.searchHistory.includes(query)) {
      this.searchHistory.unshift(query);
      if (this.searchHistory.length > 10) {
        this.searchHistory = this.searchHistory.slice(0, 10);
      }
      localStorage.setItem("searchHistory", JSON.stringify(this.searchHistory));
    }
  }

  clearAllData() {
    if (
      confirm(
        "Are you sure you want to clear all saved data? This cannot be undone."
      )
    ) {
      localStorage.removeItem("savedPlaces");
      localStorage.removeItem("savedDrawings");
      localStorage.removeItem("searchHistory");
      localStorage.removeItem("currentDrawing");

      this.savedPlaces = [];
      this.savedDrawings = [];
      this.searchHistory = [];

      this.drawnItems.clearLayers();
      this.updateSavedPlacesList();
      this.updateDrawingsList();

      this.showStatus("All data cleared", "success");
      document.getElementById("settingsModal").classList.remove("show");
    }
  }

  updateLocationInfo() {
    // Update any location-based info when map moves
    const center = this.map.getCenter();
    // You can add more functionality here as needed
  }

  showStatus(message, type = "info") {
    // Create status notification
    const notification = document.createElement("div");
    notification.className = `status-notification ${type}`;
    notification.innerHTML = `
      <i class="fas fa-${this.getStatusIcon(type)}"></i>
      <span>${message}</span>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Show animation
    setTimeout(() => {
      notification.classList.add("show");
    }, 100);

    // Remove after delay
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  getStatusIcon(type) {
    const icons = {
      success: "check-circle",
      error: "exclamation-circle",
      warning: "exclamation-triangle",
      info: "info-circle",
    };
    return icons[type] || "info-circle";
  }

  // Initialize app when page loads
  static init() {
    // Load saved theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.setAttribute("data-theme", "dark");
      setTimeout(() => {
        document.getElementById("themeToggle").innerHTML =
          '<i class="fas fa-sun"></i>';
      }, 100);
    }

    // Check for shared location in URL
    const urlParams = new URLSearchParams(window.location.search);
    const lat = urlParams.get("lat");
    const lng = urlParams.get("lng");
    const zoom = urlParams.get("zoom");

    window.advancedMaps = new AdvancedMaps();

    // If shared location, navigate to it
    if (lat && lng) {
      setTimeout(() => {
        window.advancedMaps.map.setView(
          [parseFloat(lat), parseFloat(lng)],
          zoom ? parseInt(zoom) : 15
        );
        L.marker([parseFloat(lat), parseFloat(lng)])
          .addTo(window.advancedMaps.map)
          .bindPopup("Shared Location")
          .openPopup();
      }, 1000);
    }
  }
}

// Additional CSS for status notifications (add to styles.css)
const additionalCSS = `
.status-notification {
  position: fixed;
  top: 80px;
  right: 20px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transform: translateX(100%);
  transition: transform 0.3s ease;
  z-index: 10001;
  max-width: 300px;
}

.status-notification.show {
  transform: translateX(0);
}

.status-notification.success {
  border-left: 4px solid var(--success-color);
}

.status-notification.error {
  border-left: 4px solid var(--danger-color);
}

.status-notification.warning {
  border-left: 4px solid var(--warning-color);
}

.status-notification.info {
  border-left: 4px solid var(--primary-color);
}

.status-notification i {
  font-size: 1.25rem;
}

.status-notification.success i {
  color: var(--success-color);
}

.status-notification.error i {
  color: var(--danger-color);
}

.status-notification.warning i {
  color: var(--warning-color);
}

.status-notification.info i {
  color: var(--primary-color);
}

.route-marker-content {
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
}

.search-result-popup h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.popup-actions {
  display: flex;
  gap: 0.5rem;
}

.popup-actions button {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.place-item, .drawing-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.place-info h5, .drawing-info h5 {
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
}

.place-info small, .drawing-info small {
  display: block;
  color: var(--text-secondary);
  font-size: 0.75rem;
}

.place-actions, .drawing-actions {
  display: flex;
  gap: 0.25rem;
}

.goto-btn, .load-btn {
  background: var(--primary-color);
  color: white;
}

.delete-btn {
  background: var(--danger-color);
  color: white;
}

.goto-btn, .load-btn, .delete-btn {
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.goto-btn:hover, .load-btn:hover, .delete-btn:hover {
  opacity: 0.8;
}

.route-summary {
  display: flex;
  gap: 1rem;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: 6px;
}

.route-stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.route-stat i {
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .status-notification {
    right: 10px;
    left: 10px;
    max-width: none;
    transform: translateY(-100%);
  }
  
  .status-notification.show {
    transform: translateY(0);
  }
}
`;

// Add additional CSS to head
const styleSheet = document.createElement("style");
styleSheet.textContent = additionalCSS;
document.head.appendChild(styleSheet);

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", AdvancedMaps.init);

// Global functions for onclick handlers
window.advancedMaps = null;
