export default size => {
  switch (size) {
  case 0.5:
    return "0.5em";
  case 0.66:
    return "0.66em";
  case 0.75:
    return "0.75em";
  case 0.875:
    return "0.875em";
  case 0.9:
    return "0.9em";
  case 1:
    return "1em";
  case 1.125:
    return "1.125em";
  case 1.35:
    return "1.35em";
  case 1.5:
    return "1.5em";
  case 1.66:
    return "1.66em";
  case 1.75:
    return "1.75em";
  case 1.875:
    return "1.875em";
  case 2:
    return "2em";
  case 2.5:
    return "2.5em";
  case 3:
    return "3em";
  case 3.5:
    return "3.5em";
  default:
    console.warn("non-standard typeography size used. null returned");
    return null;
  }
};
