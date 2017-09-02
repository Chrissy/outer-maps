const numberShortener = ({number, oneDecimal = false}) => {
  const oneDecimalString = (string) => {
    if (oneDecimal == false) return parseInt(string);
    const match = string.match(/([0-9]*)\.[1-9]/);
    return (match) ? match[0] : string;
  }
  
  if (number > 1000000) return oneDecimalString((number / 1000000).toString()) + "m";
  if (number > 1000) return oneDecimalString((number / 1000).toString()) + "k";
  return oneDecimalString(number.toString());
}

export default numberShortener;
