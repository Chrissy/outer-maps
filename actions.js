const SWAP_HOVERED_TRAIL = 'SWAP_HOVERED_TRAIL';
const SET_TOOLTIP_VISIBILITY = 'SWAP_HOVERED_TRAIL';

export function swapHoveredTrail(name, source, contactX, contactY) {
  return {
    type: types.SWAP_HOVERED_TRAIL,
    name, source, contactX, contactY
  };
}

export function hideTooltip() {
  return { type: types.HIDE_TOOLTIP };
}

export function showTooltip() {
  return { type: types.SHOW_TOOLTIP };
}
