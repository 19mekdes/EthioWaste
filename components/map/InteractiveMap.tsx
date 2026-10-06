'use client';

import React, { useEffect, useRef } from 'react';
import { getSeverityBadge, getStatusBadge } from '@/lib/utils';
import { MapPin, Navigation, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

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
  type: 'REPORT' | 'CENTER' | 'PICKUP' | 'NEW_PIN';
  acceptedMaterials?: string;
  operatingHours?: string;
}

interface InteractiveMapProps {
  markers: MapMarker[];
  selectedMarkerId?: string;
  onMarkerClick?: (marker: MapMarker) => void;
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
  height?: string;
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
}

export default function InteractiveMap({
  markers,
  selectedMarkerId,
  onMarkerClick,
  onLocationSelect,
  height = '500px',
  centerLat = 9.0107,
  centerLng = 38.7612,
  zoom = 13,
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      const L = (await import('leaflet')).default;
      leafletRef.current = L;

      if (!mapInstanceRef.current && mapContainerRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [centerLat, centerLng],
          zoom,
          zoomControl: false,
        });

        // Add OpenStreetMap Dark theme tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors | EcoBin Platform Ethiopia',
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        const markersGroup = L.layerGroup().addTo(map);
        markersGroupRef.current = markersGroup;

        if (onLocationSelect) {
          map.on('click', (e: any) => {
            onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
          });
        }

        mapInstanceRef.current = map;
      }

      if (markersGroupRef.current && leafletRef.current) {
        markersGroupRef.current.clearLayers();

        markers.forEach((m) => {
          const isSelected = m.id === selectedMarkerId;
          let markerColor = '#3b82f6';
          let iconHtml = `<div class="w-4 h-4 rounded-full bg-sky-500 border-2 border-white shadow-lg"></div>`;

          if (m.type === 'CENTER') {
            // 🟢 Recycling Centers
            markerColor = '#10b981';
            iconHtml = `
              <div class="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xl border-2 border-slate-900 font-bold text-sm transform transition-transform hover:scale-110" title="Recycling Center">
                🟢
              </div>`;
          } else if (m.type === 'PICKUP') {
            // 🟡 Collection Requests
            markerColor = '#f59e0b';
            iconHtml = `
              <div class="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xl border-2 border-slate-900 font-bold text-sm transform transition-transform hover:scale-110" title="Collection Request">
                🟡
              </div>`;
          } else if (m.type === 'NEW_PIN') {
            markerColor = '#f59e0b';
            iconHtml = `
              <div class="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-2xl border-4 border-slate-950 animate-bounce">
                📍
              </div>`;
          } else {
            // Waste Report markers
            if (m.status === 'RESOLVED' || m.status === 'COMPLETED' || m.status === 'COLLECTED') {
              // 🔵 Completed Collections
              markerColor = '#3b82f6';
              iconHtml = `<div class="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl border-2 border-slate-900 font-bold text-sm transform transition-transform hover:scale-110" title="Completed Collection">🔵</div>`;
            } else if (m.status === 'IN_PROGRESS' || m.status === 'ASSIGNED') {
              markerColor = '#06b6d4';
              iconHtml = `<div class="w-9 h-9 rounded-full bg-cyan-600 text-white flex items-center justify-center shadow-xl border-2 border-slate-900 font-bold text-sm animate-pulse" title="In Progress">🚚</div>`;
            } else if (m.severity === 'CRITICAL' || m.severity === 'HIGH') {
              // 🔴 Waste Reports
              markerColor = '#ef4444';
              iconHtml = `<div class="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl border-2 border-slate-900 font-bold text-sm animate-bounce" title="Waste Report">🔴</div>`;
            } else {
              // 🔴 Waste Reports
              markerColor = '#ef4444';
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
            <div class="p-1 max-w-xs font-sans">
              ${m.imageUrl ? `<img src="${m.imageUrl}" class="w-full h-28 object-cover rounded-lg mb-2 border border-slate-800" />` : ''}
              <div class="font-bold text-sm text-slate-100 mb-1">${m.title}</div>
              ${m.address ? `<div class="text-xs text-slate-400 mb-2">📍 ${m.address}</div>` : ''}
              ${
                m.type === 'CENTER'
                  ? `<div class="text-xs text-emerald-400 font-medium mb-1">Materials: ${m.acceptedMaterials}</div>
                     <div class="text-[11px] text-slate-400">🕒 ${m.operatingHours || '8am - 6pm'}</div>`
                  : `<div class="flex items-center gap-1.5 text-xs mb-1">
                      <span class="px-2 py-0.5 rounded-full font-bold text-[10px] uppercase bg-slate-800 text-slate-300">${m.category || 'GENERAL'}</span>
                      <span class="px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${m.status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}">${m.status || 'PENDING'}</span>
                     </div>`
              }
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

    return () => {
      isMounted = false;
    };
  }, [markers, selectedMarkerId, centerLat, centerLng, zoom, onLocationSelect, onMarkerClick]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      <div ref={mapContainerRef} style={{ height }} className="w-full" />
      <div className="absolute top-3 left-3 z-10 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-300 shadow-lg flex items-center gap-2">
        <Navigation className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
        <span>EcoBin Live GPS Map</span>
        <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-mono">
          {markers.length} Pins
        </span>
      </div>
    </div>
  );
}
