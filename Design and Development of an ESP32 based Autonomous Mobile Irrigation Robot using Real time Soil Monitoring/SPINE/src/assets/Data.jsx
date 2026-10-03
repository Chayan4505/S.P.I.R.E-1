import {
  SproutIcon,
  NavigationIcon,
  DropletsIcon,
  ActivityIcon,
  CpuIcon,
  WifiIcon,
} from "lucide-react";

export const featuresData = [
  {
    icon: <SproutIcon className="w-6 h-6" />,
    title: "Real-Time Soil Intelligence",
    desc: "Monitor soil moisture, temperature, EC, pH, N, P, K, TDS, and salinity using a multi-parameter soil sensor.",
  },
  {
    icon: <NavigationIcon className="w-6 h-6" />,
    title: "Autonomous Navigation",
    desc: "Navigate agricultural environments autonomously using ultrasonic obstacle detection and GPS-based positioning.",
  },
  {
    icon: <DropletsIcon className="w-6 h-6" />,
    title: "Precision Irrigation",
    desc: "Identify dry soil conditions and deliver water only when irrigation is required, helping reduce unnecessary water usage.",
  },
  {
    icon: <ActivityIcon className="w-6 h-6" />,
    title: "Continuous Monitoring",
    desc: "Collect field measurements and monitor changing soil conditions to support data-driven agricultural decisions.",
  },
  {
    icon: <CpuIcon className="w-6 h-6" />,
    title: "Edge Intelligence",
    desc: "ESP32-based onboard processing enables sensing, navigation, decision-making, and robot control directly on the field.",
  },
  {
    icon: <WifiIcon className="w-6 h-6" />,
    title: "Connected Agriculture",
    desc: "Transmit robot and soil telemetry through Wi-Fi to a Node.js backend for remote monitoring and data management.",
  },
];

// export const capabilitiesData = [
//   {
//     id: "sensing",
//     name: "Soil Sensing",
//     title: "Understand the soil before irrigating.",
//     desc: "S.P.I.R.E. uses a multi-parameter RS485 soil sensor to collect detailed information about soil conditions.",
//     features: [
//       "Soil moisture measurement",
//       "Soil temperature",
//       "Electrical conductivity",
//       "pH monitoring",
//       "Nitrogen, phosphorus & potassium",
//       "TDS and salinity",
//     ],
//   },
//   {
//     id: "navigation",
//     name: "Autonomous Navigation",
//     title: "Move intelligently through the field.",
//     desc: "The robot combines GPS positioning and ultrasonic obstacle detection to navigate agricultural environments.",
//     features: [
//       "GPS-based positioning",
//       "Ultrasonic obstacle detection",
//       "Adaptive movement",
//       "Obstacle avoidance",
//       "Autonomous field traversal",
//       "Differential-drive mobility",
//     ],
//   },
//   {
//     id: "irrigation",
//     name: "Smart Irrigation",
//     title: "Water where the soil needs it.",
//     desc: "S.P.I.R.E. evaluates soil moisture and activates irrigation when dry conditions are detected and water is available.",
//     features: [
//       "Automatic moisture evaluation",
//       "Threshold-based irrigation",
//       "Water availability monitoring",
//       "Controlled pump operation",
//       "Reduced unnecessary watering",
//       "Targeted irrigation",
//     ],
//   },
// ];

/* =========================================================
   FAQ
   ========================================================= */

export const faqData = [
  {
    question: "What is S.P.I.R.E.?",
    answer:
      "S.P.I.R.E. stands for Soil Precision & Intelligent Robotic Ecosystem. It is an autonomous agricultural robot designed to combine soil monitoring, autonomous navigation, and precision irrigation in a single robotic platform.",
  },
  {
    question: "What parameters can S.P.I.R.E. monitor?",
    answer:
      "The system is designed to monitor soil moisture, temperature, electrical conductivity, pH, nitrogen, phosphorus, potassium, TDS, and salinity using a multi-parameter RS485 soil sensor.",
  },
  {
    question: "How does the robot decide when to irrigate?",
    answer:
      "The robot evaluates soil moisture against a predefined threshold. When the soil is sufficiently dry and water is available in the tank, the irrigation sequence can be activated.",
  },
  {
    question: "How does S.P.I.R.E. navigate?",
    answer:
      "S.P.I.R.E. uses a differential-drive robotic platform with GPS positioning and ultrasonic obstacle detection. The ultrasonic sensor helps detect obstacles and adjust the robot's movement.",
  },
  {
    question: "How is the soil data transmitted?",
    answer:
      "The ESP32 collects sensor measurements and can transmit telemetry over Wi-Fi to a Node.js backend using WebSockets. The backend can then store and process the collected data.",
  },
  {
    question: "Can S.P.I.R.E. operate autonomously?",
    answer:
      "Yes. The autonomous mode allows the robot to navigate, periodically stop for soil measurements, evaluate soil conditions, and initiate irrigation when the configured conditions are satisfied.",
  },
];

/* =========================================================
   FOOTER LINKS
   ========================================================= */

export const footerLinks = [
  {
    title: "Explore",
    links: [
      {
        name: "Home",
        url: "#",
      },
      {
        name: "Features",
        url: "#features",
      },
      {
        name: "FAQ",
        url: "#faq",
      },
      {
        name: "How It Works",
        url: "#",
      },
    ],
  },

  {
    title: "Project",
    links: [
      {
        name: "About S.P.I.R.E.",
        url: "#",
      },
      {
        name: "Research",
        url: "#",
      },
      {
        name: "Specifications",
        url: "#",
      },
      {
        name: "Contact",
        url: "#",
      },
    ],
  },

  {
    title: "Connect",
    links: [
      {
        name: "GitHub",
        url: "https://github.com/Sreejib-Nandy",
      },
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/sreejib-nandy-9794b2321",
      },
      {
        name: "Research Paper",
        url: "#",
      },
    ],
  },
];