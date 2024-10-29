export default interface IfcPVWSMessage {
  type: string;
  pv: string;
  value?: number | null;
  text?: string | null;
  b64byt?: string | null;
  units?: string | null;
  precision?: number | null;
  labels?: string | null;
  min?: number | null;
  max?: number | null;
  warn_low?: number | null;
  warn_high?: number | null;
  alarm_low?: number | null;
  alarm_high?: number | null;
  severity?: string | null;
  seconds?: number | null;
  readonly?: boolean | null;
  nanos?: number | null;
}
