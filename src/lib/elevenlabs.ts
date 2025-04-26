import { ElevenLabsClient } from 'elevenlabs';  // Initialize ElevenLabs with API key
// W środowisku Vite zmienne środowiskowe muszą mieć prefiks VITE_
const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY || '';
console.log('ElevenLabs API Key (masked):', apiKey ? `${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 5)}` : 'not set');

// Audio recording configuration
export const AUDIO_CONFIG = {
  sampleRate: 16000, // ElevenLabs prefers 16kHz sample rate
  channels: 1,       // Mono audio
  bitRate: 128000,   // 128 kbps
};

/**
 * Converts speech to text using ElevenLabs API
 * @param audioBlob - Audio blob to transcribe
 * @returns Transcription text
 */
export async function transcribeSpeech(audioBlob: Blob): Promise<string> {
  try {
    console.log(`Sending audio for transcription: type=${audioBlob.type}, size=${audioBlob.size} bytes`);

    // Convert to proper format if needed
    let processedBlob = audioBlob;

    // If the blob is not in a format that ElevenLabs accepts, convert it
    if (!audioBlob.type.includes('wav') && !audioBlob.type.includes('mp3') && !audioBlob.type.includes('webm')) {
      console.log('Converting audio to webm format');
      // Use the original blob as is, but with the correct MIME type
      processedBlob = new Blob([await audioBlob.arrayBuffer()], { type: 'audio/webm' });
    }

    // Create a File object with the correct name and type
    const audioFile = new File(
      [processedBlob],
      `recording.${processedBlob.type.includes('webm') ? 'webm' : 'wav'}`,
      { type: processedBlob.type }
    );

    // Create a FormData object to send the audio file
    const formData = new FormData();

    // Add the file to the form data
    formData.append('file', audioFile);

    // Add required parameters according to ElevenLabs documentation
    formData.append('model_id', 'scribe_v1'); // Use the correct model ID
    formData.append('diarize', 'false'); // No need for speaker diarization
    formData.append('tag_audio_events', 'false'); // No need for audio events
    formData.append('language_code', 'pol'); // Polish language code to improve accuracy

    console.log(`Sending file to ElevenLabs API: name=${audioFile.name}, type=${audioFile.type}, size=${audioFile.size} bytes`);

    // Make a direct API call to ElevenLabs speech-to-text endpoint
    const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        // Don't set Content-Type header when using FormData
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error response:', errorText);
      throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Transcription result:', data);

    // Return the transcribed text
    if (data && data.text) {
      return data.text;
    } else if (data && data.words && data.words.length > 0) {
      // If text is not directly available, try to extract it from words
      return data.words
        .filter((word: any) => word.type === 'word')
        .map((word: any) => word.text)
        .join('');
    }

    return '';
  } catch (error) {
    console.error('Error transcribing speech:', error);
    throw error; // Re-throw to allow proper error handling in the component
  }
}




