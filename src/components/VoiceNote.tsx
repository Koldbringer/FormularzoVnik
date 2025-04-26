
import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AudioRecorder } from "@/lib/audioRecorder";
import { transcribeSpeech } from "@/lib/elevenlabs";
import { toast } from "@/components/ui/sonner";

type Props = {
  value: string;
  setValue: (v: string) => void;
};

const VoiceNote = ({ value, setValue }: Props) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const timerRef = useRef<number | null>(null);

  // Initialize audio recorder
  useEffect(() => {
    recorderRef.current = new AudioRecorder();

    // Cleanup on unmount
    return () => {
      if (recorderRef.current) {
        recorderRef.current.cancelRecording();
      }

      // Clear timer if it's running
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  // Timer for recording duration
  useEffect(() => {
    if (isRecording) {
      setRecordingTime(0);
      setRecordingError(null);

      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      // Stop timer
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const handleStart = async () => {
    try {
      setRecordingError(null);
      setAudioBlob(null);

      if (!recorderRef.current) {
        recorderRef.current = new AudioRecorder();
      }

      // Check if browser supports audio recording
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        const errorMsg = "Twoja przeglądarka nie obsługuje nagrywania dźwięku";
        setRecordingError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      toast.info("Rozpoczynam nagrywanie...");
      await recorderRef.current.startRecording();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      const errorMsg = "Nie udało się uzyskać dostępu do mikrofonu. Upewnij się, że masz podłączony mikrofon i udzieliłeś zgody na dostęp.";
      setRecordingError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleStop = async () => {
    if (!recorderRef.current) return;

    try {
      setIsProcessing(true);
      setIsRecording(false);

      // Minimum recording time check (at least 1 second)
      if (recordingTime < 1) {
        const errorMsg = "Nagranie jest zbyt krótkie. Spróbuj ponownie i mów wyraźnie.";
        setRecordingError(errorMsg);
        toast.error(errorMsg);
        setIsProcessing(false);
        return;
      }

      toast.info(`Zatrzymano nagrywanie (${recordingTime}s). Przetwarzanie...`);

      // Stop recording and get audio blob
      const blob = await recorderRef.current.stopRecording();
      setAudioBlob(blob);

      // Check if the blob is valid
      if (!blob || blob.size < 1000) {
        const errorMsg = "Nagranie jest zbyt ciche lub puste. Spróbuj ponownie i mów głośniej.";
        setRecordingError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      toast.info(`Wysyłanie nagrania (${(blob.size / 1024).toFixed(1)} KB) do transkrypcji...`);

      try {
        toast.info("Transkrybuję nagranie...");

        // Transcribe audio using ElevenLabs
        const transcription = await transcribeSpeech(blob);

        if (transcription && transcription.trim() !== '') {
          setValue(transcription);
          toast.success("Transkrypcja zakończona pomyślnie");
          setRecordingError(null);
        } else {
          const errorMsg = "Nie wykryto mowy w nagraniu. Spróbuj ponownie i mów wyraźnie.";
          setRecordingError(errorMsg);
          toast.error(errorMsg);
        }
      } catch (transcriptionError) {
        console.error("Transcription error:", transcriptionError);

        // Provide specific error message
        let errorMsg = "Wystąpił błąd podczas transkrypcji";

        if (transcriptionError instanceof Error) {
          const errorMessage = transcriptionError.message;

          if (errorMessage.includes('422')) {
            if (errorMessage.includes('model_id')) {
              errorMsg = "Nieprawidłowy model transkrypcji. Skontaktuj się z administratorem.";
              console.error("Model ID error:", errorMessage);
            } else {
              errorMsg = "Format nagrania nie jest obsługiwany. Spróbuj ponownie w innej przeglądarce.";
            }
          } else if (errorMessage.includes('401')) {
            errorMsg = "Błąd autoryzacji API. Skontaktuj się z administratorem.";
          } else if (errorMessage.includes('429')) {
            errorMsg = "Przekroczono limit zapytań do API. Spróbuj ponownie za chwilę.";
          } else if (errorMessage.includes('invalid_model_id') || errorMessage.includes('model_id')) {
            errorMsg = "Błąd konfiguracji modelu API. Skontaktuj się z administratorem.";
            console.error("Model ID error:", errorMessage);
          } else if (errorMessage.includes('400')) {
            errorMsg = "Błąd przetwarzania nagrania. Spróbuj ponownie i mów wyraźniej.";
            console.error("API 400 error:", errorMessage);
          } else if (errorMessage.includes('missing')) {
            errorMsg = "Błąd w żądaniu API. Skontaktuj się z administratorem.";
            console.error("Missing field error:", errorMessage);
          } else {
            errorMsg = `Błąd transkrypcji. Spróbuj ponownie za chwilę.`;
            console.error("Transcription error details:", errorMessage);
          }
        }

        setRecordingError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Error processing recording:", error);
      const errorMsg = "Wystąpił błąd podczas przetwarzania nagrania";
      setRecordingError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  // Format seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full flex flex-col gap-2 mb-4">
      <div className="font-medium text-lg text-blue-900/80 flex items-center gap-2">
        {isRecording ? <Mic className="text-blue-400" /> : <MicOff className="text-blue-300" />}
        <label htmlFor="voice-transcription">Nie chce Ci się pisać? Zostaw notatkę głosową:</label>
      </div>

      <div className="flex items-center gap-4">
        <Button
          type="button"
          className={`rounded-full px-4 py-2 ${
            isRecording
              ? "bg-blue-200 hover:bg-blue-300"
              : "bg-blue-100 hover:bg-blue-200"
          } shadow transition-colors`}
          onClick={isRecording ? handleStop : handleStart}
          disabled={isProcessing}
          aria-label={isRecording ? "Zatrzymaj nagrywanie" : "Rozpocznij nagrywanie"}
        >
          {isProcessing ? (
            <>
              <Loader2 className="inline-block mr-1 animate-spin" /> Przetwarzanie...
            </>
          ) : isRecording ? (
            <>
              <Mic className="inline-block mr-1 animate-pulse text-red-500" /> Stop ({formatTime(recordingTime)})
            </>
          ) : (
            <>
              <MicOff className="inline-block mr-1" /> Start
            </>
          )}
        </Button>

        <span className="text-sm text-gray-500">
          {isProcessing
            ? "Przetwarzanie nagrania przez ElevenLabs API..."
            : isRecording
              ? "Mów wyraźnie do mikrofonu. Naciśnij Stop, aby zakończyć."
              : "Naciśnij Start, aby rozpocząć nagrywanie"}
        </span>
      </div>

      {/* Error message */}
      {recordingError && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          <p><strong>Błąd:</strong> {recordingError}</p>
          <p className="mt-1 text-xs text-gray-500">
            Wskazówka: Upewnij się, że masz dostęp do mikrofonu, mów wyraźnie i głośno.
            Spróbuj nagrać dłuższą wypowiedź (min. 2-3 sekundy).
          </p>
        </div>
      )}

      {/* Podgląd transkrypcji */}
      <textarea
        id="voice-transcription"
        name="voice-transcription"
        className="w-full min-h-[80px] p-2 rounded border mt-2 bg-white/60"
        value={value}
        placeholder="Transkrypcja notatki pojawi się tutaj..."
        onChange={(e) => setValue(e.target.value)}
        disabled={isRecording || isProcessing}
        autoComplete="off"
      />

      {/* Audio player */}
      {audioBlob && (
        <div className="mt-2 p-2 bg-blue-50 border border-blue-100 rounded">
          <p className="text-sm text-blue-700 mb-1" id="audio-label">Twoje nagranie ({(audioBlob.size / 1024).toFixed(1)} KB):</p>
          <audio
            controls
            src={URL.createObjectURL(audioBlob)}
            className="w-full"
            aria-labelledby="audio-label"
          />
        </div>
      )}
    </div>
  );
};

export default VoiceNote;
