import { FaRobot } from 'react-icons/fa';
import {
  SiPython, SiCplusplus, SiJavascript, SiOpencv,
  SiTensorflow, SiPytorch, SiGit, SiLinux, SiArduino,
} from 'react-icons/si';

const map = {
  SiPython, SiCplusplus, SiJavascript, SiOpencv,
  SiTensorflow, SiPytorch, SiGit, SiLinux, SiArduino,
  FaRobot,
};

/** 문자열 아이콘 이름을 컴포넌트로. 없으면 FaRobot 폴백. */
export function iconFor(name) {
  return map[name] || FaRobot;
}
