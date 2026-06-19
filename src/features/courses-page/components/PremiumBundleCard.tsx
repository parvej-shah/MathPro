import ComboCard from "./ComboCard";
import { Bundle } from "../_lib/types";

interface PremiumBundleCardProps {
  bundle: Bundle;
}

export default function PremiumBundleCard({ bundle }: PremiumBundleCardProps) {
  return <ComboCard combo={bundle} />;
}
