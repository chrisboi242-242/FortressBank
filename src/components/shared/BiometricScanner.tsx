"use client";
import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";

export default function BiometricScanner({ onCapture }: { onCapture: (img: string) => void }) {
  const webcamRef = useRef<Webcam>(null);
  const [status, setStatus] = useState<"READY"|"SCANNING"|"COMPLETE">("READY");

  const capture = useCallback(() => {
    const img = webcamRef.current?.getScreenshot();
    if (!img) return;
    setStatus("SCANNING");
    setTimeout(() => { onCapture(img); setStatus("COMPLETE"); }, 2500);
  }, [onCapture]);

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-xs mx-auto">
      <div className="relative">
        <div className="h-60 w-60 rounded-full overflow-hidden border-4 border-white/10 bg-black shadow-2xl relative z-10">
          {status !== "COMPLETE"
            ? <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="h-full w-full object-cover grayscale" />
            : <div className="h-full w-full flex items-center justify-center bg-zinc-900">
                <div className="h-16 w-16 rounded-full bg-[#00FF85]/20 border-2 border-[#00FF85] flex items-center justify-center">
                  <span className="text-[#00FF85] text-3xl">✓</span>
                </div>
              </div>
          }
          {status === "SCANNING" && (
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div className="w-full h-0.5 bg-[#00FF85] absolute top-0 animate-pulse shadow-[0_0_12px_#00FF85]" />
              <p className="text-[10px] font-mono text-[#00FF85] bg-black/70 px-3 py-1 rounded">ANALYZING...</p>
            </div>
          )}
        </div>
        <div className="absolute -top-1.5 -left-1.5 h-7 w-7 border-t-[3px] border-l-[3px] border-[#00FF85]" />
        <div className="absolute -bottom-1.5 -right-1.5 h-7 w-7 border-b-[3px] border-r-[3px] border-[#00FF85]" />
      </div>
      <p className={`text-xs font-black uppercase tracking-[0.25em] ${status === "COMPLETE" ? "text-[#00FF85]" : "text-white/40"}`}>
        {status === "READY" && "Align face in the circle"}
        {status === "SCANNING" && "Analysis in progress..."}
        {status === "COMPLETE" && "Identity captured ✓"}
      </p>
      {status === "READY" && (
        <button type="button" onClick={capture}
          className="px-8 h-11 bg-white/[0.04] border border-white/10 text-white text-xs font-black uppercase tracking-widest rounded-full hover:border-[#00FF85] hover:text-[#00FF85] transition-all">
          Begin Scan
        </button>
      )}
    </div>
  );
}
