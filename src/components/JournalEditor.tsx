import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Eraser, Mic, MicOff } from "lucide-react";

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

interface JournalEditorProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

const JournalEditor = ({ value, onChange, onClear }: JournalEditorProps) => {
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    return () => recognitionRef.current?.stop();
  }, []);

  const handleSpeechToggle = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const SpeechRecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionApi) {
      setSpeechError("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognitionApi();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = navigator.language || "en-US";
    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const transcript = result[0]?.transcript ?? "";
        if (result.isFinal) finalText += transcript;
        else interimText += transcript;
      }

      if (finalText.trim()) {
        const currentValue = valueRef.current;
        const separator = currentValue.trim() && !/[\s\n]$/.test(currentValue) ? " " : "";
        const nextValue = `${currentValue}${separator}${finalText.trim()}`;
        valueRef.current = nextValue;
        onChange(nextValue);
      }

      setInterimTranscript(interimText.trim());
    };
    recognition.onerror = () => {
      setSpeechError("Microphone transcription stopped. Check browser permission and try again.");
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript("");
    };

    setSpeechError(null);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="relative"
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Let the ink flow... What's on your mind today?"
        className="w-full min-h-[280px] p-6 pr-24 rounded-xl bg-card text-card-foreground border border-border shadow-ink font-body text-base leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary/40 transition-all placeholder:text-muted-foreground/40 placeholder:italic"
      />
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <button
          onClick={handleSpeechToggle}
          className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all data-[listening=true]:text-primary data-[listening=true]:bg-primary/10"
          title={isListening ? "Stop dictation" : "Start dictation"}
          aria-label={isListening ? "Stop dictation" : "Start dictation"}
          data-listening={isListening}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
        {value && (
          <button
            onClick={onClear}
            className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            title="Clear entry"
            aria-label="Clear entry"
          >
            <Eraser className="w-4 h-4" />
          </button>
        )}
      </div>
      {(isListening || interimTranscript || speechError) && (
        <div className="absolute bottom-3 left-4 max-w-[70%] truncate font-mono text-xs text-muted-foreground/60">
          {speechError || interimTranscript || "Listening..."}
        </div>
      )}
      <div className="absolute bottom-3 right-3 font-mono text-xs text-muted-foreground/40">
        {value.length} chars
      </div>
    </motion.div>
  );
};

export default JournalEditor;
