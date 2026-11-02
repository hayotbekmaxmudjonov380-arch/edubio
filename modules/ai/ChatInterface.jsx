import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Volume2, Loader2, Sparkles, Mic, X, MicOff, Paperclip, FileText, FileSpreadsheet, File as FileIcon, Atom } from 'lucide-react';
import { generateBioResponse, generatePhysicsResponse, generateBioImage, generateSpeech } from '../../services/geminiService';
import { useSystem, useSubject } from '../../context/SystemContext';

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
    } else {
      alert("Sizning brauzeringizda ovozli kiritish qo'llab-quvvatlanmaydi (Chrome ishlatib ko'ring).");
      onClose();
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-between p-8 text-white animate-fade-in">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="text-emerald-400 animate-pulse" size={20} />
          <span className="font-semibold text-sm tracking-wide text-gray-300">Ovozli Rejim</span>
        </div>
        <button 
          onClick={onClose}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex flex-col items-center justify-center gap-8 my-auto">
        <div className="relative">
          <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${
            isPlayingAudio
              ? 'bg-emerald-500/30 scale-110 shadow-[0_0_50px_rgba(16,185,129,0.5)]'
              : isListening
                ? 'bg-emerald-600/40 scale-100 shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-pulse'
                : 'bg-slate-800'
          }`}>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-colors ${
              isPlayingAudio ? 'bg-emerald-500' : isListening ? 'bg-emerald-600' : 'bg-slate-700'
            }`}>
              {isProcessing ? (
                <Loader2 className="animate-spin text-white" size={40} />
              ) : isPlayingAudio ? (
                <Volume2 className="animate-bounce text-white" size={40} />
              ) : (
                <Mic className="text-white" size={40} />
              )}
            </div>
          </div>
          {isListening && !isProcessing && !isPlayingAudio && (
            <div className="absolute -inset-4 rounded-full border-2 border-emerald-500/50 animate-ping pointer-events-none" />
          )}
        </div>

        <div className="text-center max-w-md">
          <p className="text-lg font-medium mb-2 min-h-[28px] text-emerald-300">
            {isPlayingAudio
              ? "EduBio AI gapirmoqda..."
              : isProcessing
                ? "O'ylanmoqda..."
                : transcript
                  ? `"${transcript}"`
                  : "Sizni eshitmoqdaman, gapiring..."}
          </p>
          <p className="text-xs text-gray-400">
            {isPlayingAudio
              ? "Ovozli javob berilmoqda"
              : "Gapirib bo'lganingizdan so'ng avtomatik yuboriladi"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={onClose}
          className="px-6 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-full font-medium text-sm transition-colors border border-red-500/30"
        >
          Ovozli rejimdan chiqish
        </button>
      </div>
    </div>
  );
};

