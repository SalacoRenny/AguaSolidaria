import React, { useState, useEffect, useRef } from 'react';
import MapGL, { Marker, Popup, Layer, Source, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import app from '../../Tools/firebaseConfig.js';
import '../../components/home/MapMain.css';
import { latLngToCell, cellToBoundary } from 'h3-js';  // Librería para hexágonos
import mapboxgl from 'mapbox-gl';
import cisternaIcon from '../../assets/icons/cisterna.png';
import geojsonData from '../../assets/bo.json';  // Asegúrate de que la ruta sea correcta



console.log("GeoJSON Data:", geojsonData);

// mapboxgl.accessToken = 'pk.eyJ1Ijoic2FsYWNvIiwiYSI6ImNtMjllZTN3NzA0Z2Qya3ExdnhmejFmbmQifQ.lPz_915mdzdIT7hLUYhQRg';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2FsYWNvIiwiYSI6ImNtMjlkNGJiYTA0ZDMyam13YnVqM3QzbnIifQ.0uymgs1MiknWGYqW0A3iFg';
const MapMain = () => {
const mapRef = useRef(); // Crear la referencia para el mapa
const [viewport, setViewport] = useState({
    latitude: -17.3934, // Latitud de Cochabamba
    longitude: -66.157, // Longitud de Cochabamba
    zoom: 7,
    width: "100vw",
    height: "100vh"
  });
  const [cisternas, setCisternas] = useState([]); 
  const [selectedCisterna, setSelectedCisterna] = useState(null);
  const db = getFirestore(app);

  // Obtener cisternas en tiempo real desde Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'cisternas'), (snapshot) => {
      const fetchedCisternas = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setCisternas(fetchedCisternas);
    });
    return () => unsubscribe();
  }, [db]);

  // Generar hexágonos de actividad con H3    
  const hexagons = cisternas.map((cisterna) => {
    if (!cisterna.ubicacion || !cisterna.ubicacion.latitude || !cisterna.ubicacion.longitude) {
      console.error(`Cisterna con id ${cisterna.id} no tiene coordenadas válidas.`);
      return null;
    }
  
    const hexId = latLngToCell(cisterna.ubicacion.latitude, cisterna.ubicacion.longitude, 8);
    const coords = cellToBoundary(hexId, true);
    
    // Validar que coords sea un array no vacío
    if (!coords || coords.length === 0) {
        console.error(`No se pudieron generar coordenadas para el hexágono: ${hexId}`);
        return null;
    }

    if (!cisternas || cisternas.length === 0) {
        return <div>Loading map...</div>;  // O un mensaje de carga
    }
    return {
      id: hexId,
      coords: coords.map(([lat, lon]) => [lon, lat])  // Invertir lat/lon a [longitud, latitud] para GeoJSON
    };
  }).filter(hex => hex !== null);  // Filtrar hexágonos inválidos

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      map.once('load', () => {
        map.scrollZoom.enable();
        map.dragPan.enable();
        map.doubleClickZoom.enable();
        map.touchZoomRotate.enable();
  
  
      // Verificar si las interacciones están habilitadas
      console.log("Scroll Zoom Enabled:", map.scrollZoom.isEnabled());
      console.log("Drag Pan Enabled:", map.dragPan.isEnabled());
      console.log("Double Click Zoom Enabled:", map.doubleClickZoom.isEnabled());
      console.log("Touch Zoom Rotate Enabled:", map.touchZoomRotate.isEnabled());
      });
    }
  }, []);


      useEffect(() => {
        const handleResize = () => {
          setViewport((prevState) => ({
            ...prevState,
            width: window.innerWidth,
            height: window.innerHeight,
          }));
        };

        window.addEventListener('resize', handleResize);
        
        // Ejecuta el cambio de tamaño al cargar el componente
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
      }, []);
  
  
  
  return (
    <div className="map-container">
      <MapGL
      {...viewport}
      ref={mapRef}
      mapboxAccessToken={mapboxgl.accessToken}  // Cambiar a esta propiedad
      onMove={evt => setViewport(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      > 
        {/* Controles de navegación */}
        <NavigationControl position="top-right" />

        {/* Cargar el contorno de Cochabamba desde el GeoJSON */}
        <Source id="cochabamba-boundary" type="geojson" data={geojsonData}>
            {/* Capa de relleno para Cochabamba */}
            <Layer
                id="cochabamba-layer"
                type="fill"
                paint={{
                    'fill-color': '#088',    // Color del área de Cochabamba
                    'fill-opacity': 0.3   // Opacidad del relleno
                }}
            />
            {/* Capa de borde para Cochabamba */}
            <Layer
                id="cochabamba-outline"
                type="line"
                paint={{
                    'line-color': '#000',     // Color del borde de Cochabamba
                    'line-width': 2           // Ancho del borde
            }}
            />
        </Source>

        {/* Máscara para oscurecer áreas fuera de Cochabamba */}
        <Source id="outside-mask" type="geojson" data={{
            "type": "Feature",
            "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                [-180, 90], [-180, -90], [180, -90], [180, 90], [-180, 90]  // Limites globales
                ].concat(geojsonData.geometry.coordinates[0])  // Coordenadas de Cochabamba
            ]
            }
        }}>
            {/* <Layer
                id="mask-layer"
                type="fill"
                paint={{
                    'fill-color': '#000',    // Color para enmascarar fuera de Cochabamba
                    'fill-opacity': 1    // Opacidad de la máscara
                }}
            /> */}
        </Source>



        {/* Renderizar hexágonos */}
        {hexagons.map((hex) => (
          <Source
            key={hex.id}
            id={`hex-${hex.id}`}
            type="geojson"
            data={{
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [hex.coords]  // Verifica que 'hex.coords' sea un array de arrays
              }
            }}
          >
            <Layer
              id={`hexagon-${hex.id}`}
              type="fill"
              paint={{
                'fill-color': '#00FF00',
                'fill-opacity': 0.4,
                'fill-outline-color': '#000000'
              }}
            />
          </Source>
        ))}

        {/* Marcadores de cisternas */}
        {cisternas.map(cisterna => cisterna.ubicacion && (
          <Marker
            key={cisterna.id}
            latitude={cisterna.ubicacion.latitude}
            longitude={cisterna.ubicacion.longitude}
          >
            <button className="marker-btn" onClick={() => setSelectedCisterna(cisterna)}>
            <img src={cisternaIcon} alt="Cisterna" />
            </button>
          </Marker>
        ))}

        {/* Popup con la información de la cisterna */}
        {selectedCisterna && (
          <Popup
            latitude={selectedCisterna.ubicacion.latitude}
            longitude={selectedCisterna.ubicacion.longitude}
            onClose={() => setSelectedCisterna(null)}
          >
            <div>
              <h3>{selectedCisterna.nombre}</h3>
              <p>Estado: {selectedCisterna.estado}</p>
              <p>Capacidad: {selectedCisterna.capacidad}</p>
              <p>Horario: {selectedCisterna.horario}</p>
            </div>
          </Popup>
        )}
      </MapGL>
    </div>
  );
};

export default MapMain;
