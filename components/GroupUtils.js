export function checkIfAllBlocksInGroupAreHidden(group) {
    let blocksAllHidden = group.blocks.map(block => block.visible).every(v => v===false)
    return blocksAllHidden;
  }