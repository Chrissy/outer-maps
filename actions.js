const SWAP_HOVERED_TRAIL = 'SWAP_HOVERED_TRAIL'

export function swapHoveredTrail(name, source, contactX, contactY) {
  return { type: types.SWAP_HOVERED_TRAIL, name, source, contactX, contactY }
}
