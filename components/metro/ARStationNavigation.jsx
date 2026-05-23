// import React, { useState, useEffect, useRef } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
// import { Button } from '../ui/button';
// import { Badge } from '../ui/badge';
// import { Camera, CameraOff, Navigation, MapPin, Compass, Eye, Target, Zap } from 'lucide-react';
// import { useLanguage } from '../../lib/language-context';
// import { getAllStations } from '../../lib/realMetroService';

// const ARStationNavigation = () => {
//   const { t } = useLanguage();
//   const [isARActive, setIsARActive] = useState(false);
//   const [currentStation, setCurrentStation] = useState(null);
//   const [nearbyStations, setNearbyStations] = useState([]);
//   const [userLocation, setUserLocation] = useState(null);
//   const [compassHeading, setCompassHeading] = useState(0);
//   const [cameraPermission, setCameraPermission] = useState('unknown');
//   const [locationPermission, setLocationPermission] = useState('unknown');
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const streamRef = useRef(null);

//   useEffect(() => {
//     checkPermissions();
//     return () => {
//       stopAR();
//     };
//   }, []);

//   const checkPermissions = async () => {
//     try {
//       // Check camera permission
//       const cameraResult = await navigator.permissions.query({ name: 'camera' });
//       setCameraPermission(cameraResult.state);

//       // Check location permission
//       const locationResult = await navigator.permissions.query({ name: 'geolocation' });
//       setLocationPermission(locationResult.state);
//     } catch (error) {
//       console.error('Error checking permissions:', error);
//     }
//   };

//   const requestPermissions = async () => {
//     try {
//       // Request camera access
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: 'environment' }
//       });
//       streamRef.current = stream;

