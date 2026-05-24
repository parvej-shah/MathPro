import Lottie from "react-lottie";
import celebrationLottieData from "../pages/Animation - 1711894031153.json";

interface LottieAnimationProps {
  height?: string | number;
  width?: string | number;
}

const lottieOptions = {
  loop: true,
  autoplay: true,
  animationData: celebrationLottieData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export default function LottieAnimation({
  height,
  width,
}: LottieAnimationProps) {
  return <Lottie options={lottieOptions} height={height} width={width} />;
}
