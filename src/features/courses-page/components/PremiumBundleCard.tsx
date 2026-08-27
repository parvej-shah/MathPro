import ComboCard from "./ComboCard";
import { Bundle } from "../_lib/types";

interface PremiumBundleCardProps {
  bundle: Bundle;
  showPrice?: boolean;
}

export default function PremiumBundleCard({ bundle, showPrice = true }: PremiumBundleCardProps) {
  return <ComboCard combo={bundle} showPrice={showPrice} />;
}
