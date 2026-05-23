// import React, { useState, useEffect, useRef } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
// import { Button } from '../ui/button';
// import { Badge } from '../ui/badge';
// import { Mic, MicOff, Volume2, VolumeX, Settings, Eye, EyeOff, Type, Zap } from 'lucide-react';
// import { useLanguage } from '../../lib/language-context';
// import { getAllStations } from '../../lib/realMetroService';

// const VoiceCommands = () => {
//   const { t } = useLanguage();
//   const [isListening, setIsListening] = useState(false);
//   const [transcript, setTranscript] = useState('');
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [voiceEnabled, setVoiceEnabled] = useState(true);
//   const [highContrast, setHighContrast] = useState(false);
//   const [largeText, setLargeText] = useState(false);
//   const [commands, setCommands] = useState([]);
//   const recognitionRef = useRef(null);
//   const synthRef = useRef(null);

//   useEffect(() => {
//     // Initialize speech recognition
//     if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//       recognitionRef.current = new SpeechRecognition();
//       recognitionRef.current.continuous = false;
//       recognitionRef.current.interimResults = false;
//       recognitionRef.current.lang = 'en-IN';

//       recognitionRef.current.onresult = (event) => {
//         const speechResult = event.results[0][0].transcript;
//         setTranscript(speechResult);
//         processVoiceCommand(speechResult);
//       };

//       recognitionRef.current.onend = () => {
//         setIsListening(false);
//       };

//       recognitionRef.current.onerror = (event) => {
//         console.error('Speech recognition error:', event.error);
//         setIsListening(false);
//         speak('Sorry, I could not understand that. Please try again.');
//       };
//     }

//     // Initialize speech synthesis
//     if ('speechSynthesis' in window) {
//       synthRef.current = window.speechSynthesis;
//     }

//     return () => {
//       if (recognitionRef.current) {
//         recognitionRef.current.stop();
//       }
//       if (synthRef.current) {
//         synthRef.current.cancel();
//       }
//     };
//   }, []);

//   const speak = (text) => {
//     if (!voiceEnabled || !synthRef.current) return;

//     setIsSpeaking(true);
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = 'en-IN';
//     utterance.rate = 0.9;
//     utterance.pitch = 1;

//     utterance.onend = () => {
//       setIsSpeaking(false);
//     };

//     synthRef.current.speak(utterance);
//   };

//   const startListening = () => {
//     if (recognitionRef.current && !isListening) {
//       setIsListening(true);
//       setTranscript('');
//       recognitionRef.current.start();
//       speak('Listening for your command');
//     }
//   };

//   const stopListening = () => {
//     if (recognitionRef.current && isListening) {
//       recognitionRef.current.stop();
//       setIsListening(false);
//     }
//   };

//   const processVoiceCommand = (command) => {
//     const lowerCommand = command.toLowerCase();
//     let response = '';
//     let action = '';

//     // Route planning commands
//     if (lowerCommand.includes('go to') || lowerCommand.includes('route to')) {
//       const destination = extractStationName(lowerCommand);
//       if (destination) {
//         response = `Planning route to ${destination}`;
//         action = `route-${destination}`;
//       } else {
//         response = 'Please specify a destination station';
//       }
//     }
//     // Station information commands
//     else if (lowerCommand.includes('info') || lowerCommand.includes('about')) {
//       const station = extractStationName(lowerCommand);
//       if (station) {
//         response = `Getting information about ${station} station`;
//         action = `info-${station}`;
//       } else {
//         response = 'Please specify a station name';
//       }
//     }
//     // Live status commands
//     else if (lowerCommand.includes('status') || lowerCommand.includes('delay')) {
//       response = 'Checking live metro status';
//       action = 'status-check';
//     }
//     // Crowd level commands
//     else if (lowerCommand.includes('crowd') || lowerCommand.includes('busy')) {
//       response = 'Checking crowd levels at stations';
//       action = 'crowd-check';
//     }
//     // Fare commands
//     else if (lowerCommand.includes('fare') || lowerCommand.includes('cost')) {
//       response = 'Opening fare calculator';
//       action = 'fare-calculator';
//     }
//     // Alarm commands
//     else if (lowerCommand.includes('alarm') || lowerCommand.includes('remind')) {
//       response = 'Opening travel alarm settings';
//       action = 'set-alarm';
//     }
//     // Help commands
//     else if (lowerCommand.includes('help') || lowerCommand.includes('commands')) {
//       response = 'Here are some voice commands you can use: Go to [station], Info about [station], Check status, Check crowd levels, Calculate fare, Set alarm';
//       action = 'help';
//     }
//     else {
//       response = 'I heard: ' + command + '. Try saying "help" for available commands.';
//       action = 'unknown';
//     }

//     speak(response);

