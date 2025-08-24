<template>
  <div class="geo-location" role="main">
    <header class="header">
      <h1 id="page-title">Geographic Location & Map Services</h1>
      <p>Explore map features: search locations, plan routes, get location information</p>
    </header>

    <div class="map-container">
      <!-- Search Control Panel -->
      <aside class="search-panel" role="complementary" aria-labelledby="search-panel-title">
        <h2 id="search-panel-title" class="panel-title">Map Controls and Search</h2>

        <section class="search-section" aria-labelledby="search-heading">
          <h3 id="search-heading">🔍 Location Search</h3>
          <form class="search-input-group" @submit.prevent="searchLocation" role="search">
            <input
              id="search-input"
              v-model="searchQuery"
              @keyup.enter="searchLocation"
              type="text"
              placeholder="Search places, addresses..."
              class="search-input-compact"
              autocomplete="off"
            />
            <button type="submit" class="search-btn" :disabled="!searchQuery.trim()">Search</button>
          </form>
          <div
            v-if="searchResults.length > 0"
            class="search-results"
            role="listbox"
            aria-label="Search results"
          >
            <div
              v-for="(result, index) in searchResults"
              :key="index"
              @click="selectSearchResult(result)"
              @keydown="handleSearchResultKeydown($event, result)"
              class="search-result-item"
              role="option"
              :tabindex="0"
              :aria-selected="false"
            >
              <strong>{{ result.display_name.split(',')[0] }}</strong>
              <small>{{ result.display_name }}</small>
            </div>
          </div>
        </section>

        <section class="routing-section" aria-labelledby="routing-heading">
          <h3 id="routing-heading">🗺️ Route Planning</h3>
          <form class="route-inputs" @submit.prevent="planRoute">
            <label for="route-start" class="sr-only">Starting address</label>
            <input
              id="route-start"
              v-model="routeStart"
              type="text"
              placeholder="Starting address"
              class="route-input"
              aria-describedby="route-start-help"
              autocomplete="street-address"
            />
            <div id="route-start-help" class="sr-only">Enter the starting point for your route</div>

            <label for="route-end" class="sr-only">Destination address</label>
            <input
              id="route-end"
              v-model="routeEnd"
              type="text"
              placeholder="Destination address"
              class="route-input"
              aria-describedby="route-end-help"
              autocomplete="street-address"
            />
            <div id="route-end-help" class="sr-only">Enter the destination for your route</div>

            <button
              type="submit"
              class="route-btn"
              :disabled="!routeStart.trim() || !routeEnd.trim()"
              aria-label="Plan route between start and destination"
            >
              Plan Route
            </button>
          </form>
          <div
            v-if="routeInfo"
            class="route-info"
            role="region"
            aria-labelledby="route-info-heading"
            aria-live="polite"
          >
            <h4 id="route-info-heading">Route Information:</h4>
            <dl>
              <dt>Distance:</dt>
              <dd>{{ routeInfo.distance }}</dd>
              <dt>Estimated Time:</dt>
              <dd>{{ routeInfo.duration }}</dd>
              <dt>Route Description:</dt>
              <dd>{{ routeInfo.instructions }}</dd>
            </dl>
          </div>
        </section>

        <section class="location-section" aria-labelledby="location-heading">
          <h3 id="location-heading">📍 Current Location</h3>
          <button @click="getCurrentLocation" class="location-btn" aria-describedby="location-help">
            Get My Location
          </button>
          <div id="location-help" class="sr-only">
            Click to detect your current geographic location
          </div>
          <div
            v-if="currentLocation"
            class="current-location-info"
            role="region"
            aria-labelledby="current-location-heading"
            aria-live="polite"
          >
            <h4 id="current-location-heading" class="sr-only">Your Current Location</h4>
            <dl>
              <dt>Latitude:</dt>
              <dd>{{ currentLocation.lat.toFixed(6) }}</dd>
              <dt>Longitude:</dt>
              <dd>{{ currentLocation.lng.toFixed(6) }}</dd>
              <dt v-if="currentAddress">Address:</dt>
              <dd v-if="currentAddress">{{ currentAddress }}</dd>
            </dl>
          </div>
        </section>
      </aside>

      <!-- Map Display Area -->
      <main class="map-wrapper" role="application" aria-labelledby="map-title">
        <h2 id="map-title" class="sr-only">Interactive Map</h2>
        <div
          id="map"
          class="map"
          role="img"
          aria-label="Interactive map showing geographic locations and routes"
          tabindex="0"
        ></div>
        <div class="map-controls" role="toolbar" aria-label="Map controls">
          <button @click="clearMap" class="control-btn" aria-label="Clear all markers from the map">
            Clear Markers
          </button>
          <button @click="resetView" class="control-btn" aria-label="Reset map to default view">
            Reset View
          </button>
        </div>
      </main>
    </div>

    <!-- Loading Status -->
    <div
      v-if="loading"
      class="loading-overlay"
      role="status"
      aria-live="assertive"
      aria-label="Loading"
    >
      <div class="loading-spinner" aria-hidden="true"></div>
      <p>{{ loadingMessage }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GeoLocation',
  data() {
    return {
      map: null,
      geocoder: null,
      driving: null,
      searchQuery: '',
      searchResults: [],
      routeStart: '',
      routeEnd: '',
      routeInfo: null,
      currentLocation: null,
      currentAddress: '',
      loading: false,
      loadingMessage: '',
      markers: [],
    }
  },
  mounted() {
    this.initMap()
  },
  methods: {
    // Initialize map
    initMap() {
      // Create map using AMap (高德地图)
      this.map = new AMap.Map('map', {
        zoom: 10,
        center: [116.397428, 39.90923], // Default to Beijing
        mapStyle: 'amap://styles/normal',
      })

      // Map click event
      this.map.on('click', this.onMapClick)

      // Initialize geocoder
      this.geocoder = new AMap.Geocoder({
        city: '010', // 城市设为北京，也可以使用城市名
        radius: 1000, // 范围，默认：500
      })

      // Initialize driving route
      this.driving = new AMap.Driving({
        map: this.map,
        panel: 'panel',
      })
    },

    // Handle map click events
    async onMapClick(e) {
      const lnglat = e.lnglat
      const lng = lnglat.getLng()
      const lat = lnglat.getLat()

      this.addMarker([lng, lat], 'Clicked Location')

      // Reverse geocoding to get address
      this.geocoder.getAddress([lng, lat], (status, result) => {
        if (status === 'complete' && result.regeocode) {
          const address = result.regeocode.formattedAddress
          this.updateMarkerPopup([lng, lat], `Clicked Location\n${address}`)
        } else {
          console.error('Reverse geocoding failed')
        }
      })
    },

    // 搜索地点
    async searchLocation() {
      if (!this.searchQuery.trim()) return

      this.loading = true
      this.loadingMessage = 'Searching locations...'

      // 使用高德地图的地理编码服务
      this.geocoder.getLocation(this.searchQuery, (status, result) => {
        this.loading = false
        if (status === 'complete' && result.geocodes.length > 0) {
          this.searchResults = result.geocodes.map((item) => ({
            display_name: item.formattedAddress,
            lat: item.location.lat,
            lon: item.location.lng,
            name: item.district || item.township || item.neighborhood || '',
          }))
        } else {
          console.error('Search failed:', status)
          alert('Search failed, please try again later')
          this.searchResults = []
        }
      })
    },

    // Handle keyboard navigation for search results
    handleSearchResultKeydown(event, result) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        this.selectSearchResult(result)
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        const nextElement = event.target.nextElementSibling
        if (nextElement) {
          nextElement.focus()
        }
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        const prevElement = event.target.previousElementSibling
        if (prevElement) {
          prevElement.focus()
        }
      } else if (event.key === 'Escape') {
        this.searchResults = []
        document.getElementById('search-input').focus()
      }
    },

    // 选择搜索结果
    selectSearchResult(result) {
      const lat = parseFloat(result.lat)
      const lng = parseFloat(result.lon)

      this.map.setZoomAndCenter(15, [lng, lat])
      this.addMarker([lng, lat], result.display_name.split(',')[0], result.display_name)
      this.searchResults = []
      this.searchQuery = ''

      // Announce to screen readers
      this.announceToScreenReader(`Selected location: ${result.display_name.split(',')[0]}`)
    },

    // Announce messages to screen readers
    announceToScreenReader(message) {
      const announcement = document.createElement('div')
      announcement.setAttribute('aria-live', 'polite')
      announcement.setAttribute('aria-atomic', 'true')
      announcement.className = 'sr-only'
      announcement.textContent = message
      document.body.appendChild(announcement)

      setTimeout(() => {
        document.body.removeChild(announcement)
      }, 1000)
    },

    // 规划路线
    async planRoute() {
      if (!this.routeStart.trim() || !this.routeEnd.trim()) return

      this.loading = true
      this.loadingMessage = 'Planning route...'

      // 使用高德地图的驾车路线规划
      this.driving.search(
        [
          { keyword: this.routeStart, city: '全国' },
          { keyword: this.routeEnd, city: '全国' },
        ],
        (status, result) => {
          this.loading = false
          if (status === 'complete') {
            if (result.routes && result.routes.length > 0) {
              const route = result.routes[0]
              // Set route information
              this.routeInfo = {
                distance: `${(route.distance / 1000).toFixed(2)} km`,
                duration: `${Math.round(route.time / 60)} minutes`,
                instructions: `From ${this.routeStart} to ${this.routeEnd}`,
              }
            } else {
              alert('Unable to plan route')
            }
          } else {
            console.error('Route planning failed:', status)
            alert('Route planning failed, please try again later')
          }
        },
      )
    },

    // 获取当前位置
    getCurrentLocation() {
      this.loading = true
      this.loadingMessage = 'Getting current location...'

      // 优先使用高德地图定位服务（更准确）
      if (AMap && AMap.Geolocation) {
        const geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
          convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标系
          showButton: false,
          buttonPosition: 'RB',
          showMarker: false,
          showCircle: false,
          panToLocation: false,
          zoomToAccuracy: false,
        })

        geolocation.getCurrentPosition((status, result) => {
          this.loading = false
          if (status === 'complete') {
            const lat = result.position.lat
            const lng = result.position.lng

            this.currentLocation = { lat, lng }
            this.map.setZoomAndCenter(15, [lng, lat])
            this.addMarker([lng, lat], 'My Location', 'Current Location')

            // 获取详细地址
            this.currentAddress = result.formattedAddress || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
          } else {
            console.error('高德定位失败:', result)
            // 如果高德定位失败，使用苏州市中心作为默认位置
            this.useDefaultSuzhouLocation()
          }
        })
      } else {
        // 如果高德地图API未加载，使用苏州市中心作为默认位置
        this.useDefaultSuzhouLocation()
      }
    },

    // 使用苏州市中心作为默认位置
    useDefaultSuzhouLocation() {
      const suzhouLat = 31.2989
      const suzhouLng = 120.5853

      this.currentLocation = { lat: suzhouLat, lng: suzhouLng }
      this.map.setZoomAndCenter(15, [suzhouLng, suzhouLat])
      this.addMarker([suzhouLng, suzhouLat], 'Default Location', 'Suzhou City Center')

      // 使用高德地图逆地理编码获取地址
      this.geocoder.getAddress([suzhouLng, suzhouLat], (status, result) => {
        this.loading = false
        if (status === 'complete' && result.regeocode) {
          this.currentAddress = result.regeocode.formattedAddress
        } else {
          this.currentAddress = '江苏省苏州市'
        }
      })
    },

    // Add marker
    addMarker(position, title, description = '') {
      const marker = new AMap.Marker({
        position: position,
        title: title,
        map: this.map,
      })

      // 添加信息窗体
      const infoWindow = new AMap.InfoWindow({
        content: `<div><strong>${title}</strong>${description ? '<br>' + description : ''}</div>`,
      })

      marker.on('click', () => {
        infoWindow.open(this.map, position)
      })

      this.markers.push(marker)
      return marker
    },

    // Update marker popup
    updateMarkerPopup(position, content) {
      const marker = this.markers.find((m) => {
        const pos = m.getPosition()
        return Math.abs(pos.lat - position[1]) < 0.0001 && Math.abs(pos.lng - position[0]) < 0.0001
      })

      if (marker) {
        const infoWindow = new AMap.InfoWindow({
          content: `<div>${content}</div>`,
        })
        marker.on('click', () => {
          infoWindow.open(this.map, position)
        })
      }
    },

    // Clear map markers
    clearMap() {
      this.markers.forEach((marker) => {
        this.map.remove(marker)
      })
      this.markers = []

      // 清除路线
      this.driving.clear()
      this.routeInfo = null
      this.searchResults = []
    },

    // Reset map view
    resetView() {
      this.map.setZoomAndCenter(10, [116.397428, 39.90923])
    },
  },
}
</script>

