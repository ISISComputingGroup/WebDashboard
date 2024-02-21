// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import TestInterData from "@/assets/testInterData";

const CA = require("node-epics-ca");

async function getPvValue(pv) {
  var PVVal;
  try {
    await CA.get(pv).then(function (value) {
      PVVal = value;
    });
  } catch (error) {
    console.error(`get failed due to ${error}`);
  }
  //TODO do we need to set a timeout here?
  return PVVal;
}

export default async function handler(req, res) {
  console.log(req.query.slug);

  let instrument = req.query.slug;

  const instrument_prefix = `IN:${instrument[0].toUpperCase()}:`;

  // let inst_pvs_prefix = `${instrument_prefix}DAE:`;
  // let runstate_pv = inst_pvs_prefix + "RUNSTATE";
  // let runnumber_pv = inst_pvs_prefix + "RUNNUMBER";
  // let starttime_pv = inst_pvs_prefix + "STARTTIME";
  // let title_pv = inst_pvs_prefix + "TITLE";
  // let goodframes_pv = inst_pvs_prefix + "GOODFRAMES";
  // return Promise.all([
  //   getPvValue(runstate_pv),
  //   getPvValue(runnumber_pv),
  //   getPvValue(starttime_pv),
  //   getPvValue(title_pv),
  //   getPvValue(goodframes_pv),
  // ])
  // .then((values) => {
  let testInterData = TestInterData();
  // testInterData["inst_pvs"]["RUNSTATE"]["value"] = values[0];
  // testInterData["inst_pvs"]["RUNNUMBER"]["value"] = values[1];
  // testInterData["inst_pvs"]["STARTTIME"]["value"] = values[2];
  // testInterData["inst_pvs"]["TITLE"]["value"] = values[3];
  // testInterData["inst_pvs"]["GOODFRAMES"]["value"] = values[4];
  res.status(200).json(testInterData);
  // })
  // .catch(function (err) {
  //   //TODO res.status something actually useful here
  //   console.log(err.message);
  //   res.status(500).json({ error: err.message });
  // });
}
