export class PV {
  pvaddress: string;
  human_readable_name: null | string;
  severity: null | string;
  units: null | string;
  description: null | string;
  precision: null | number;
  min: null | number;
  max: null | number;
  warn_low: null | number;
  warn_high: null | number;
  alarm_low: null | number;
  alarm_high: null | number;
  value: null | string | number;
  runcontrol_enabled: boolean;
  runcontrol_inrange: boolean;
  visible: boolean;
  suspend_on_invald: boolean;
  low_rc: null | number;
  high_rc: null | number;

  constructor(pvaddress: string) {
    this.pvaddress = pvaddress;
    this.human_readable_name = null;
    this.severity = null;
    this.units = null;
    this.description = null;
    this.precision = null;
    this.min = null;
    this.max = null;
    this.warn_low = null;
    this.warn_high = null;
    this.alarm_low = null;
    this.alarm_high = null;
    this.value = null;
    this.runcontrol_enabled = false;
    this.runcontrol_inrange = true;
    this.visible = false;
    this.suspend_on_invald = false;
    this.low_rc = null;
    this.high_rc = null;
  }
}
