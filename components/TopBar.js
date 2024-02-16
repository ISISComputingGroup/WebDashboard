
export default function TopBar({data, slug}) {
    return (
<div id="top_bar" className="w-full p-8 bg-gray-300 rounded-xl text-md ">
<div id="inst_name" >
  <h2 class={`text-center bg-green-500 p-4 rounded-lg`}>{slug} is RUNNING</h2>
  </div>
  <div className="grid grid-cols-3 mt-4 divide-x divide-black">
    <div id="table_part" className="p-3">
        <h4>Title: D2O G=8.23 F=-10 beam-blocker hg=100 S3S=2.6 th=2.3 ['SM2']=0.0</h4>
    
    <h4>Users: UNKNOWN</h4>
    </div>
    
    <div className="p-3">
    <h4>Good / Raw Frames: 3400 / 3400</h4>
    <h4>Current / Total: 38.236 / 3.641</h4>
    <h4>Monitor Counts: 19254567</h4>
    </div>
    <div id="next_part" className="p-3">
      <h4>Run Time: 00:05:38</h4>
      <h4>Inst. Time: 02/16/2024 15:15:14</h4>
      <h4>Period: 1 / 15</h4>
      </div>
      </div >
      </div>

    )
    };