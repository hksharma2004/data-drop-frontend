export default function Video() {
    return (
      <video width="1200" height="720" controls>
        <source src="/datadrop.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  }