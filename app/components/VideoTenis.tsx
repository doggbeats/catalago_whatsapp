export default function VideoTenis() {
  return (
    <div className="relative aspect-video h-full w-full overflow-hidden bg-black">
      <video
        className="relative z-10 h-full w-full bg-transparent object-contain p-2 sm:p-4"
        src="/video_tenis.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-label="Vídeo de apresentação de tênis"
      />
    </div>
  );
}
