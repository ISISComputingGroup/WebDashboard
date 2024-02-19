import Group from "./Group";

export default function Groups({ groups }) {
  if (!groups) {
    return <h1>Loading...</h1>;
  }

  return (
    <div class="rounded-xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3  gap-4 mt-8">
      {Object.keys(groups).map((group) => {
        return <Group key={group} groupName={group} group={groups[group]} />;
      })}
    </div>
  );
}
