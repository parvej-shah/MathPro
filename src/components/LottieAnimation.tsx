import Lottie from "react-lottie";

interface LottieAnimationProps {
  height?: string | number;
  width?: string | number;
  animationData: object;
}

export default function LottieAnimation({
  height,
  width,
  animationData,
}: LottieAnimationProps) {
  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return <Lottie options={lottieOptions} height={height} width={width} />;
}
