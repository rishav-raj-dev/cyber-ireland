'use client';

import { AnimatePresence, motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { cyberIrelandData } from "@/lib/data";
import dynamic from 'next/dynamic';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);
const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
);
const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
);

export default function RegionMap({ showPdfModal }: { showPdfModal: boolean }) {
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        
        // Fix for default marker icons in Next.js
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
    }, []);

    const regions = [
        { 
            name: 'Dublin', 
            lat: 53.3498, 
            lng: -6.2603, 
            offices: cyberIrelandData.regions.Dublin.offices,
            firms: cyberIrelandData.regions.Dublin.firms
        },
        { 
            name: 'Cork', 
            lat: 51.8985, 
            lng: -8.4756,
            offices: cyberIrelandData.regions.Cork.offices,
            firms: cyberIrelandData.regions.Cork.firms
        },
        { 
            name: 'Galway', 
            lat: 53.2707, 
            lng: -9.0568,
            offices: cyberIrelandData.regions.Galway.offices,
            firms: cyberIrelandData.regions.Galway.firms
        },
        { 
            name: 'Limerick', 
            lat: 52.6638, 
            lng: -8.6267,
            offices: cyberIrelandData.regions.Limerick.offices,
            firms: cyberIrelandData.regions.Limerick.firms
        }
    ];

    // Custom marker icon based on selection and size
    const createCustomIcon = (region: typeof regions[0]) => {
        const isSelected = selectedRegion === region.name;
        const size = Math.max(35, Math.min(55, region.offices / 8));
        
        return L.divIcon({
            className: 'custom-marker',
            html: `
                <div class="marker-container" style="
                    width: ${size}px;
                    height: ${size}px;
                    background: ${isSelected ? '#00D9C0' : '#7C3AED'};
                    border: 3px solid ${isSelected ? '#00FFD9' : '#9F7AEA'};
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: ${size > 45 ? '14px' : '11px'};
                    box-shadow: 0 4px 16px ${isSelected ? 'rgba(0, 217, 192, 0.7)' : 'rgba(124, 58, 237, 0.4)'};
                    cursor: pointer;
                    transition: all 0.3s ease;
                    animation: ${isSelected ? 'pulse 2s infinite' : 'none'};
                ">
                    <div style="text-align: center; line-height: 1.2;">
                        <div style="font-size: ${size > 45 ? '16px' : '13px'};">${region.offices}</div>
                        <div style="font-size: 8px; opacity: 0.8;">offices</div>
                    </div>
                </div>
            `,
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
            popupAnchor: [0, -size / 2],
        });
    };

    return (
        <motion.div className="glass rounded-2xl p-6 mb-12">
            <h2 className="text-2xl font-display font-bold mb-6">Regional Distribution</h2>

            <div className={`grid grid-cols-1 gap-8 ${showPdfModal ? 'xl:grid-cols-2' : 'lg:grid-cols-2'}`}>
                {/* Real Interactive Map */}
                <div className="relative h-96 rounded-xl overflow-hidden">
                    {isClient ? (
                        <MapContainer
                            center={[53.4129, -8.2439]} // Center of Ireland
                            zoom={7}
                            style={{ height: '100%', width: '100%' }}
                            className="rounded-xl z-0"
                            scrollWheelZoom={false}
                        >
                            {/* Dark theme tiles - matches your dashboard */}
                            <TileLayer
                                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            />

                            {/* Alternative: Light theme with dark water */}
                            {/* <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            /> */}

                            {/* Region Markers */}
                            {regions.map((region) => (
                                <Marker
                                    key={region.name}
                                    position={[region.lat, region.lng]}
                                    icon={createCustomIcon(region)}
                                    eventHandlers={{
                                        click: () => setSelectedRegion(region.name),
                                        mouseover: () => setSelectedRegion(region.name),
                                    }}
                                >
                                    <Popup className="custom-popup">
                                        <div className="text-center">
                                            <h3 className="font-bold text-base mb-1">{region.name}</h3>
                                            <div className="text-sm space-y-1">
                                                <p>🏢 <strong>{region.offices}</strong> offices</p>
                                                <p>🏭 <strong>{region.firms}</strong> firms</p>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-cyan-900/20 to-purple-900/20 rounded-xl flex items-center justify-center">
                            <div className="text-gray-400 font-mono">Loading interactive map...</div>
                        </div>
                    )}
                </div>

                {/* Region Stats */}
                <div>
                    <AnimatePresence mode="wait">
                        {selectedRegion ? (
                            <motion.div
                                key={selectedRegion}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <MapPin className="w-6 h-6 text-teal-400" />
                                    <h3 className="text-3xl font-display font-bold text-teal-400">{selectedRegion}</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-teal-500/10 rounded-xl p-4 border border-teal-500/30">
                                        <p className="text-sm text-gray-400 mb-1 font-mono">Offices</p>
                                        <p className="text-4xl font-bold text-teal-400">
                                            {cyberIrelandData.regions[selectedRegion as keyof typeof cyberIrelandData.regions].offices}
                                        </p>
                                    </div>
                                    <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/30">
                                        <p className="text-sm text-gray-400 mb-1 font-mono">Firms</p>
                                        <p className="text-4xl font-bold text-purple-400">
                                            {cyberIrelandData.regions[selectedRegion as keyof typeof cyberIrelandData.regions].firms}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                                    <p className="text-sm text-cyan-200">
                                        {selectedRegion === 'Cork' && '🏆 Highest concentration of cybersecurity multinationals - home to top 5 employers'}
                                        {selectedRegion === 'Dublin' && '📊 Largest cluster - 50% of all taxonomy offices across sectors'}
                                        {selectedRegion === 'Galway' && '🎓 Second-highest firms per capita - home to HP Global Cyber Defence Centre'}
                                        {selectedRegion === 'Limerick' && '🔧 11% of all operational technology offices nationwide'}
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center justify-center h-full text-gray-400 text-center"
                            >
                                <div>
                                    <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p className="font-mono">Click or hover over a region on the map</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}