//       // Request location access
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setUserLocation({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude
//           });
//           setLocationPermission('granted');
//         },
//         (error) => {
//           console.error('Geolocation error:', error);
//           setLocationPermission('denied');
//         }
//       );

//       setCameraPermission('granted');
//       return true;
//     } catch (error) {
//       console.error('Permission request failed:', error);
//       setCameraPermission('denied');
//       setLocationPermission('denied');
//       return false;
//     }
//   };

//   const startAR = async () => {
//     if (cameraPermission !== 'granted' || locationPermission !== 'granted') {
//       const permissionsGranted = await requestPermissions();
//       if (!permissionsGranted) return;
//     }

//     try {
//       setIsARActive(true);

//       // Start camera
//       if (videoRef.current && streamRef.current) {
//         videoRef.current.srcObject = streamRef.current;
//         videoRef.current.play();
//       }

//       // Start compass
//       if ('DeviceOrientationEvent' in window) {
//         window.addEventListener('deviceorientation', handleOrientation);
//       }

//       // Find nearby stations
//       updateNearbyStations();

//       // Start AR rendering loop
//       renderAR();
//     } catch (error) {
//       console.error('Error starting AR:', error);
//       setIsARActive(false);
//     }
//   };

//   const stopAR = () => {
//     setIsARActive(false);

//     // Stop camera
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach(track => track.stop());
//       streamRef.current = null;
//     }

//     // Stop compass
//     window.removeEventListener('deviceorientation', handleOrientation);

//     // Clear canvas
//     if (canvasRef.current) {
//       const ctx = canvasRef.current.getContext('2d');
//       ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
//     }
//   };

//   const handleOrientation = (event) => {
//     if (event.alpha !== null) {
//       setCompassHeading(event.alpha);
//     }
//   };

//   const updateNearbyStations = () => {
//     if (!userLocation) return;

//     const allStations = getAllStations();
//     const nearby = allStations
//       .map(station => ({
//         ...station,
//         distance: calculateDistance(userLocation, station.location),
//         bearing: calculateBearing(userLocation, station.location)
//       }))
//       .filter(station => station.distance < 2000) // Within 2km
//       .sort((a, b) => a.distance - b.distance)
//       .slice(0, 5); // Top 5 nearest

//     setNearbyStations(nearby);

//     // Set current station (closest)
//     if (nearby.length > 0) {
//       setCurrentStation(nearby[0]);
//     }
//   };

//   const calculateDistance = (pos1, pos2) => {
//     const R = 6371e3; // Earth's radius in meters
//     const φ1 = pos1.lat * Math.PI / 180;
//     const φ2 = pos2.lat * Math.PI / 180;
//     const Δφ = (pos2.lat - pos1.lat) * Math.PI / 180;
//     const Δλ = (pos2.lng - pos1.lng) * Math.PI / 180;

//     const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
//               Math.cos(φ1) * Math.cos(φ2) *
//               Math.sin(Δλ/2) * Math.sin(Δλ/2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

//     return R * c;
//   };

//   const calculateBearing = (pos1, pos2) => {
//     const φ1 = pos1.lat * Math.PI / 180;
//     const φ2 = pos2.lat * Math.PI / 180;
//     const λ1 = pos1.lng * Math.PI / 180;
//     const λ2 = pos2.lng * Math.PI / 180;

//     const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
//     const x = Math.cos(φ1) * Math.sin(φ2) -
//               Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);

//     const θ = Math.atan2(y, x);
//     return (θ * 180 / Math.PI + 360) % 360;
//   };

//   const renderAR = () => {
//     if (!isARActive || !canvasRef.current || !videoRef.current) return;

//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
//     const video = videoRef.current;

//     // Set canvas size to match video
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;

//     // Clear canvas
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // Draw station markers
//     nearbyStations.forEach(station => {
//       drawStationMarker(ctx, station);
//     });

//     // Continue rendering
//     requestAnimationFrame(renderAR);
//   };

//   const drawStationMarker = (ctx, station) => {
//     const canvas = ctx.canvas;
//     const centerX = canvas.width / 2;
//     const centerY = canvas.height / 2;

//     // Calculate position based on bearing and distance
//     const relativeBearing = (station.bearing - compassHeading + 360) % 360;
//     const distance = Math.min(station.distance / 10, 200); // Scale distance

//     // Convert bearing to screen coordinates
//     const angle = (relativeBearing - 90) * Math.PI / 180; // -90 to account for camera orientation
//     const x = centerX + Math.cos(angle) * distance;
//     const y = centerY + Math.sin(angle) * distance;

//     // Only draw if marker is on screen
//     if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
//       // Draw marker
//       ctx.fillStyle = 'rgba(59, 130, 246, 0.8)';
//       ctx.beginPath();
//       ctx.arc(x, y, 20, 0, 2 * Math.PI);
//       ctx.fill();

//       // Draw direction arrow
//       ctx.strokeStyle = 'white';
//       ctx.lineWidth = 2;
//       ctx.beginPath();
//       ctx.moveTo(x, y);
//       ctx.lineTo(x + Math.cos(angle) * 15, y + Math.sin(angle) * 15);
//       ctx.stroke();

//       // Draw station name
//       ctx.fillStyle = 'white';
//       ctx.font = '12px Arial';
//       ctx.textAlign = 'center';
//       ctx.fillText(station.name, x, y - 30);

//       // Draw distance
//       ctx.fillText(`${Math.round(station.distance)}m`, x, y + 35);
//     }
//   };

//   const getPermissionStatus = (status) => {
//     switch (status) {
//       case 'granted': return { text: t('ar.granted'), color: 'bg-green-100 text-green-800' };
//       case 'denied': return { text: t('ar.denied'), color: 'bg-red-100 text-red-800' };
//       case 'prompt': return { text: t('ar.prompt'), color: 'bg-yellow-100 text-yellow-800' };
//       default: return { text: t('ar.unknown'), color: 'bg-gray-100 text-gray-800' };
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h2 className="text-2xl font-bold">{t('ar.title')}</h2>
//           <p className="text-gray-600">{t('ar.subtitle')}</p>
//         </div>
//         <Button
//           onClick={isARActive ? stopAR : startAR}
//           variant={isARActive ? "destructive" : "default"}
//           className="flex items-center gap-2"
//         >
//           {isARActive ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
//           {isARActive ? t('ar.stopAR') : t('ar.startAR')}
//         </Button>
//       </div>

//       {/* Permissions Status */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Eye className="w-5 h-5" />
//             {t('ar.permissions')}
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-3">
//           <div className="flex justify-between items-center">
//             <span className="text-sm font-medium">{t('ar.camera')}</span>
//             <Badge className={getPermissionStatus(cameraPermission).color}>
//               {getPermissionStatus(cameraPermission).text}
//             </Badge>
//           </div>
//           <div className="flex justify-between items-center">
//             <span className="text-sm font-medium">{t('ar.location')}</span>
//             <Badge className={getPermissionStatus(locationPermission).color}>
//               {getPermissionStatus(locationPermission).text}
//             </Badge>
//           </div>
//         </CardContent>
//       </Card>

//       {/* AR View */}
//       {isARActive && (
//         <Card>
//           <CardContent className="p-0">
//             <div className="relative">
//               <video
//                 ref={videoRef}
//                 className="w-full h-96 object-cover rounded-lg"
//                 playsInline
//                 muted
//               />
//               <canvas
//                 ref={canvasRef}
//                 className="absolute top-0 left-0 w-full h-96 pointer-events-none"
//               />

//               {/* AR Overlay Info */}
//               <div className="absolute top-4 left-4 bg-black/70 text-white p-3 rounded-lg">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Compass className="w-4 h-4" />
//                   <span className="text-sm">{Math.round(compassHeading)}°</span>
//                 </div>
//                 {currentStation && (
//                   <div>
//                     <p className="text-sm font-medium">{currentStation.name}</p>
//                     <p className="text-xs">{Math.round(currentStation.distance)}m away</p>
//                   </div>
//                 )}
//               </div>

//               {/* Center target */}
//               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
//                 <Target className="w-8 h-8 text-white opacity-50" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Nearby Stations */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <MapPin className="w-5 h-5" />
//             {t('ar.nearbyStations')}
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           {nearbyStations.length === 0 ? (
//             <p className="text-center text-gray-500 py-4">{t('ar.noNearbyStations')}</p>
//           ) : (
//             <div className="space-y-3">
//               {nearbyStations.map(station => (
//                 <div key={station.id} className="flex items-center justify-between p-3 border rounded-lg">
//                   <div>
//                     <h4 className="font-medium">{station.name}</h4>
//                     <p className="text-sm text-gray-600">
//                       {Math.round(station.distance)}m • {Math.round(station.bearing)}°
//                     </p>
//                   </div>
//                   <div className="text-right">
//                     <Badge variant="outline" className="mb-1">
//                       {station.lines?.join(', ')}
//                     </Badge>
//                     <p className="text-xs text-gray-500">
//                       {station.facilities?.includes('elevator') ? '♿' : ''}
//                       {station.facilities?.includes('parking') ? '🅿️' : ''}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Instructions */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Zap className="w-5 h-5" />
//             {t('ar.instructions')}
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-2 text-sm text-gray-600">
//             <p>• {t('ar.instruction1')}</p>
//             <p>• {t('ar.instruction2')}</p>
//             <p>• {t('ar.instruction3')}</p>
//             <p>• {t('ar.instruction4')}</p>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default ARStationNavigation;