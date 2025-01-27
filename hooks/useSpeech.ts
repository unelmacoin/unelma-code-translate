import { useEffect, useState } from "react";

let recognition: any = null
if(typeof window !== 'undefined' && 'webkitSpeechRecognition' in window){
 recognition = new webkitSpeechRecognition();
 recognition.continuous = true;
 recognition.lang = 'en-us';
}

export const useSpeech = () => {
  const [textSpeech, setTextSpeech] = useState('')
  const [isListening, setIsListening] = useState(false);

  useEffect(()=>{
    if(!recognition) return;
    recognition.onresult = (event: SpeechRecognitionEvent) =>{
      const transcript = Array.from(event.results)
      .map((result: SpeechRecognitionResult) => result[0])
      .map((result: SpeechRecognitionAlternative) => result.transcript)
      .join('');
    setTextSpeech(transcript);
      recognition.stop();
      setIsListening(false);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error(event.error);
      setIsListening(false);
    };

    return () => {
      recognition.stop();
    };
  }, []);


  const handleListening = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop();
      } else {
        setTextSpeech('');
        recognition.start();
      }
      setIsListening(!isListening);
    }
  };

  return {
    textSpeech,
    isListening,
    handleListening,
  };
};