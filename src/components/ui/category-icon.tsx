import {
  BatteryCharging,
  Cable,
  Headphones,
  House,
  Laptop,
  Lightbulb,
  Plug,
  Router,
  Smartphone,
  SmartphoneCharging,
  Speaker,
  Watch,
  type LucideIcon,
} from "lucide-react";
import type { CategoryIcon as IconName } from "@/types/catalog";

const icons: Record<IconName, LucideIcon> = {
  smartphone: Smartphone,
  accessories: SmartphoneCharging,
  cable: Cable,
  battery: BatteryCharging,
  headphones: Headphones,
  speaker: Speaker,
  laptop: Laptop,
  watch: Watch,
  plug: Plug,
  lightbulb: Lightbulb,
  home: House,
  router: Router,
};

export function CategoryIcon({ name, className }: { name: IconName; className?: string }) {
  const Icon = icons[name];
  return <Icon className={className} aria-hidden />;
}
