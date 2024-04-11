import { useEffect, useState } from "react";

let recognition: any = null
if(typeof window !== 'undefined' && 'webkitSpeechRecognition' in window){
 recognition = new webkitSpeechRecognition();
 recognition.continuous = true;
 recognition.lang = 'en-us';
}

export const useSpeech = () => {
  const [textSpeech, setTextSpeech] = useState(' ')
  const [isListening, setIsListening] = useState(false);

  useEffect(()=>{
    if(!recognition) return;
    recognition.onresult = (event: SpeechRecognitionEvent) =>{
      setTextSpeech(event.results[0][0].transcript)
      recognition.stop();
      setIsListening(false);

    }
  }, [])

  const handleListening = () =>{
    if(recognition){
      setTextSpeech(' ')
    setIsListening(true);
    recognition.start()
  }
    
    if (recognition === null){
      alert("hello");
    }
  }


  return {
    textSpeech,
    isListening,
    recognition,
    handleListening,
  }

}