//     // Log the command
//     const newCommand = {
//       id: Date.now(),
//       command: command,
//       response: response,
//       action: action,
//       timestamp: new Date()
//     };
//     setCommands(prev => [newCommand, ...prev.slice(0, 9)]); // Keep last 10 commands
//   };

//   const extractStationName = (command) => {
//     const stations = getAllStations();
//     const stationNames = stations.map(s => s.name.toLowerCase());

//     for (const stationName of stationNames) {
//       if (command.includes(stationName)) {
//         return stations.find(s => s.name.toLowerCase() === stationName)?.name;
//       }
//     }
//     return null;
//   };

//   const toggleVoice = () => {
//     if (isSpeaking) {
//       synthRef.current?.cancel();
//       setIsSpeaking(false);
//     } else {
//       setVoiceEnabled(!voiceEnabled);
//     }
//   };

//   const accessibilityCommands = [
//     { command: 'Go to [station name]', description: 'Plan route to a station' },
//     { command: 'Info about [station]', description: 'Get station information' },
//     { command: 'Check status', description: 'View live metro status' },
//     { command: 'Check crowd levels', description: 'See station crowd levels' },
//     { command: 'Calculate fare', description: 'Open fare calculator' },
//     { command: 'Set alarm', description: 'Create travel alarm' },
//     { command: 'Help', description: 'Show available commands' },
//   ];

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h2 className="text-2xl font-bold">{t('voice.title')}</h2>
//           <p className="text-gray-600">{t('voice.subtitle')}</p>
//         </div>
//         <div className="flex gap-2">
//           <Button
//             variant={voiceEnabled ? "default" : "outline"}
//             onClick={toggleVoice}
//             className="flex items-center gap-2"
//           >
//             {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
//             {voiceEnabled ? t('voice.voiceOn') : t('voice.voiceOff')}
//           </Button>
//         </div>
//       </div>

//       {/* Voice Control */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Mic className="w-5 h-5" />
//             {t('voice.voiceControl')}
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="flex items-center gap-4">
//             <Button
//               onClick={isListening ? stopListening : startListening}
//               variant={isListening ? "destructive" : "default"}
//               size="lg"
//               className="flex items-center gap-2"
//             >
//               {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
//               {isListening ? t('voice.stopListening') : t('voice.startListening')}
//             </Button>
//             {transcript && (
//               <div className="flex-1">
//                 <p className="text-sm text-gray-600">{t('voice.youSaid')}:</p>
//                 <p className="font-medium">{transcript}</p>
//               </div>
//             )}
//           </div>

//           {isListening && (
//             <div className="flex items-center gap-2 text-orange-600">
//               <div className="w-3 h-3 bg-orange-600 rounded-full animate-pulse"></div>
//               <span className="text-sm font-medium">{t('voice.listening')}</span>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Accessibility Settings */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Settings className="w-5 h-5" />
//             {t('voice.accessibility')}
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <Eye className="w-4 h-4" />
//                 <span className="text-sm">{t('voice.highContrast')}</span>
//               </div>
//               <input
//                 type="checkbox"
//                 checked={highContrast}
//                 onChange={(e) => setHighContrast(e.target.checked)}
//                 className="rounded"
//               />
//             </div>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <Type className="w-4 h-4" />
//                 <span className="text-sm">{t('voice.largeText')}</span>
//               </div>
//               <input
//                 type="checkbox"
//                 checked={largeText}
//                 onChange={(e) => setLargeText(e.target.checked)}
//                 className="rounded"
//               />
//             </div>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <Volume2 className="w-4 h-4" />
//                 <span className="text-sm">{t('voice.voiceFeedback')}</span>
//               </div>
//               <input
//                 type="checkbox"
//                 checked={voiceEnabled}
//                 onChange={(e) => setVoiceEnabled(e.target.checked)}
//                 className="rounded"
//               />
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Available Commands */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Zap className="w-5 h-5" />
//             {t('voice.availableCommands')}
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-2">
//             {accessibilityCommands.map((cmd, index) => (
//               <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
//                 <div>
//                   <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
//                     {cmd.command}
//                   </code>
//                 </div>
//                 <span className="text-sm text-gray-600">{cmd.description}</span>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Command History */}
//       <Card>
//         <CardHeader>
//           <CardTitle>{t('voice.commandHistory')}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {commands.length === 0 ? (
//             <p className="text-center text-gray-500 py-4">{t('voice.noCommands')}</p>
//           ) : (
//             <div className="space-y-3">
//               {commands.map(cmd => (
//                 <div key={cmd.id} className="p-3 border rounded-lg">
//                   <div className="flex justify-between items-start mb-2">
//                     <p className="font-medium">"{cmd.command}"</p>
//                     <Badge variant="outline" className="text-xs">
//                       {cmd.timestamp.toLocaleTimeString()}
//                     </Badge>
//                   </div>
//                   <p className="text-sm text-gray-600">{cmd.response}</p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default VoiceCommands;