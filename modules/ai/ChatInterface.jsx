
import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Volume2, Loader2, Sparkles, Mic, X, MicOff, Paperclip, FileText, FileSpreadsheet, File as FileIcon } from 'lucide-react';
import { generateBioResponse, generateBioImage, generateSpeech } from '../../services/geminiService';

// --- Voice Mode Component ---
const VoiceOverlay = ({ onClose, onSend, isProcessing, isPlayingAudio }) => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);

  useEffect(() => {
    // Initialize Speech Recognition on mount
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recog = new SpeechRecognition();
      recog.continuous = true; // Keep listening until silence
      recog.lang = 'uz-UZ';
      recog.interimResults = true;

      recog.onstart = () => setIsListening(true);
      
      recog.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          interimTranscript += event.results[i][0].transcript;
        }
        setTranscript(interimTranscript);

        // Auto-send logic: detect silence
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        // Changed from 2000ms to 1000ms for faster response
        silenceTimerRef.current = setTimeout(() => {
          if (interimTranscript.trim().length > 0) {
            recog.stop();
            onSend(interimTranscript);
            setTranscript('');
          }
        }, 1000); 
      };

      recog.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recog;
      recog.start(); // Auto-start
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, []);

  const toggleMic = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  // Determine Visual State
  let visualState = 'idle'; // idle, listening, processing, speaking
  if (isProcessing) visualState = 'processing';
  else if (isPlayingAudio) visualState = 'speaking';
  else if (isListening) visualState = 'listening';

  return (
    <div className="absolute inset-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-fade-in">
      {/* Top Controls */}
      <div className="absolute top-6 right-6">
        <button 
          onClick={onClose}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
        >
          <X size={24} />
        </button>
      </div>

      {/* Main Visualizer (The Orb) */}
      <div className="relative flex items-center justify-center mb-12">
        {/* Glow Effects */}
        <div className={`absolute inset-0 rounded-full blur-3xl transition-all duration-700 ${
          visualState === 'listening' ? 'bg-orange-500/30 scale-150' : 
          visualState === 'speaking' ? 'bg-emerald-500/40 scale-125' : 
          visualState === 'processing' ? 'bg-blue-500/30 scale-110' :
          'bg-emerald-500/10 scale-100'
        }`}></div>

        {/* The Core Orb */}
        <div className={`w-40 h-40 rounded-full flex items-center justify-center relative shadow-2xl transition-all duration-500 ${
          visualState === 'listening' ? 'bg-gradient-to-br from-orange-500 to-red-600 scale-110 shadow-orange-500/50' :
          visualState === 'speaking' ? 'bg-gradient-to-br from-emerald-400 to-cyan-500 animate-pulse-slow shadow-emerald-500/50' :
          visualState === 'processing' ? 'bg-gradient-to-br from-blue-400 to-indigo-500 animate-spin-slow shadow-blue-500/50' :
          'bg-gradient-to-br from-gray-800 to-gray-700'
        }`}>
          {visualState === 'listening' && <Mic size={48} className="text-white animate-bounce" />}
          {visualState === 'speaking' && <Volume2 size={48} className="text-white" />}
          {visualState === 'processing' && <Loader2 size={48} className="text-white animate-spin" />}
          {visualState === 'idle' && <MicOff size={48} className="text-gray-400" />}
        </div>
        
        {/* Ripple Rings for Listening */}
        {visualState === 'listening' && (
           <>
             <div className="absolute w-40 h-40 border-2 border-orange-500/50 rounded-full animate-ping"></div>
             <div className="absolute w-40 h-40 border border-orange-500/30 rounded-full animate-ping delay-100"></div>
           </>
        )}
      </div>

      {/* Text Feedback */}
      <div className="text-center max-w-lg min-h-[80px]">
        {visualState === 'listening' && (
          <>
            <p className="text-white/60 text-sm mb-2 uppercase tracking-widest font-bold">Eshitilmoqda...</p>
            <p className="text-2xl font-light text-white">{transcript || "Gapiring..."}</p>
          </>
        )}
        {visualState === 'processing' && (
          <p className="text-emerald-400 text-xl animate-pulse">Javob tayyorlanmoqda...</p>
        )}
        {visualState === 'speaking' && (
          <p className="text-white/80 text-xl">EduBio AI gapirmoqda...</p>
        )}
        {visualState === 'idle' && (
           <p className="text-white/40">Mikrofon o'chiq. Gapirish uchun tugmani bosing.</p>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="mt-12 flex items-center gap-6">
        <button 
          onClick={toggleMic}
          className={`p-6 rounded-full transition-all duration-300 transform hover:scale-105 ${
            isListening 
            ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/40' 
            : 'bg-[#2a2a2a] text-emerald-500 hover:bg-[#333]'
          }`}
        >
          {isListening ? <Mic size={32} /> : <MicOff size={32} />}
        </button>
      </div>
    </div>
  );
};

// --- Helper for File Conversion ---
const fileToGenerativePart = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      // Remove data url prefix (e.g. "data:image/jpeg;base64," or "data:application/pdf;base64,")
      const base64Data = base64String.split(',')[1];
      resolve({
        data: base64Data,
        mimeType: file.type,
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// --- Helper for File Icons ---
const getFileIcon = (fileName) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext || '')) return <ImageIcon size={20} className="text-purple-400" />;
  if (['pdf'].includes(ext || '')) return <FileText size={20} className="text-red-400" />;
  if (['xls', 'xlsx', 'csv'].includes(ext || '')) return <FileSpreadsheet size={20} className="text-green-400" />;
  if (['doc', 'docx', 'txt'].includes(ext || '')) return <FileText size={20} className="text-blue-400" />;
  return <FileIcon size={20} className="text-gray-400" />;
};

