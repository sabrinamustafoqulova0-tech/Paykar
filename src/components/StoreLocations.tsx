import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import MapIcon from '@mui/icons-material/Map'
import { useNavigate } from 'react-router-dom'

interface Store {
  id: number
  name: string
  address: string
  coords: [number, number]
  phone: string
}

const storesData: Store[] = [
  {
    id: 4,
    name: 'Супермаркет "Пайкар" 4',
    address: 'ул. Айни 57',
    coords: [38.560534, 68.910976],
    phone: '4400'
  },
  {
    id: 5,
    name: 'Супермаркет "Пайкар" 5',
    address: 'пр. Рудаки 66',
    coords: [38.579078, 68.787810],
    phone: '4400'
  },
  {
    id: 3,
    name: 'Супермаркет "Пайкар" 3',
    address: 'ул. Яккачинор 148',
    coords: [38.562553, 68.769493],
    phone: '4400'
  },
  {
    id: 2,
    name: 'Супермаркет "Пайкар" 2',
    address: 'ул. Бухоро 27',
    coords: [38.568450, 68.786229],
    phone: '4400'
  },
  {
    id: 1,
    name: 'Супермаркет "Пайкар" 1',
    address: 'ул. Айни 166',
    coords: [38.562519, 68.792508],
    phone: '4400'
  }
]

