import Group from "./Group";

export default function Groups({ groupsMap, instName, showHiddenBlocks }) {
  if (!groupsMap) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="rounded-xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3  gap-4 mt-8">
      {groupsMap.map((group) => {
        return (
          <Group
            key={group.name}
            group={group}
            instName={instName}
            showHiddenBlocks={showHiddenBlocks}
          />
        );
      })}
    </div>
  );
}
