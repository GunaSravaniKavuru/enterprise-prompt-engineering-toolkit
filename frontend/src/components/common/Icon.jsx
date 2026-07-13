import {
  FiGrid, FiTool, FiBookOpen, FiTerminal, FiZap, FiActivity,
  FiColumns, FiClock, FiBarChart2, FiRepeat, FiSettings,
  FiSearch, FiBell, FiSun, FiMoon, FiChevronDown, FiStar,
  FiCopy, FiEdit3, FiTrash2, FiEye, FiFilter, FiPlus, FiX,
  FiCheck, FiUpload, FiDownload, FiFileText, FiRotateCcw,
  FiPlay, FiTrendingUp, FiTrendingDown, FiChevronRight, FiMenu,
} from "react-icons/fi";

const map = {
  grid: FiGrid,
  hammer: FiTool,
  book: FiBookOpen,
  flask: FiTerminal,
  sparkle: FiZap,
  gauge: FiActivity,
  columns: FiColumns,
  clock: FiClock,
  chart: FiBarChart2,
  swap: FiRepeat,
  settings: FiSettings,
  search: FiSearch,
  bell: FiBell,
  sun: FiSun,
  moon: FiMoon,
  chevronDown: FiChevronDown,
  chevronRight: FiChevronRight,
  star: FiStar,
  copy: FiCopy,
  edit: FiEdit3,
  trash: FiTrash2,
  eye: FiEye,
  filter: FiFilter,
  plus: FiPlus,
  x: FiX,
  check: FiCheck,
  upload: FiUpload,
  download: FiDownload,
  file: FiFileText,
  restore: FiRotateCcw,
  play: FiPlay,
  up: FiTrendingUp,
  down: FiTrendingDown,
  menu: FiMenu,
};

export default function Icon({ name, className = "", size = 18 }) {
  const Cmp = map[name] || FiGrid;
  return <Cmp className={className} size={size} />;
}
