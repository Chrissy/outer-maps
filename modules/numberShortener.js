const oneDecimalString = (string) => {
  const match = string.match(/([0-9]*)\.[1-9]/);
  return (match) ? match[0] : string;
}

const numberShortener = ({number, oneDecimal = false}) => {
  if (number > 1000000) return ((oneDecimal) ? oneDecimalString((number / 1000000).toString()) : parseInt(number / 1000000)) + "m"
  if (number > 1000) return ((oneDecimal) ? oneDecimalString((number / 1000).toString()) : parseInt(number / 1000)) + "k"
  return parseInt(number).toString()
}

export default numberShortener;
