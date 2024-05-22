import InstList from "@/components/InstList";


export default function Document() {
    <InstList/>
    let ret = InstList()
    if (!ret) {
        return <h1>loading</h1>
    }
    console.log(ret)

  return (
    <h1>{ret.toString()}</h1>
  );
}
