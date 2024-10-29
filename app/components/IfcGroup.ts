import { IfcPV } from "@/app/components/IfcPV";

export interface IfcGroup {
  name: string;
  blocks: Array<IfcPV>;
}
