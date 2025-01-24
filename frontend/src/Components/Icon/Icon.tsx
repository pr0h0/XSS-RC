import {
  CaretDownIcon,
  CaretUpIcon,
  ChromeIcon,
  ClockIcon,
  CommandIcon,
  CopyIcon,
  DashboardIcon,
  DisplayIcon,
  ExpandIcon,
  EyeIcon,
  GithubIcon,
  HamburgerIcon,
  HashIcon,
  HistoryIcon,
  HomeIcon,
  InfoCircleIcon,
  KeyboardIcon,
  LinkedInIcon,
  LogoutIcon,
  MailIcon,
  ScriptsIcon,
  SessionIcon,
  SignIcon,
  ToggleOffIcon,
  ToggleOnIcon,
  TrashIcon,
  TwitterIcon,
} from "./Icons";

type Props = {
  name: keyof typeof IconsMap;
  className?: string;
  style?: React.CSSProperties;
};

const IconsMap = {
  caretUp: CaretUpIcon,
  caretDown: CaretDownIcon,
  copy: CopyIcon,
  trash: TrashIcon,
  eye: EyeIcon,
  hamburger: HamburgerIcon,
  home: HomeIcon,
  dashboard: DashboardIcon,
  session: SessionIcon,
  history: HistoryIcon,
  script: ScriptsIcon,
  logout: LogoutIcon,
  github: GithubIcon,
  twitter: TwitterIcon,
  linkedin: LinkedInIcon,
  mail: MailIcon,
  toggleOn: ToggleOnIcon,
  toggleOff: ToggleOffIcon,
  sign: SignIcon,
  clock: ClockIcon,
  hash: HashIcon,
  command: CommandIcon,
  keyboard: KeyboardIcon,
  display: DisplayIcon,
  info: InfoCircleIcon,
  chrome: ChromeIcon,
  expand: ExpandIcon,
};

export default function Icon({ name, ...rest }: Props) {
  const Component = IconsMap[name];
  if (!Component) return null;
  return <Component {...rest} />;
}
