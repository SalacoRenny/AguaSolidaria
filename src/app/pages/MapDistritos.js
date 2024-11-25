import React, { useState, useEffect, useRef } from 'react';
import MapGL, { Source, Layer, NavigationControl, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getFirestore, collection, onSnapshot, query, where } from 'firebase/firestore';
import app from '../Tools/firebaseConfig.js';
import '../components/home/MapMain.css';
import geojsonData from '../Tools/bo.json';

const MapDistritos = () => {
    const mapRef = useRef();
    const [viewport, setViewport] = useState({
        latitude: -17.3934,
        longitude: -66.157,
        zoom: 11,
        width: "100vw",
        height: "100vh"
    });
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [otbs, setOtbs] = useState([]);
    const [isExpanded, setIsExpanded] = useState(true);
    const db = getFirestore(app);

    useEffect(() => {
        const handleResize = () => {
            setViewport((prevState) => ({
                ...prevState,
                width: window.innerWidth,
                height: window.innerHeight,
            }));
        };
        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const districtLabels = [
        { id: 1, coordinates: [-66.124852, -17.366644], label: "D1" },
        { id: 2, coordinates: [-66.197192, -17.340457], label: "D2" }, 
        { id: 3, coordinates: [-66.211704, -17.372637], label: "D3" },
        { id: 4, coordinates: [-66.203688, -17.397549], label: "D4" },
        { id: 5, coordinates: [-66.168043, -17.420635], label: "D5" },
        { id: 6, coordinates: [-66.143207, -17.409464], label: "D6" },
        { id: 7, coordinates: [-66.121705, -17.422320], label: "D7" },
        { id: 8, coordinates: [-66.091420, -17.463459], label: "D8" },
        { id: 9, coordinates: [-66.204941, -17.467633], label: "D9" },
        { id: 10, coordinates: [-66.156055, -17.389962], label: "D10" },
        { id: 11, coordinates: [-66.134172, -17.387009], label: "D11" },
        { id: 12, coordinates: [-66.186586, -17.370373], label: "D12" },
        { id: 13, coordinates: [-66.176997, -17.284277], label: "D13" },    
        { id: 14, coordinates: [-66.106481, -17.439729], label: "D14" },
        { id: 15, coordinates: [-66.127057, -17.489055], label: "D15" }
    ];

    const handleDistrictClick = async (districtLabel) => {
        const districtFormatted = `Distrito ${districtLabel.replace("D", "")}`;
        setSelectedDistrict(districtFormatted);

        const q = query(collection(db, 'Schedule'), where("distrito", "==", districtFormatted));
        
        onSnapshot(q, (snapshot) => {
            const otbData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setOtbs(otbData);
        });
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="map-container">
            <MapGL
                {...viewport}
                ref={mapRef}
                mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                onMove={evt => setViewport(evt.viewState)}
                mapStyle="mapbox://styles/mapbox/streets-v11"
            >
                <NavigationControl position="top-right" />

                <Source id="distritos" type="geojson" data={geojsonData}>
                    <Layer
                        id="distrito-line"
                        type="line"
                        paint={{
                            'line-color': '#170396',
                            'line-width': 3
                        }}
                    />
                </Source>

                {districtLabels.map(district => (
                    <Marker
                        key={district.id}
                        longitude={district.coordinates[0]}
                        latitude={district.coordinates[1]}
                        offsetLeft={-10}
                        offsetTop={-10}
                        onClick={() => handleDistrictClick(district.label)}
                    >
                        <div className="marker-btn" style={{
                            color: '#0044FF',
                            fontSize: viewport.zoom > 12 ? '30px' : '20px',
                            fontWeight: 'bold',
                            textShadow: '1px 1px 2px white, -1px -1px 2px white',
                            cursor: 'pointer'
                        }}>
                            {viewport.zoom > 10 ? district.label : ''}
                        </div>
                    </Marker>
                ))}
            </MapGL>

            <div className={`otb-cards ${isExpanded ? 'expanded' : 'collapsed'}`}>
                <div className="toggle-button" onClick={toggleExpand}>
                    {isExpanded ? '⮝ Contraer' : '⮟ Expandir'}
                </div>
                <h3>OTBS en {selectedDistrict || "Distrito Seleccionado"}</h3>
                {otbs.length > 0 ? (
                    otbs.map((otb) => (
                        <div key={otb.id} className="otb-card">
                            <h4>{otb.nameotb}</h4>
                            <p>Fecha: {otb.date ? new Date(otb.date.seconds * 1000).toLocaleDateString() : "Fecha no disponible"}</p>
                            <p>Hora Inicio: {otb.hour || "Hora no disponible"}</p>
                            <p>Hora Fin: {otb.horaFin || "Hora no disponible"}</p>
                        </div>
                    ))
                ) : (
                    <p>{selectedDistrict ? "No hay OTBS para el distrito seleccionado." : "Seleccione un distrito en el mapa para ver las OTBS disponibles."}</p>
                )}
            </div>
        </div>
    );
};

export default MapDistritos;
