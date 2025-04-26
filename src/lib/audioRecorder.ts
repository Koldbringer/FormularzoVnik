import { AUDIO_CONFIG } from './elevenlabs';

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;

  /**
   * Start recording audio
   * @returns Promise that resolves when recording starts
   */
  async startRecording(): Promise<void> {
    try {
      // Try to get the best audio quality possible
      const constraints = {
        audio: {
          sampleRate: AUDIO_CONFIG.sampleRate,
          channelCount: AUDIO_CONFIG.channels,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      };

      console.log('Requesting microphone access with constraints:', constraints);

      // Request microphone access with specific constraints
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);

      // Log the actual track settings we got
      const audioTrack = this.stream.getAudioTracks()[0];
      const settings = audioTrack.getSettings();
      console.log('Actual audio track settings:', settings);

      // Try different MIME types in order of preference
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/mp4',
        'audio/wav',
        ''  // Default
      ];

      // Find the first supported MIME type
      let options = {};
      for (const mimeType of mimeTypes) {
        if (!mimeType || MediaRecorder.isTypeSupported(mimeType)) {
          options = mimeType ? { mimeType, audioBitsPerSecond: AUDIO_CONFIG.bitRate } : {};
          console.log(`Using MIME type: ${mimeType || 'browser default'}`);
          break;
        }
      }

      // Create media recorder with the selected options
      this.mediaRecorder = new MediaRecorder(this.stream, options);
      this.audioChunks = [];

      // Set up event handlers
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      // Start recording with small timeslice to get frequent chunks
      this.mediaRecorder.start(250); // Get data every 250ms

      console.log('Recording started with format:', this.mediaRecorder.mimeType);
    } catch (error) {
      console.error('Error starting recording:', error);
      throw new Error('Could not access microphone');
    }
  }

  /**
   * Stop recording audio
   * @returns Promise that resolves with the recorded audio blob
   */
  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No recording in progress'));
        return;
      }

      this.mediaRecorder.onstop = async () => {
        try {
          // Get the MIME type from the recorder
          const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';

          // Combine audio chunks into a single blob
          const audioBlob = new Blob(this.audioChunks, { type: mimeType });

          console.log(`Recording stopped. Created blob of type ${mimeType}, size: ${audioBlob.size} bytes`);

          // Validate the audio blob
          if (audioBlob.size < 1000) {
            console.warn('Audio blob is too small, might be empty or corrupted');
          }

          // Clean up
          this.releaseMediaStream();

          // For debugging - log the first few bytes of the blob
          if (audioBlob.size > 0) {
            const buffer = await audioBlob.arrayBuffer();
            const bytes = new Uint8Array(buffer.slice(0, Math.min(50, buffer.byteLength)));
            console.log('Audio blob first bytes:', Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' '));
          }

          resolve(audioBlob);
        } catch (error) {
          console.error('Error processing audio blob:', error);
          reject(error);
        }
      };

      // Stop recording
      this.mediaRecorder.stop();
    });
  }

  /**
   * Cancel recording and clean up resources
   */
  cancelRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    this.releaseMediaStream();
  }

  /**
   * Release media stream and clean up resources
   */
  private releaseMediaStream(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
  }
}
