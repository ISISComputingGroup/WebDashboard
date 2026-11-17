import type { instListEntry } from "@/app/types";

export interface BeamStatusRow {
  label: string;
  pv: string;
  /**
   * Name of the metric in the "value history" grafana dashboard, if one exists for this value.
   */
  grafanaMetric?: string;
}

export interface BeamStatusSectionDefinition {
  title: string;
  rows: Array<BeamStatusRow>;
}

const GRAFANA_VALUE_HISTORY_STUB =
  "https://shadow.nd.rl.ac.uk/grafana/d/xWibHehGk/value-history?viewPanel=2&orgId=1&var-metric=";

export function grafanaLink(metric: string): string {
  return GRAFANA_VALUE_HISTORY_STUB + metric;
}

export function instrumentPageLink(instrumentName: string): string {
  return "/instrument?name=" + instrumentName;
}

export const BEAM_STATUS_SECTIONS: Array<BeamStatusSectionDefinition> = [
  {
    title: "Accelerator",
    rows: [
      {
        label: "Synchrotron Beam Current",
        pv: "AC:SYNCH:BEAM:CURR",
        grafanaMetric: "ACCEL_synch_beam_curr",
      },
      {
        label: "EPB1 Beam Current",
        pv: "AC:EPB1:BEAM:CURR",
        grafanaMetric: "ACCEL_epb1_beam_curr",
      },
      {
        label: "Ion Source Beam Current",
        pv: "AC:IONS:BEAM:CURR",
        grafanaMetric: "ACCEL_ions_beam_curr",
      },
      {
        label: "RFQ Beam Current",
        pv: "AC:RFQ:BEAM:CURR",
        grafanaMetric: "ACCEL_rfq",
      },
      {
        label: "Linac Beam Current",
        pv: "AC:LINAC:BEAM:CURR",
        grafanaMetric: "ACCEL_linac_beam_curr",
      },
      { label: "Injection Efficiency", pv: "AC:INJ:EFF" },
      { label: "Acceleration Efficiency", pv: "AC:ACC:EFF" },
      { label: "Extraction Efficiency", pv: "AC:EXT:EFF" },
      { label: "Beam Energy", pv: "AC:BEAM:ENERGY" },
      {
        label: "Bunch Length",
        pv: "AC:BUNCH:LEN",
        grafanaMetric: "ACCEL_bunch_length",
      },
      {
        label: "Extract Delay",
        pv: "AC:EXTRACT:DELAY",
        grafanaMetric: "ACCEL_extract_delay",
      },
      { label: "Synchrotron Mode", pv: "AC:SYNCH:MODE" },
      { label: "Synchrotron Frequency", pv: "AC:SYNCH:FREQ" },
      { label: "GMS1", pv: "AC:SYNCH:GMS1" },
      { label: "GMS2", pv: "AC:SYNCH:GMS2" },
    ],
  },
  {
    title: "Target Station 1",
    rows: [
      { label: "Beam", pv: "AC:TS1:BEAM:STAT" },
      {
        label: "Beam Current",
        pv: "AC:TS1:BEAM:CURR",
        grafanaMetric: "ACCEL_ts1_beam_curr",
      },
      {
        label: "Frequency",
        pv: "AC:TS1:FREQ",
        grafanaMetric: "ACCEL_ts1_freq",
      },
      {
        label: "Beam Today (since 08:30)",
        pv: "AC:TS1:BEAM:TOTAL",
        grafanaMetric: "ACCEL_ts1_beam_total_uAh",
      },
      { label: "Beam Yesterday", pv: "AC:TS1:BEAM:YEST" },
      { label: "Last Beam On", pv: "AC:TS1:BEAMON:TIME" },
      { label: "Last Beam Off", pv: "AC:TS1:BEAMOFF:TIME" },
      {
        label: "Methane Moderator Temp",
        pv: "TG:TS1:MOD:METH:TEMP",
        grafanaMetric: "MOD_ts1_methane_temp",
      },
      {
        label: "Hydrogen Moderator Temp",
        pv: "TG:TS1:MOD:HDGN:TEMP",
        grafanaMetric: "MOD_ts1_hydrogen_temp",
      },
      { label: "Methane Transfer Warning", pv: "TG:TS1:MOD:METH:TRANS:WARN" },
      {
        label: "Methane Transfer Warning Time",
        pv: "TG:TS1:MOD:METH:TRANS:WARN:TIME",
      },
      { label: "Muon Beam Current", pv: "AC:MUON:BEAM:CURR" },
      { label: "Muon Kicker", pv: "BL:MUON:KICKR:STAT" },
    ],
  },
  {
    title: "Target Station 2",
    rows: [
      { label: "Beam", pv: "AC:TS2:BEAM:STAT" },
      {
        label: "Beam Current",
        pv: "AC:TS2:BEAM:CURR",
        grafanaMetric: "ACCEL_ts2_beam_curr",
      },
      {
        label: "Frequency",
        pv: "AC:TS2:FREQ",
        grafanaMetric: "ACCEL_ts2_freq",
      },
      {
        label: "Beam Today (since 08:30)",
        pv: "AC:TS2:BEAM:TOTAL",
        grafanaMetric: "ACCEL_ts2_beam_total_uAh",
      },
      { label: "Beam Yesterday", pv: "AC:TS2:BEAM:YEST" },
      { label: "Last Beam On", pv: "AC:TS2:BEAMON:TIME" },
      { label: "Last Beam Off", pv: "AC:TS2:BEAMOFF:TIME" },
      {
        label: "Decoupled Methane Temp",
        pv: "TG:TS2:DMOD:METH:TEMP",
        grafanaMetric: "MOD_ts2_dmod_methane_temp",
      },
      {
        label: "Coupled Methane Temp",
        pv: "TG:TS2:CMOD:METH:TEMP",
        grafanaMetric: "MOD_ts2_cmod_methane_temp",
      },
      {
        label: "Coupled Hydrogen Temp",
        pv: "TG:TS2:CMOD:HDGN:TEMP",
        grafanaMetric: "MOD_ts2_cmod_hydrogen_temp",
      },
      {
        label: "DMOD Runtime",
        pv: "TG:TS2:DMOD:RTIME:DUR",
        grafanaMetric: "MOD_ts2_dmod_runtime_dur",
      },
      { label: "DMOD Runtime Limit", pv: "TG:TS2:DMOD:RTLIM" },
      {
        label: "DMOD Beam",
        pv: "TG:TS2:DMOD:BEAM",
        grafanaMetric: "MOD_ts2_dmod_beam_uAh",
      },
      { label: "DMOD Beam Limit", pv: "TG:TS2:DMOD:BEAM:LIM" },
      {
        label: "DMOD Time to Charge Change",
        pv: "TG:TS2:DMOD:CHRGCHNG:TIME",
        grafanaMetric: "MOD_ts2_dmod_CC_hours",
      },
      {
        label: "DMOD Anneal Pressure Low",
        pv: "TG:TS2:DMOD:ANNPLOW:STAT",
        grafanaMetric: "MOD_ts2_dmod_annp_low",
      },
      {
        label: "DMOD Fill Mass",
        pv: "TG:TS2:DMOD:FILLMASS",
        grafanaMetric: "MOD_ts2_dmod_fillmass",
      },
    ],
  },
];

