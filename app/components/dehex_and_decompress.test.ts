import {
  dehex_and_decompress,
  instListFromBytes,
} from "./dehex_and_decompress";

const instListHexed =
  "Nzg5Y2I1OTg2ZjRmZGIzMDEwYzZiZjRhOTVkNzIwMGRiNjY5YTNlZjRjZTJhNGQ2ZTIzOGQ4MGUyYjQzYTg0MjUwMDYxMjFiODhjMjM0NjlkYTc3YzdjZWZmNWUyZmFkMjNjY2NiM2ViZjJhZjdjNDM5ZGY5ZDdkZmUyZmY4N2RmOTZiMTk0YzI3MDE5MTQ5YTE4MmJkNDk3MGZiYjA3YWNlNmEzMThiZTZhZGZlZjgyNzdmNWFkZWRjZmRiNTNhY2JhNmE1M2ViNWUwNmVhNWFlNmU5N2Q3MmZmN2NiNmJjMzllOWY1ZTk2NDZmY2Y5ZjRmMGYyYjgzMmJmY2YyZmNjYWZkNWYyZWFhZTY2ZmZmNzI2NWRkMDcwMjY0NTg2ODZlZDExMTBiODI2MmVhMTAzNWU4ODRjMDUzZDA3Mzc5N2Y3YWI3NTBiMzMxNjMzMjQ3ZTIzODNlMDU2N2VmYjRiYjM5YzQ5ZjQ5ZDFiYjBmMWNhMTZiYzM5YWUzYzEzMjkzOTVlYzhhZjFmYjBlMGViMTQzYTI4ZTkxNzhhNzgyODk3NzQ3ZGQ5NTU5MWU3NDJlYWVkMGIxZjg1MjYxYzYyYTRkNTgxODU1MmY3MTgzZjI1OTIwYmVjMzM3NDAwMzhhODgwNTNlMjI5YjIyYmVmNDgxYTYzYmJhZDUyZTE1ZTRiNjNhN2E4NzQxZTMyNGQzNGRiOTlmNDExZTUwMjViZmE1YTg2MmI2ZjY0YTc4NWRmMWE5MzcxYTI5MTk4OGQwYzYyNWFkOWVkOWRiMzg0NjU5NDRhOTYyNWRiZGZkOWQ2ODI5ODIyMGUzYTAwM2M1NGMwMmRlNTFjMmFjZDBmMjEzODEyYmU5MTQxNzAyYjdiNGEzNTI2MTk1NjYyMWIxOWFlYmM5MWRkOGFhYjQ4NTU0ZWMzZGRiMTE3OGFlYTIyMWY3MGQwNDFjNGM3NDIxZDFlMzlhZWJmOGI5OTMyNTdlNjgzNzYyMDA2ODYyYWZjYzlkMTkwNzM1ZWNlNjQxZTBkNWE1YTg3YjAxOTk1ZjA2M2U0NjZjODk0NzBhNTQ5OWE4YTQ0OTI3Yzc2YjZkYmQ0ODA5ZDAxMjM0ZTI5MzNjYTQzNmUzYTBlOWViOTNkMDI5Y2Q0YzRiZjk5NTNhYThhNTM4NjE1Y2QxZTAxNjY2YWUyNmYzMzU1MTkzODk4Yjk4MzM5M2JiYTkwZWU0ZGM2YWQwZWE3MzI2NTE5NTY1YjViMDA2YjZiMDlmYzc2MzVjOWJlNTFiY2M0ZjcwOGYwNTExMzZmNDU1ZTUxN2NhYTY5NzUxMGJmZDQzZDRlMzU5NDczYjI0ZmIwMTQ2OTAxNGM5MTEyNzhiNDYwMWE1MjQ0NTI2Y2RmZjYwODVjODY4YTM4ZTU0M2M0OTQ5MDExOTUzNGRhZWUyM2ExNThiYmFkNTUxMGRmYTg2MzYzOGZkZTIzMjRjN2Q2YTQ5MWUxZmUzMGIyZGZkZDIxZDRjMDFjZDAwMWUwYTEwMjFlNjc4MThjYTI3MzQ4MmRjM2ZlNmY2NGZmNzU1Y2NkYjFiZTU2YWIzMDI5ZTdlZmQwZDViNDUwMjFiNjNmNWIxZDk4Mjg3NTdmZGYyMDE1MjdkODkxYTc1MmUxNzk0NzljNzg5YTQwNTM4YThkZmViNTBhYTM1MmM3YzFkZjM1ZjFiOTk5MDhkMDhkMjdiMTEzYmU5NWZkYzYwZmNkMjZjMjY2YmI1NmRmMzg2YjFiZGRhZDFlNGIxYWE3MzRkNDgyNTMyZDc3MjViZTg4MzU3ZTAyZWIxMWI4MDEyYWUyYjMzNzE0MTIzYmY2MzYzMjhjNmY2NGE3NmYzMTYyMWQzMmM2YTVjMDZhNDAwNzgwOGIwYTc4NmQ0ZDExZDU1YzIwZjMxMmU5NDBkZjg0YTZkMzhhYzUwNzVlNDc4NTAyOWQxMzBhNzQ0ODI4N2M1ZGI4YjE0YzUzZWNkYWE1ZDUzN2ZhODBkMTdkNjc4MTM5Mjc5ODdmZTM0NzhiMWE2YzllMmMwY2YwZWRjMzk2Y2U0M2I0MjNiNTYwNzM1MjMyYzA1MzVkZTY4NWMyM2U0NTIzNmZkYzg3MjhiNzBmZTE5MDA1ZGY5OTlhMjE5MTFiMTk0NGI2YjJmZjU2NmM5ZjNhNzhmMjVlODc4ODlmODUzYTBhZGZlMWU0OWQ1MzIyNTMyYzMxMWIxZGU2YTVkNWRmZTFmMDZkMWYzYmI4Mzg4MDYyOTYxNjlmMWQ4ZjM1ZTNlZTI1NThjY2Y2ZWQ2NTM0MjcwOTc2M2YwMTMwNzI3YmJmMWYxZTM4MTY1MTg3MmMxNjcxNWM4ZTVjYzg1MGRkMTEzODU1NTdjNDc3MjVlMWMyOGUyMmQ4NjY2ZTAxZGNjZTI1ZjBkOWRjNDMzNjcwYjFkYzIzYjA5YzU1YzRhMzBiNzY0Y2U3NDljMTM0NTVlODc1ZjMzYTg1YmRhNmE0YzRmMTQ2NmRkMGNlYzUyYmNhNGYxMTE5AA==";
