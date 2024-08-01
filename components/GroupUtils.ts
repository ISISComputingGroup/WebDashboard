export function checkIfAllBlocksInGroupAreHidden(group:any) : boolean {
    let blocksAllHidden = group.blocks.map(block => block.visible).every(v => v===false)
    return blocksAllHidden;
  }