import React, { useEffect, useRef } from 'react';
import { Navigation } from 'lucide-react';

export interface MapMarker {
  id: string;
  title: string;
  description?: string;
  category?: string;
  severity?: string;
  status?: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  address?: string;
  type?: 'REPORT' | 'CENTER' | 'PICKUP' | 'NEW_PIN';
  acceptedMaterials?: string;
  operatingHours?: string;
}

interface InteractiveMapProps {
  markers?: MapMarker[] | any[];
  selectedMarkerId?: string;
  onMarkerClick?: (marker: MapMarker) => void;
  onLocationSelect?: (lat: number, lng: number) => void;
  height?: string;
  centerLat?: number;
  centerLng?: number;
  latitude?: number;
  longitude?: number;
  zoom?: number;
  interactive?: boolean;
}

export function InteractiveMap({
  markers = [],
  selectedMarkerId,
  onMarkerClick,
  onLocationSelect,
  height = '500px',
  centerLat,
  centerLng,
  latitude,
  longitude,
  zoom = 13,
  interactive,
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);

  const activeLat = latitude ?? centerLat ?? 8.9806;
  const activeLng = longitude ?? centerLng ?? 38.7578;

  useEffect(() => {
    async function initMap() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      const L = (await import('leaflet')).default;
      leafletRef.current = L;

      if (!mapInstanceRef.current && mapContainerRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [activeLat, activeLng],
          zoom,
          zoomControl: false,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors | EcoBin Platform Addis Ababa',
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        const markersGroup = L.layerGroup().addTo(map);
        markersGroupRef.current = markersGroup;

        if (onLocationSelect) {
          map.on('click', (e: any) => {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
          });
        }

        mapInstanceRef.current = map;
      }

      if (markersGroupRef.current && leafletRef.current) {
        markersGroupRef.current.clearLayers();

        (markers || []).forEach((m: any) => {
          let iconHtml = `<div class="w-4 h-4 rounded-full bg-sky-500 border-2 border-white shadow-lg"></div>`;

          if (m.type === 'CENTER') {
            iconHtml = `
              <div class="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xl border-2 border-slate-900 font-bold text-sm transform transition-transform hover:scale-110" title="Recycling Center">
                🟢
              </div>`;
          } else if (m.type === 'PICKUP') {
            iconHtml = `
              <div class="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xl border-2 border-slate-900 font-bold text-sm transform transition-transform hover:scale-110" title="Collection Request">
                🟡
              </div>`;
          } else if (m.type === 'NEW_PIN') {
            iconHtml = `
              <div class="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-2xl border-4 border-slate-950 animate-bounce">
                📍
              </div>`;
          } else {
            if (m.status === 'RESOLVED' || m.status === 'COMPLETED' || m.status === 'COLLECTED') {
              iconHtml = `<div class="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl border-2 border-slate-900 font-bold text-sm transform transition-transform hover:scale-110" title="Completed Collection">🔵</div>`;
            } else if (m.status === 'IN_PROGRESS' || m.status === 'ASSIGNED') {
              iconHtml = `<div class="w-9 h-9 rounded-full bg-cyan-600 text-white flex items-center justify-center shadow-xl border-2 border-slate-900 font-bold text-sm animate-pulse" title="In Progress">🚚</div>`;
            } else {
              iconHtml = `<div class="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center shadow-xl border-2 border-slate-900 font-bold text-sm" title="Waste Report">🔴</div>`;
            }
          }

          const customIcon = L.divIcon({
            html: iconHtml,
            className: 'custom-leaflet-marker',
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          });

          const leafletMarker = L.marker([m.latitude, m.longitude], { icon: customIcon });

          const popupContent = `
            <div class="p-1 max-w-xs font-sans text-slate-900">
              ${m.imageUrl ? `<img src="${m.imageUrl}" class="w-full h-28 object-cover rounded-lg mb-2 border border-slate-300" />` : ''}
              <div class="font-bold text-sm text-slate-900 mb-1">${m.title || 'Location'}</div>
              ${m.address || m.description ? `<div class="text-xs text-slate-600 mb-2">📍 ${m.address || m.description}</div>` : ''}
            </div>
          `;

          leafletMarker.bindPopup(popupContent);

          if (onMarkerClick) {
            leafletMarker.on('click', () => onMarkerClick(m));
          }

          leafletMarker.addTo(markersGroupRef.current);
        });
      }
    }

    initMap();
  }, [markers, selectedMarkerId, activeLat, activeLng, zoom, onLocationSelect, onMarkerClick]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      <div ref={mapContainerRef} style={{ height }} className="w-full" />
      <div className="absolute top-3 left-3 z-[1000] bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-300 shadow-lg flex items-center gap-2">
        <Navigation className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
        <span>EcoBin Live GPS Map (Addis Ababa)</span>
        <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-mono">
          {markers?.length || 0} Pins
        </span>
      </div>
    </div>
  );
}

export default InteractiveMap;