const instListArray = [
  {
    name: "ARGUS",
    hostName: "NDXARGUS",
    pvPrefix: "IN:ARGUS:",
    isScheduled: true,
    groups: [],
    seci: true,
  },
  {
    name: "CHRONUS",
    hostName: "NDXCHRONUS",
    pvPrefix: "IN:CHRONUS:",
    isScheduled: true,
    groups: ["MUONS"],
    seci: false,
  },
  {
    name: "HIFI",
    hostName: "NDXHIFI",
    pvPrefix: "IN:HIFI:",
    isScheduled: true,
    groups: [],
    seci: true,
  },
  {
    name: "CHIPIR",
    hostName: "NDXCHIPIR",
    pvPrefix: "IN:CHIPIR:",
    isScheduled: true,
    groups: [],
    seci: true,
  },
  {
    name: "CRYOLAB_R80",
    hostName: "NDXCRYOLAB_R80",
    pvPrefix: "IN:CRYOLA7E:",
    isScheduled: false,
    groups: ["SUPPORT"],
    seci: false,
  },
  {
    name: "DCLAB",
    hostName: "NDXDCLAB",
    pvPrefix: "IN:DCLAB:",
    isScheduled: false,
    groups: ["SUPPORT"],
    seci: false,
  },
  {
    name: "LARMOR",
    hostName: "NDXLARMOR",
    pvPrefix: "IN:LARMOR:",
    isScheduled: true,
    groups: ["SANS"],
    seci: false,
  },
  {
    name: "ALF",
    hostName: "NDXALF",
    pvPrefix: "IN:ALF:",
    isScheduled: true,
    groups: ["EXCITATIONS"],
    seci: false,
  },
  {
    name: "DEMO",
    hostName: "NDXDEMO",
    pvPrefix: "IN:DEMO:",
    isScheduled: false,
    groups: [],
    seci: false,
  },
  {
    name: "IMAT",
    hostName: "NDXIMAT",
    pvPrefix: "IN:IMAT:",
    isScheduled: true,
    groups: ["ENGINEERING"],
    seci: false,
  },
  {
    name: "MUONFE",
    hostName: "NDXMUONFE",
    pvPrefix: "IN:MUONFE:",
    isScheduled: false,
    groups: ["MUONS"],
    seci: false,
  },
  {
    name: "ZOOM",
    hostName: "NDXZOOM",
    pvPrefix: "IN:ZOOM:",
    isScheduled: true,
    groups: ["SANS"],
    seci: false,
  },
  {
    name: "IRIS",
    hostName: "NDXIRIS",
    pvPrefix: "IN:IRIS:",
    isScheduled: true,
    groups: ["MOLSPEC"],
    seci: false,
  },
  {
    name: "IRIS_SETUP",
    hostName: "NDXIRIS_SETUP",
    pvPrefix: "IN:IRIS_S29:",
    isScheduled: false,
    groups: ["MOLSPEC"],
    seci: false,
  },
  {
    name: "ENGINX_SETUP",
    hostName: "NDXENGINX_SETUP",
    pvPrefix: "IN:ENGINX49:",
    isScheduled: false,
    groups: ["ENGINEERING"],
    seci: false,
  },
  {
    name: "HRPD_SETUP",
    hostName: "NDXHRPD_SETUP",
    pvPrefix: "IN:HRPD_S3D:",
    isScheduled: false,
    groups: ["CRYSTALLOGRAPHY"],
    seci: false,
  },
  {
    name: "HRPD",
    hostName: "NDXHRPD",
    pvPrefix: "IN:HRPD:",
    isScheduled: true,
    groups: ["CRYSTALLOGRAPHY"],
    seci: false,
  },
  {
    name: "POLARIS",
    hostName: "NDXPOLARIS",
    pvPrefix: "IN:POLARIS:",
    isScheduled: true,
    groups: ["CRYSTALLOGRAPHY"],
    seci: false,
  },
  {
    name: "VESUVIO",
    hostName: "NDXVESUVIO",
    pvPrefix: "IN:VESUVIO:",
    isScheduled: true,
    groups: ["MOLSPEC"],
    seci: false,
  },
  {
    name: "ENGINX",
    hostName: "NDXENGINX",
    pvPrefix: "IN:ENGINX:",
    isScheduled: true,
    groups: ["ENGINEERING", "CRYSTALLOGRAPHY"],
    seci: false,
  },
  {
    name: "MERLIN",
    hostName: "NDXMERLIN",
    pvPrefix: "IN:MERLIN:",
    isScheduled: true,
    groups: ["EXCITATIONS"],
    seci: false,
  },
  {
    name: "RIKENFE",
    hostName: "NDXRIKENFE",
    pvPrefix: "IN:RIKENFE:",
    isScheduled: false,
    groups: ["MUONS"],
    seci: false,
  },
  {
    name: "SELAB",
    hostName: "NDXSELAB",
    pvPrefix: "IN:SELAB:",
    isScheduled: false,
    groups: ["SUPPORT"],
    seci: false,
  },
  {
    name: "EMMA-A",
    hostName: "NDXEMMA-A",
    pvPrefix: "IN:EMMA-A:",
    isScheduled: false,
    groups: ["SUPPORT"],
    seci: false,
  },
  {
    name: "SANDALS",
    hostName: "NDXSANDALS",
    pvPrefix: "IN:SANDALS:",
    isScheduled: true,
    groups: ["DISORDERED"],
    seci: false,
  },
  {
    name: "GEM",
    hostName: "NDXGEM",
    pvPrefix: "IN:GEM:",
    isScheduled: true,
    groups: ["DISORDERED", "CRYSTALLOGRAPHY"],
    seci: false,
  },
  {
    name: "MAPS",
    hostName: "NDXMAPS",
    pvPrefix: "IN:MAPS:",
    isScheduled: true,
    groups: ["EXCITATIONS"],
    seci: false,
  },
  {
    name: "OSIRIS",
    hostName: "NDXOSIRIS",
    pvPrefix: "IN:OSIRIS:",
    isScheduled: true,
    groups: ["MOLSPEC"],
    seci: false,
  },
  {
    name: "INES",
    hostName: "NDXINES",
    pvPrefix: "IN:INES:",
    isScheduled: true,
    groups: ["CRYSTALLOGRAPHY"],
    seci: false,
  },
  {
    name: "SXD",
    hostName: "NDXSXD",
    pvPrefix: "IN:SXD:",
    isScheduled: true,
    groups: ["CRYSTALLOGRAPHY"],
    seci: false,
  },
  {
    name: "TOSCA",
    hostName: "NDXTOSCA",
    pvPrefix: "IN:TOSCA:",
    isScheduled: true,
    groups: ["MOLSPEC"],
    seci: false,
  },
  {
    name: "LOQ",
    hostName: "NDXLOQ",
    pvPrefix: "IN:LOQ:",
    isScheduled: true,
    groups: ["SANS"],
    seci: false,
  },
  {
    name: "LET",
    hostName: "NDXLET",
    pvPrefix: "IN:LET:",
    isScheduled: true,
    groups: ["EXCITATIONS"],
    seci: false,
  },
  {
    name: "MARI",
    hostName: "NDXMARI",
    pvPrefix: "IN:MARI:",
    isScheduled: true,
    groups: ["EXCITATIONS"],
    seci: false,
  },
  {
    name: "CRISP",
    hostName: "NDXCRISP",
    pvPrefix: "IN:CRISP:",
    isScheduled: false,
    groups: ["REFLECTOMETRY"],
    seci: false,
  },
  {
    name: "SOFTMAT",
    hostName: "NDXSOFTMAT",
    pvPrefix: "IN:SOFTMAT:",
    isScheduled: false,
    groups: ["SUPPORT"],
    seci: false,
  },
  {
    name: "SURF",
    hostName: "NDXSURF",
    pvPrefix: "IN:SURF:",
    isScheduled: true,
    groups: ["REFLECTOMETRY"],
    seci: false,
  },
  {
    name: "NIMROD",
    hostName: "NDXNIMROD",
    pvPrefix: "IN:NIMROD:",
    isScheduled: true,
    groups: ["DISORDERED"],
    seci: false,
  },
  {
    name: "DETMON",
    hostName: "NDADETMON",
    pvPrefix: "TE:NDADETF1:",
    isScheduled: false,
    groups: ["SUPPORT"],
    seci: false,
  },
  {
    name: "EMU",
    hostName: "NDXEMU",
    pvPrefix: "IN:EMU:",
    isScheduled: true,
    groups: ["MUONS"],
    seci: false,
  },
  {
    name: "INTER",
    hostName: "NDXINTER",
    pvPrefix: "IN:INTER:",
    isScheduled: true,
    groups: ["REFLECTOMETRY"],
    seci: false,
  },
  {
    name: "POLREF",
    hostName: "NDXPOLREF",
    pvPrefix: "IN:POLREF:",
    isScheduled: true,
    groups: ["REFLECTOMETRY"],
    seci: false,
  },
  {
    name: "SANS2D",
    hostName: "NDXSANS2D",
    pvPrefix: "IN:SANS2D:",
    isScheduled: true,
    groups: ["SANS"],
    seci: false,
  },
  {
    name: "MUSR",
    hostName: "NDXMUSR",
    pvPrefix: "IN:MUSR:",
    isScheduled: true,
    groups: ["MUONS"],
    seci: false,
  },
  {
    name: "WISH",
    hostName: "NDXWISH",
    pvPrefix: "IN:WISH:",
    isScheduled: true,
    groups: ["CRYSTALLOGRAPHY"],
    seci: false,
  },
  {
    name: "WISH_SETUP",
    hostName: "NDXWISH_SETUP",
    pvPrefix: "IN:WISH_S9C:",
    isScheduled: false,
    groups: ["CRYSTALLOGRAPHY"],
    seci: false,
  },
  {
    name: "PEARL",
    hostName: "NDXPEARL",
    pvPrefix: "IN:PEARL:",
    isScheduled: true,
    groups: ["CRYSTALLOGRAPHY"],
    seci: false,
  },
  {
    name: "PEARL_SETUP",
    hostName: "NDXPEARL_SETUP",
    pvPrefix: "IN:PEARL_5B:",
    isScheduled: false,
    groups: ["CRYSTALLOGRAPHY"],
    seci: false,
  },
  {
    name: "HIFI-CRYOMAG",
    hostName: "NDXHIFI-CRYOMAG",
    pvPrefix: "IN:HIFI-C11:",
    isScheduled: false,
    groups: ["MUONS"],
    seci: false,
  },
  {
    name: "OFFSPEC",
    hostName: "NDXOFFSPEC",
    pvPrefix: "IN:OFFSPEC:",
    isScheduled: true,
    groups: ["REFLECTOMETRY"],
    seci: false,
  },
  {
    name: "MOTION",
    hostName: "NDXMOTION",
    pvPrefix: "IN:MOTION:",
    isScheduled: false,
    groups: ["SUPPORT"],
    seci: false,
  },
  {
    name: "SCIDEMO",
    hostName: "NDXSCIDEMO",
    pvPrefix: "IN:SCIDEMO:",
    isScheduled: false,
    groups: ["SUPPORT"],
    seci: false,
  },
  {
    name: "IBEXGUITEST",
    hostName: "NDXIBEXGUITEST",
    pvPrefix: "IN:IBEXGUAD:",
    isScheduled: false,
    groups: ["SUPPORT"],
    seci: false,
  },
];
test("dehexes and decompresses a string that is hexed and compressed", () => {
  const expected = "test123";
  const raw = "789c2b492d2e31343206000aca0257";
  const result = dehex_and_decompress(raw);
  expect(result).toBe(expected);
});

test("instListFromBytes returns an instlist with an instrument in", () => {
  expect(instListFromBytes(instListHexed)).toEqual(instListArray);
});
