import { useState, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { parseVoiceInput } from '@/lib/code-utils';

interface Props {
  onGenerate: (code: string) => void;
  isPending: boolean;
}

export default function VoiceInput({ onGenerate, isPending }: Props) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      const parsed = parseVoiceInput(text);
      if (parsed) onGenerate(parsed);
      else setTranscript(`"${text}" — could not parse`);
      setListening(false);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
    setTranscript('');
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  if (!isSupported) {
    return <p className="text-sm text-muted-foreground">Voice input not supported in this browser.</p>;
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Mic className="w-4 h-4" /> Voice Input
      </label>
      <div className="flex items-center gap-3">
        <Button
          variant={listening ? 'destructive' : 'outline'}
          onClick={listening ? stopListening : startListening}
          disabled={isPending}
          className={listening ? '' : 'border-primary/50 text-primary hover:bg-primary/10'}
        >
          {listening ? <><MicOff className="w-4 h-4" /> Stop</> : <><Mic className="w-4 h-4" /> Speak Code</>}
        </Button>
        {listening && <span className="text-sm text-primary animate-pulse-neon">Listening...</span>}
      </div>
      {transcript && <p className="text-sm font-mono text-muted-foreground">{transcript}</p>}
    </div>
  );
}
