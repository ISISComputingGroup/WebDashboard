import { IfcPV } from "@/app/components/IfcPV";

export default interface IfcBlock extends IfcPV {
  runcontrol_enabled?: boolean;
  runcontrol_inrange?: boolean;
  visible?: boolean;
  suspend_on_invalid?: boolean;
  low_rc?: number;
  high_rc?: number;
}