// --- Main Chat Interface ---

export const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const samplePrompts = [
    "Fotosintez jarayoni bosqichlarini tushuntirib bera olasizmi?",
    "Hayvonlarda qon aylanishi qanday ishlaydi?",
    "O'simlik hujayrasi bilan hayvon hujayrasi farqi nimada?",
    "DNK va RNK ning asosiy vazifalari nimalardan iborat?"
  ];
  
  // File Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  
  const messagesEndRef = useRef(null);
  const audioContextRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate size (e.g., max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("Fayl hajmi 10MB dan oshmasligi kerak.");
        return;
      }

      setSelectedFile(file);
      
      // If it's an image, create a preview URL
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null); // No visual preview for docs, we show icon
      }
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async (textInput) => {
    const contentToSend = textInput || input;
    // Allow sending if there is a file, even if text is empty
    if ((!contentToSend.trim() && !selectedFile) || isLoading) return;

    // Create User Message
    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: contentToSend,
      timestamp: new Date(),
      type: 'text',
      // If image, show it. If doc, we can render a file card in the message history logic
      imageUrl: previewUrl || undefined 
    };

    setMessages(prev => [...prev, {
        ...userMsg,
        content: contentToSend || `[Fayl yuklandi: ${selectedFile?.name}]`
    }]);

    setInput('');
    setIsLoading(true);
    
    // Store file ref to send, then clear state
    const fileToSend = selectedFile;
    clearSelectedFile(); 

    try {
      const lowerInput = userMsg.content.toLowerCase();
      let responseText = '';
      let generatedImageUrl = undefined;

      // Handle Attachment (Image or Doc)
      if (fileToSend) {
        const filePart = await fileToGenerativePart(fileToSend);
        // Pass generic attachment
        responseText = await generateBioResponse(userMsg.content, filePart);
      } 
      // Handle Image Generation Request
      else if (lowerInput.includes('rasm chiz') || lowerInput.includes('create image') || lowerInput.includes('ko\'rsat')) {
        const imgUrl = await generateBioImage(userMsg.content);
        if (imgUrl) {
          generatedImageUrl = imgUrl;
          responseText = "Mana siz so'ragan rasm:";
        } else {
          responseText = await generateBioResponse(userMsg.content);
        }
      } 
      // Handle Standard Text
      else {
        responseText = await generateBioResponse(userMsg.content);
      }

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText,
        timestamp: new Date(),
        type: generatedImageUrl ? 'image' : 'text',
        imageUrl: generatedImageUrl
      };

      setMessages(prev => [...prev, aiMsg]);

      // If in voice mode, automatically play audio
      if (isVoiceMode) {
        playTTS(responseText);
      }

    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'model',
          content: "Kechirasiz, xatolik yuz berdi. Iltimos qayta urinib ko'ring.",
          timestamp: new Date(),
          type: 'text'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSamplePrompt = (prompt) => {
    if (isLoading) return;
    handleSend(prompt);
  };

  const playTTS = async (text) => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);
    
    try {
      // Clean text for speech if needed, but TTS generally handles some symbols well. 
      // The output text is already cleaned visually, but we pass raw text to TTS usually.
      const rawAudioBuffer = await generateSpeech(text);
      if (rawAudioBuffer) {
        if (!audioContextRef.current) {
          // Initialize AudioContext if not already done
          audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const ctx = audioContextRef.current;
        
        // --- MANUAL PCM DECODING ---
        const pcmData = new Int16Array(rawAudioBuffer);
        const floatData = new Float32Array(pcmData.length);
        
        for (let i = 0; i < pcmData.length; i++) {
          floatData[i] = pcmData[i] / 32768.0;
        }

        // Create an AudioBuffer. Gemini TTS typically uses 24000Hz.
        const audioBuffer = ctx.createBuffer(1, floatData.length, 24000);
        audioBuffer.copyToChannel(floatData, 0);
        
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => setIsPlayingAudio(false);
        source.start(0);
      } else {
        setIsPlayingAudio(false);
      }
    } catch (e) {
      console.error("Audio playback error:", e);
      setIsPlayingAudio(false);
    }
  };

  // --- Helper to render text clearly with Custom Colors ---
  const renderCleanText = (text) => {
    if (!text) return null;

    // 1. Remove Headers (### Title -> Title)
    // Replace 1-6 hashes at the start of a line or anywhere followed by space
    let cleanText = text.replace(/#{1,6}\s?/g, '');

    // 2. Remove Horizontal Rules (--- or ___)
    cleanText = cleanText.replace(/[-_]{3,}/g, '');

    // 3. Clean Lists (* Item -> • Item)
    cleanText = cleanText.replace(/^\s*[\-\*]\s/gm, '• ');

    // 4. Parse Custom Colored Tags
    // Patterns: 
    // **text** -> Green/Teal (Terms)
    // [[text]] -> Orange/Amber (Important)
    // ((text)) -> Purple/Pink (Latin/Names)
    
    const parts = cleanText.split(/(\*\*.*?\*\*|\[\[.*?\]\]|\(\(.*?\)\))/g);
    
    return parts.map((part, index) => {
      // Handle **Term** (Teal)
      if (part.startsWith('**') && part.endsWith('**')) {
        const content = part.slice(2, -2);
        return (
          <span key={index} className="text-teal-400 font-extrabold tracking-wide drop-shadow-[0_0_5px_rgba(45,212,191,0.3)]">
            {content}
          </span>
        );
      }
      
      // Handle [[Important]] (Amber/Orange)
      if (part.startsWith('[[') && part.endsWith(']]')) {
        const content = part.slice(2, -2);
        return (
          <span key={index} className="text-amber-400 font-bold border-b border-amber-400/30">
            {content}
          </span>
        );
      }

      // Handle ((Scientific/Name)) (Purple)
      if (part.startsWith('((') && part.endsWith('))')) {
        const content = part.slice(2, -2);
        return (
          <span key={index} className="text-fuchsia-400 italic font-serif font-semibold">
            {content}
          </span>
        );
      }

      return part;
    });
  };

  return (
    <div className="flex flex-col h-full relative overflow-hidden bg-slate-900">
      
      {/* Styles for Animations */}
      <style>{`
        .box-shadow-neon { box-shadow: 0 0 20px rgba(52, 211, 153, 0.4); }
      `}</style>

      {/* Background Layer: Nature Scene */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ 
          // Mystical Green Forest Background
          backgroundImage: `url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop')`
        }}
      >
         {/* Minimal Dark Overlay for maximum clarity */}
         <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Voice Mode Overlay */}
      {isVoiceMode && (
        <VoiceOverlay 
          onClose={() => setIsVoiceMode(false)} 
          onSend={handleSend}
          isProcessing={isLoading}
          isPlayingAudio={isPlayingAudio}
        />
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 relative z-10 no-scrollbar">
        {/* Empty State Removed: Only Background Visible */}
        
        {messages.length === 0 && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 md:mt-14 mb-8">
            {samplePrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSamplePrompt(prompt)}
                className="text-left bg-black/55 border border-white/20 hover:border-emerald-400/50 hover:bg-black/65 backdrop-blur-sm transition-all rounded-2xl p-4 text-sm md:text-base font-medium text-white/90"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 backdrop-blur-md shadow-lg transition-all ${
              msg.role === 'user' 
                ? 'bg-emerald-900/70 text-white border border-emerald-500/30' 
                : 'bg-black/60 text-gray-100 border border-white/10'
            }`}>
              {msg.role === 'model' && (
                <div className="flex items-center gap-2 mb-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles size={12} /> EduBio AI
                </div>
              )}
              
              {/* Display Images */}
              {msg.imageUrl && (
                <img src={msg.imageUrl} alt="Uploaded or Generated" className="rounded-xl mb-3 max-h-80 w-full object-cover border border-white/10" />
              )}

              {/* Text Content with Auto-Formatting */}
              <p className="whitespace-pre-wrap leading-relaxed text-[15px] md:text-base">
                {renderCleanText(msg.content)}
              </p>
              
              {msg.role === 'model' && (
                <div className="flex items-center mt-3">
                  <button 
                    onClick={() => playTTS(msg.content)}
                    disabled={isPlayingAudio}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs text-emerald-200/70 transition-colors"
                  >
                    {isPlayingAudio ? <Loader2 className="animate-spin w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                    <span>O'qish</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-3 text-emerald-300 p-4 bg-black/40 rounded-xl backdrop-blur-sm border border-white/5">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium">Javob tayyorlanmoqda...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area (pb-24: pastki menyu ko'rinadigan ekranlarda yopilib qolmasligi uchun) */}
      <div className="p-3 pb-24 md:p-6 md:pb-24 lg:pb-6 z-20">
        <div className="max-w-3xl mx-auto relative">
          
          {/* File Preview (Both Images and Docs) */}
          {selectedFile && (
            <div className="absolute bottom-full left-0 mb-4 p-2 bg-black/80 rounded-xl border border-white/10 shadow-xl flex items-center gap-3 animate-fade-in backdrop-blur-md min-w-[150px]">
              {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
              ) : (
                  <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center">
                    {getFileIcon(selectedFile.name)}
                  </div>
              )}
              <div className="flex flex-col mr-2">
                  <span className="text-white text-sm font-medium truncate max-w-[150px]">{selectedFile.name}</span>
                  <span className="text-white/50 text-xs">{(selectedFile.size / 1024).toFixed(1)} KB</span>
              </div>
              <button 
                onClick={clearSelectedFile}
                className="p-1.5 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-colors ml-auto"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Input Bar - Natural/Glass Style */}
          <div className="relative flex items-center bg-black/50 backdrop-blur-xl rounded-full p-2 pr-2 shadow-2xl border border-white/10 transition-all focus-within:border-emerald-500/50 focus-within:bg-black/70 focus-within:shadow-emerald-500/10">
            
            {/* File Upload Button (Generic) */}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-colors ml-1"
              title="Fayl yuklash (Rasm, PDF, Word, Excel)"
            >
              <Paperclip size={20} />
            </button>

            <div className="pl-2 flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                placeholder={selectedFile ? "Fayl haqida so'rang..." : "Savol bering..."}
                className="w-full bg-transparent border-none text-white placeholder-gray-400 focus:ring-0 text-base outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
               {/* Microphone Button */}
               <button
                  onClick={() => setIsVoiceMode(true)}
                  disabled={isLoading}
                  className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  title="Ovozli rejimi"
               >
                  <Mic size={20} />
               </button>
               
               <button
                onClick={() => handleSend()}
                disabled={(!input.trim() && !selectedFile) || isLoading}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-emerald-600 text-white hover:bg-emerald-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
