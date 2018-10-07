import spacingScale from "./spacingScale";
import typeScale from "./typeScale";

const theme = {
  brandColor: "#5800EC",
  accentColor: "#FF5500",
  accentColorTintLighter: "#FCBE67",
  accentColorTintLight: "#FF9500",
  accentColorTintDark: "#CA4300",
  accentColorTintDarker: "#9B3300",
  gray1: "#F7F7F7",
  gray2: "#F3F3F3",
  gray3: "#E9E9E9",
  gray4: "#D8D8D8",
  gray5: "#A7A7A7",
  gray6: "#838383",
  gray7: "#494949",
  gray8: "#292929",
  blue: "#3232FF",
  purple: "#5800EC",
  orange: "#FF9500",
  red: "#D0011B",
  ss: spacingScale,
  ts: typeScale,
  headlineFont: "\"Hoefler Text A\", \"Hoefler Text B\"",
  bodyFont:
    "\"Din\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\""
};

theme.difficulties = {
  veryEasy: theme.blue,
  easy: theme.purple,
  moderate: theme.orange,
  extreme: theme.red
};

theme.trailColors = [
  theme.accentColor,
  theme.accentColorTintDark,
  theme.accentColorTintDarker,
  theme.accentColorTintLight
];

export default theme;
