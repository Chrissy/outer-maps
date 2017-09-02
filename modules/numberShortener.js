const oneDecimalString = (string) => {
  const match = string.match(/([0-9]*)\.[1-9]/);
  return (match) ? match[0] : string;
}

const numberShortener = (number) => {
  if (number > 1000000) return oneDecimalString((number / 1000000).toString()) + "m"
  if (number > 1000) return oneDecimalString((number / 1000).toString()) + "k"
  return parseInt(number).toString()
}

export default numberShortener;
