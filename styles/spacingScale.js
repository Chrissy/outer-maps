export default size => {
  switch (size) {
  case 0.125:
    return "0.125em";
  case 0.25:
    return "0.25em";
  case 0.5:
    return "0.5em";
  case 0.75:
    return "0.75em";
  case 1:
    return "1em";
  case 1.125:
    return "1.125em";
  case 1.25:
    return "1.25em";
  case 1.5:
    return "1.5em";
  case 2:
    return "2em";
  case 2.5:
    return "2.5em";
  case 3:
    return "3em";
  case 4:
    return "4em";
  case 5:
    return "5em";
  case 10:
    return "10em";
  case 20:
    return "20em";
  default:
    console.warn("non-standard spacing unit used. null returned");
    return null;
  }
};