export const StoreLocations: React.FC = () => {
  const navigate = useNavigate()
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const placemarksRef = useRef<{ [key: number]: any }>({})
  
  const [selectedStore, setSelectedStore] = useState<Store>(storesData[0])
  const [ymapsLoaded, setYmapsLoaded] = useState<boolean>(false)
  const [loadError, setLoadError] = useState<boolean>(false)
  const [mapType, setMapType] = useState<'map' | 'satellite' | 'hybrid'>('map')
  const [showTypeMenu, setShowTypeMenu] = useState<boolean>(false)

  // Dynamically load Yandex Maps API
  useEffect(() => {
    if ((window as any).ymaps) {
      setYmapsLoaded(true)
      return
    }

    const scriptId = 'yandex-maps-api-script'
    let script = document.getElementById(scriptId) as HTMLScriptElement

    if (!script) {
      script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU'
      script.type = 'text/javascript'
      script.async = true
      script.onload = () => {
        const ymaps = (window as any).ymaps
        if (ymaps) {
          ymaps.ready(() => {
            setYmapsLoaded(true)
          })
        }
      }
      script.onerror = () => {
        setLoadError(true)
      }
      document.head.appendChild(script)
    } else {
      // Script is already added, but maybe not fully loaded
      const checkInterval = setInterval(() => {
        const ymaps = (window as any).ymaps
        if (ymaps && ymaps.ready) {
          ymaps.ready(() => {
            setYmapsLoaded(true)
            clearInterval(checkInterval)
          })
        }
      }, 200)

      return () => clearInterval(checkInterval)
    }
  }, [])

  // Initialize Map
  useEffect(() => {
    if (!ymapsLoaded || !mapContainerRef.current) return

    const ymaps = (window as any).ymaps
    if (!ymaps) return

    try {
      // If map is already initialized, don't re-initialize
      if (mapRef.current) return

      const mapInstance = new ymaps.Map(mapContainerRef.current, {
        center: selectedStore.coords,
        zoom: 14,
        controls: [] // Empty controls to custom overlay
      })

      mapRef.current = mapInstance

      // Add placemarks
      storesData.forEach((store) => {
        const placemark = new ymaps.Placemark(
          store.coords,
          {
            balloonContentHeader: `<strong style="color:var(--text-main); font-family:inherit;">${store.name}</strong>`,
            balloonContentBody: `<div style="color:var(--text-muted); font-size:12px; margin-top:4px;">${store.address}</div>`,
            balloonContentFooter: `<div style="font-size:11px; color:#009640; font-weight:bold; margin-top:4px;">Тел: ${store.phone}</div>`
          },
          {
            iconLayout: 'default#image',
            // Custom green circle SVG icon exactly like the photo
            iconImageHref: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><circle cx="18" cy="18" r="14" fill="%23009640" stroke="%23ffffff" stroke-width="4" /><circle cx="18" cy="18" r="6" fill="%23ffffff" /></svg>`,
            iconImageSize: [32, 32],
            iconImageOffset: [-16, -16]
          }
        )

        // Sync map marker click with sidebar store selection
        placemark.events.add('click', () => {
          setSelectedStore(store)
        })

        mapInstance.geoObjects.add(placemark)
        placemarksRef.current[store.id] = placemark
      })

    } catch (e) {
      console.error('Yandex Maps initialization error:', e)
      setLoadError(true)
    }
  }, [ymapsLoaded])

  // Center map and open balloon when store changes
  useEffect(() => {
    if (mapRef.current && selectedStore) {
      mapRef.current.setCenter(selectedStore.coords, 14, {
        duration: 400,
        timingFunction: 'ease-in-out'
      })

      // Open balloon for the selected placemark
      const placemark = placemarksRef.current[selectedStore.id]
      if (placemark && mapRef.current.balloon) {
        placemark.balloon.open()
      }
    }
  }, [selectedStore])

  const handleStoreSelect = (store: Store) => {
    setSelectedStore(store)
  }

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.setZoom(mapRef.current.getZoom() + 1, { duration: 200 })
    }
  }

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.setZoom(mapRef.current.getZoom() - 1, { duration: 200 })
    }
  }

  const handleMapTypeChange = (type: 'map' | 'satellite' | 'hybrid') => {
    setMapType(type)
    setShowTypeMenu(false)
    if (mapRef.current) {
      mapRef.current.setType(`yandex#${type}`)
    }
  }

  return (
    <div className="store-locations-section">
      {/* Header Bar */}
      <div className="store-locations-header">
        <h2 className="section-title">Адреса магазинов</h2>
        <button className="view-all-link" onClick={() => navigate('/contacts')}>
          ПЕРЕЙТИ В РАЗДЕЛ
        </button>
      </div>

      <div className="store-locations-layout">
        {/* Left Side: Store list */}
        <div className="store-list-container">
          <div className="store-list">
            {storesData.map((store) => {
              const isSelected = selectedStore.id === store.id
              return (
                <div
                  key={store.id}
                  className={`store-list-item ${isSelected ? 'active' : ''}`}
                  onClick={() => handleStoreSelect(store)}
                >
                  <div className="store-item-main">
                    <h4 className="store-item-name">{store.name}</h4>
                    <p className="store-item-address">{store.address}</p>
                    <span className="store-item-phone">{store.phone}</span>
                  </div>
                  {isSelected && (
                    <motion.div
                      layoutId="activeStoreBorder"
                      className="active-store-indicator"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Side: Interactive Map */}
        <div className="store-map-container">
          {loadError ? (
            // Fallback map if loading script fails or is offline
            <div className="map-fallback-view">
              <div className="map-grid-bg" />
              <svg viewBox="0 0 800 500" className="map-vector-routes">
                {/* River Dushanbinka */}
                <path d="M 400,0 Q 420,150 380,300 T 420,500" fill="none" stroke="#e0f2fe" strokeWidth="24" strokeLinecap="round" />
                {/* Main roads */}
                <path d="M 420,0 L 420,500" fill="none" stroke="#ffffff" strokeWidth="12" />
                <path d="M 420,0 L 420,500" fill="none" stroke="#fef08a" strokeWidth="4" />
                <path d="M 0,220 L 800,220" fill="none" stroke="#ffffff" strokeWidth="12" />
                <path d="M 0,220 L 800,220" fill="none" stroke="#fef08a" strokeWidth="4" />
                <path d="M 0,100 L 420,100" fill="none" stroke="#ffffff" strokeWidth="8" />
                <path d="M 200,160 L 600,160" fill="none" stroke="#ffffff" strokeWidth="6" />
                <path d="M 300,320 L 550,320" fill="none" stroke="#ffffff" strokeWidth="6" />
              </svg>

              {/* Pins overlay */}
              {storesData.map((store) => {
                let top = '50%'
                let left = '50%'
                if (store.id === 4) { top = '48%'; left = '82%' }
                else if (store.id === 5) { top = '15%'; left = '53%' }
                else if (store.id === 3) { top = '68%'; left = '32%' }
                else if (store.id === 2) { top = '34%'; left = '48%' }
                else if (store.id === 1) { top = '48%'; left = '58%' }

                const isSelected = selectedStore.id === store.id

                return (
                  <div
                    key={store.id}
                    className={`map-vector-pin ${isSelected ? 'selected' : ''}`}
                    style={{ top, left }}
                    onClick={() => handleStoreSelect(store)}
                  >
                    <div className="pin-ring">
                      <div className="pin-dot" />
                    </div>
                    {isSelected && (
                      <div className="pin-balloon">
                        <strong>{store.name}</strong>
                        <div>{store.address}</div>
                        <div>Тел: {store.phone}</div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : !ymapsLoaded ? (
            // Spinner / Loader view
            <div className="map-loading-view">
              <div className="map-loading-spinner" />
              <span>Загрузка карты...</span>
            </div>
          ) : (
            // The actual Yandex Map
            <div ref={mapContainerRef} className="yandex-map-canvas" />
          )}

          {/* Custom controls aligned with Yandex design rules */}
          <div className="custom-map-controls">
            {/* Zoom Controls Container: + / - buttons */}
            <div className="custom-zoom-controls">
              <button className="zoom-btn" onClick={handleZoomIn} title="Приблизить">
                <AddIcon fontSize="small" />
              </button>
              <div className="zoom-divider" />
              <button className="zoom-btn" onClick={handleZoomOut} title="Отдалить">
                <RemoveIcon fontSize="small" />
              </button>
            </div>

            {/* Map Type Dropdown Control */}
            <div className="custom-type-selector">
              <button 
                className="type-select-trigger" 
                onClick={() => setShowTypeMenu(!showTypeMenu)}
                title="Схема"
              >
                <MapIcon fontSize="inherit" style={{ marginRight: '6px' }} />
                <span>
                  {mapType === 'map' ? 'Схема' : mapType === 'satellite' ? 'Спутник' : 'Гибрид'}
                </span>
                <span className="arrow-down-icon">▼</span>
              </button>
              {showTypeMenu && (
                <div className="type-select-dropdown">
                  <button 
                    className={`type-option ${mapType === 'map' ? 'active' : ''}`}
                    onClick={() => handleMapTypeChange('map')}
                  >
                    Схема
                  </button>
                  <button 
                    className={`type-option ${mapType === 'satellite' ? 'active' : ''}`}
                    onClick={() => handleMapTypeChange('satellite')}
                  >
                    Спутник
                  </button>
                  <button 
                    className={`type-option ${mapType === 'hybrid' ? 'active' : ''}`}
                    onClick={() => handleMapTypeChange('hybrid')}
                  >
                    Гибрид
                  </button>
                </div>
              )}
            </div>

            {/* Yandex Map Attribution Logo */}
            <a 
              href="https://yandex.ru/maps" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="yandex-logo-attribution"
              title="Открыть на Яндекс Картах"
            >
              Яндекс
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