export const ChatInterface = () => {
  const system = useSystem();
  const subject = useSubject();
  const isPhysics = system === 'institute' && subject?.id === 'fizika';

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isVoiceOverlayOpen, setIsVoiceOverlayOpen] = useState(false);
  
  // File Upload States
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const messagesEndRef = useRef(null);
  const audioContextRef = useRef(null);

  const bioSamplePrompts = [
    "O'simlik va hayvon hujayrasining farqi nima?",
    "Fotosintez jarayoni haqida qisqacha tushuntiring",
    "DNK va RNK o'rtasidagi asosiy tafovutlar",
    "Botanika fanining ahamiyati nimada?"
  ];

  const physicsSamplePrompts = [
    "Arximed kuchi va uning formulasi haqida tushuntirib ber",
    "Virtual laboratoriyada qanday xatolik qilganimni tahlil qilib ber",
    "Arximed kuchi bo'yicha o'zlashtirish yo'l haritasini tuzib ber",
    "Dinamometr va stakan yordamida og'irlikni qanday o'lchayman?"
  ];

  const samplePrompts = isPhysics ? physicsSamplePrompts : bioSamplePrompts;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("Fayl hajmi 10MB dan oshmasligi kerak.");
        return;
      }
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
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
    if ((!contentToSend.trim() && !selectedFile) || isLoading) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: contentToSend,
      timestamp: new Date(),
      type: 'text',
      imageUrl: previewUrl || undefined
    };

    setMessages(prev => [...prev, {
        ...userMsg,
        content: contentToSend || `[Fayl yuklandi: ${selectedFile?.name}]`
    }]);

    setInput('');
    setIsLoading(true);
    
    const fileToSend = selectedFile;
    clearSelectedFile(); 

    try {
      const lowerInput = userMsg.content.toLowerCase();
      let responseText = '';
      let generatedImageUrl = undefined;

      if (fileToSend) {
        const filePart = await fileToGenerativePart(fileToSend);
        responseText = isPhysics
          ? await generatePhysicsResponse(userMsg.content, filePart)
          : await generateBioResponse(userMsg.content, filePart);
      } 
      else if (lowerInput.includes('rasm chiz') || lowerInput.includes('create image') || lowerInput.includes('ko\'rsat')) {
        const imgUrl = await generateBioImage(userMsg.content);
        if (imgUrl) {
          generatedImageUrl = imgUrl;
          responseText = "Mana siz so'ragan rasmli tasvir:";
        } else {
          responseText = isPhysics
            ? await generatePhysicsResponse(userMsg.content)
            : await generateBioResponse(userMsg.content);
        }
      } 
      else {
        responseText = isPhysics
          ? await generatePhysicsResponse(userMsg.content)
          : await generateBioResponse(userMsg.content);
      }

      const botMsg = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText,
        timestamp: new Date(),
        type: generatedImageUrl ? 'image' : 'text',
        imageUrl: generatedImageUrl
      };

      setMessages(prev => [...prev, botMsg]);

      if (isVoiceOverlayOpen) {
        playAudioResponse(responseText);
      }

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: "Xatolik yuz berdi. Iltimos, ma'lum vaqtdan so'ng qayta urinib ko'ring.",
        timestamp: new Date(),
        type: 'text'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const playAudioResponse = async (text) => {
    try {
      setIsPlayingAudio(true);
      const audioBufferData = await generateSpeech(text);
      if (audioBufferData) {
        if (!audioContextRef.current) {
          // @ts-ignore
          audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        const ctx = audioContextRef.current;
        const decodedData = await ctx.decodeAudioData(audioBufferData);
        const source = ctx.createBufferSource();
        source.buffer = decodedData;
        source.connect(ctx.destination);
        source.onended = () => {
          setIsPlayingAudio(false);
        };
        source.start(0);
      } else {
        setIsPlayingAudio(false);
      }
    } catch (err) {
      console.error("Audio playback error:", err);
      setIsPlayingAudio(false);
    }
  };

  const fileToGenerativePart = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result.split(',')[1];
        resolve({
          data: base64Data,
          mimeType: file.type
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSamplePrompt = (promptText) => {
    handleSend(promptText);
  };

  const renderFormattedText = (text) => {
    if (!text) return null;
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-emerald-400">$1</span>')
      .replace(/\[\[(.*?)\]\]/g, '<span class="font-bold text-amber-300 bg-amber-950/40 px-1 py-0.5 rounded border border-amber-500/30">$1</span>')
      .replace(/\(\((.*?)\)\)/g, '<span class="italic text-purple-300">$1</span>');

    return <div dangerouslySetInnerHTML={{ __html: formatted.replace(/\n/g, '<br/>') }} />;
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950 text-white overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Voice Overlay */}
      {isVoiceOverlayOpen && (
        <VoiceOverlay 
          onClose={() => setIsVoiceOverlayOpen(false)}
          onSend={handleSend}
          isProcessing={isLoading}
          isPlayingAudio={isPlayingAudio}
        />
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 relative z-10 no-scrollbar">
        {messages.length === 0 && !isLoading && (
          <div className="max-w-2xl mx-auto mt-8 md:mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-semibold mb-4">
              <Sparkles size={16} /> {isPhysics ? "FizLab AI — Fizika va Laboratoriya Ustoz" : "EduBio AI Assistent"}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold mb-3 text-white">
              {isPhysics ? "Fizika bo'yicha savollaringizni bering" : "Biologiya va Tabiat fanlari bo'yicha savol bering"}
            </h1>
            <p className="text-slate-400 text-sm mb-8">
              {isPhysics
                ? "Laboratoriya tajribalari, Arximed kuchi, fizik masalalar hamda xatolar tahlili bo'yicha AI yordam oling."
                : "Hujayra biologiyasi, botanika, zoologiya va 3D modellar haqida so'rang."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
              {samplePrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSamplePrompt(prompt)}
                  className="bg-slate-900/80 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-800/90 transition-all rounded-2xl p-4 text-sm font-medium text-slate-200 shadow-md"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 backdrop-blur-md shadow-lg transition-all ${
              msg.role === 'user' 
                ? 'bg-teal-900/70 text-white border border-teal-500/30'
                : 'bg-slate-900/80 text-slate-100 border border-slate-800'
            }`}>
              {msg.role === 'model' && (
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-teal-400">
                  <Sparkles size={14} /> {isPhysics ? "FizLab AI Ustoz" : "EduBio AI"}
                </div>
              )}

              {msg.imageUrl && (
                <img
                  src={msg.imageUrl}
                  alt="Attachment"
                  className="w-full max-h-60 object-cover rounded-xl mb-3 border border-white/10"
                />
              )}

              <div className="text-sm leading-relaxed">
                {renderFormattedText(msg.content)}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
              <Loader2 size={18} className="animate-spin text-teal-400" />
              <span className="text-xs text-slate-300">FizLab AI o'ylanmoqda va tahlil qilmoqda...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="relative z-20 p-4 bg-slate-900/80 border-t border-slate-800 backdrop-blur-md">
        {selectedFile && (
          <div className="max-w-4xl mx-auto mb-3 flex items-center gap-3 bg-slate-800 p-2.5 rounded-xl border border-slate-700">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-10 h-10 object-cover rounded-lg" />
            ) : (
              <FileIcon size={24} className="text-teal-400" />
            )}
            <span className="text-xs text-slate-200 truncate max-w-xs">{selectedFile.name}</span>
            <button
              onClick={clearSelectedFile}
              className="ml-auto p-1 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors"
            title="Fayl yuklash"
          >
            <Paperclip size={20} />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isPhysics ? "Fizika masalasi yoki laboratoriya haqida so'rang..." : "Biologiya bo'yicha savolingizni yozing..."}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          <button
            onClick={() => setIsVoiceOverlayOpen(true)}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors"
            title="Ovozli kiritish"
          >
            <Mic size={20} />
          </button>

          <button
            onClick={() => handleSend()}
            disabled={isLoading || (!input.trim() && !selectedFile)}
            className="p-3 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-xl transition-colors font-semibold"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
