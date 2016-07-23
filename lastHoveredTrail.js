const initialState = [
  {
    name: '',
    source: '',
    contactX: 0,
    contactY: 0,
    visible: true
  }
]

const lastHoveredTrail = (state = initialState, action) => {
  switch (action.type) {
    case 'SWAP_IN_TRAIL':
      return {
        name: action.name,
        source: action.source,
        contactX: action.contactX,
        contactY: action.contactY,
        visible: true
      };
    default: return state;
  }
}

export default lastHoveredTrail;
