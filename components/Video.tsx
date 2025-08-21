export default function Video() {
    return (
      <video
        className="w-full h-auto border-4 border-black shadow-neo"
        style={{ aspectRatio: '16/9', objectFit: 'cover' }}
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/datadrop.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  }