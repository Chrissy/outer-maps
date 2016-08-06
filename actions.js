const SWAP_HOVERED_TRAIL = 'SWAP_HOVERED_TRAIL';
const HIDE_TOOLTIP = 'HIDE_TOOLTIP';
const SHOW_TOOLTIP = 'SHOW_TOOLTIP';

export function swapHoveredTrail(name, source, contactX, contactY) {
  return {
    type: SWAP_HOVERED_TRAIL,
    name, source, contactX, contactY
  };
}

export function hideTooltip() {
  return { type: HIDE_TOOLTIP };
}

export function showTooltip() {
  return { type: SHOW_TOOLTIP };
}