<style scoped>
.geo-location {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.header p {
  color: #7f8c8d;
  font-size: 16px;
}

.map-container {
  display: flex;
  gap: 20px;
  height: 600px;
}

.search-panel {
  width: 350px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  overflow-y: auto;
}

.panel-title {
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  padding-bottom: 15px;
  border-bottom: 2px solid #3498db;
}

.search-section,
.routing-section,
.location-section {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ecf0f1;
}

.search-section:last-child,
.routing-section:last-child,
.location-section:last-child {
  border-bottom: none;
}

.search-section h3,
.routing-section h3,
.location-section h3 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 16px;
}

.search-input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.search-input,
.route-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.search-input-compact {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  max-width: 200px;
}

.search-btn,
.route-btn,
.location-btn,
.control-btn {
  padding: 10px 15px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.search-btn:hover,
.route-btn:hover,
.location-btn:hover,
.control-btn:hover {
  background: #2980b9;
}

.search-btn:disabled,
.route-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.route-inputs {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.search-results {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.search-result-item {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

.search-result-item:hover {
  background: #f8f9fa;
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-item strong {
  display: block;
  color: #2c3e50;
  margin-bottom: 5px;
}

.search-result-item small {
  color: #7f8c8d;
  font-size: 12px;
}

.route-info {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  margin-top: 15px;
}

.route-info h4 {
  margin: 0 0 10px 0;
  color: #2c3e50;
}

.route-info p {
  margin: 5px 0;
  font-size: 14px;
}

.current-location-info {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  margin-top: 15px;
}

.current-location-info p {
  margin: 5px 0;
  font-size: 14px;
}

.map-wrapper {
  flex: 1;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.map {
  width: 100%;
  height: 100%;
}

.map-controls {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-overlay p {
  color: white;
  font-size: 16px;
}

@media (max-width: 768px) {
  .map-container {
    flex-direction: column;
    height: auto;
  }

  .search-panel {
    width: 100%;
    margin-bottom: 20px;
  }

  .map-wrapper {
    height: 400px;
  }
}
</style>