export const SHUTTER_STATUS = "SHTR:STAT";
export const SHUTTER_MODE = "SHTR:MODE";
export const VAT_STATUS = "VAT:STAT";

/**
 * Target stations which have shutters, and whether they also have VAT valves and shutter modes.
 */
export const SHUTTER_TARGET_STATIONS: Array<{
  targetStation: string;
  title: string;
  showVatAndMode: boolean;
}> = [
  { targetStation: "TS1", title: "TS1 Shutters", showVatAndMode: false },
  { targetStation: "TS2", title: "TS2 Shutters", showVatAndMode: true },
];

export function shutterStatusPV(instrument: instListEntry): string {
  return instrument.pvPrefix + SHUTTER_STATUS;
}

export function shutterModePV(instrument: instListEntry): string {
  return instrument.pvPrefix + SHUTTER_MODE;
}

export function vatStatusPV(instrument: instListEntry): string {
  return instrument.pvPrefix + VAT_STATUS;
}

/**
 * Get the scheduled instruments from the instrument list on the given target station, sorted by name.
 */
export function getShutterInstruments(
  instruments: Array<instListEntry>,
  targetStation: string,
): Array<instListEntry> {
  return instruments
    .filter(
      (instrument) =>
        instrument.isScheduled && instrument.targetStation == targetStation,
    )
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get the facility-wide PVs that the beam status page needs to subscribe to, without duplicates.
 */
export function getBeamStatusPVs(): Array<string> {
  return Array.from(
    new Set(
      BEAM_STATUS_SECTIONS.flatMap((section) =>
        section.rows.map((row) => row.pv),
      ),
    ),
  );
}

/**
 * Get the per-instrument shutter PVs (plus VAT valve and shutter mode PVs, where applicable)
 * for every instrument with a shutter.
 */
export function getShutterPVs(
  instruments: Array<instListEntry>,
): Array<string> {
  const pvs: Array<string> = [];
  for (const { targetStation, showVatAndMode } of SHUTTER_TARGET_STATIONS) {
    for (const instrument of getShutterInstruments(
      instruments,
      targetStation,
    )) {
      pvs.push(shutterStatusPV(instrument));
      if (showVatAndMode) {
        pvs.push(vatStatusPV(instrument));
        pvs.push(shutterModePV(instrument));
      }
    }
  }
  return pvs;
}
