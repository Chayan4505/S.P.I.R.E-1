import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Power, Wifi, Globe, Copy, Check, ArrowLeft, ArrowRight, ExternalLink, RefreshCw, Smartphone, Laptop, ShieldCheck, Bot, } from "lucide-react";

const TOTAL_STEPS = 6;

const AddSPIREModal = ({ onClose, onPairRobot }) => {
    const [step, setStep] = useState(1);
    const [copied, setCopied] = useState(false);

    const robotIP = "192.168.4.1";

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);


    // Prevent background scrolling
    useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const originalHtmlOverflow = html.style.overflow;
    const originalBodyOverflow = body.style.overflow;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
        html.style.overflow = originalHtmlOverflow;
        body.style.overflow = originalBodyOverflow;
    };
}, []);

    //  Copy IP
    const copyIP = async () => {
        try {
            await navigator.clipboard.writeText(robotIP);

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (error) {
            console.error("Failed to copy IP:", error);
        }
    };

    //  Navigation
    const nextStep = () => {
        if (step < TOTAL_STEPS) {
            setStep((current) => current + 1);
            setCopied(false);
        }
    };

    const previousStep = () => {
        if (step > 1) {
            setStep((current) => current - 1);
            setCopied(false);
        }
    };

    //  Step data
    const steps = [
        {
            number: 1,
            title: "Power on your S.P.I.R.E.",
            shortTitle: "Power",
            icon: Power,
        },
        {
            number: 2,
            title: "Connect to the robot",
            shortTitle: "Connect",
            icon: Wifi,
        },
        {
            number: 3,
            title: "Open robot setup",
            shortTitle: "Setup",
            icon: Globe,
        },
        {
            number: 4,
            title: "Configure your Wi-Fi",
            shortTitle: "Wi-Fi",
            icon: Wifi,
        },
        {
            number: 5,
            title: "Reconnect to your network",
            shortTitle: "Reconnect",
            icon: RefreshCw,
        },
        {
            number: 6,
            title: "S.P.I.R.E. is ready",
            shortTitle: "Ready",
            icon: ShieldCheck,
        },
    ];

    const CurrentIcon = steps[step - 1].icon;

    return (
        <div
            className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            {/* Backdrop */}
            <motion.div
                className="absolute inset-0 bg-zinc-950/35 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            />

            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                }}
                className="
          relative
          z-10
          w-full
          max-w-2xl
          max-h-[88vh]
          overflow-hidden
          rounded-3xl
          bg-white
          border
          border-zinc-200
          shadow-2xl
          flex
          flex-col
        "
            >
                {/* Header */}
                <div className="relative px-5 sm:px-7 pt-5 sm:pt-6 pb-4 border-b border-zinc-100">

                    <div className="flex items-start justify-between">

                        <div className="flex items-center gap-3">

                            <div className="
                w-11
                h-11
                rounded-2xl
                bg-green-50
                border
                border-green-100
                flex
                items-center
                justify-center
              ">
                                <Bot
                                    size={21}
                                    strokeWidth={1.8}
                                    className="text-green-500"
                                />
                            </div>

                            <div>
                                <p className="text-[10px] font-semibold tracking-[0.22em] text-green-500 uppercase">
                                    Add S.P.I.R.E.
                                </p>

                                <h2 className="text-lg sm:text-xl font-semibold text-zinc-900">
                                    Connect your robot
                                </h2>
                            </div>

                        </div>

                        {/* Close button */}
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close"
                            className="
                w-9
                h-9
                rounded-full
                flex
                items-center
                justify-center
                text-zinc-400
                hover:text-zinc-700
                hover:bg-zinc-100
                transition
                cursor-pointer
              "
                        >
                            <X size={19} />
                        </button>

                    </div>

                    {/* --------------------------------
              Progress
          -------------------------------- */}
                    <div className="mt-6">

                        <div className="flex items-center justify-between mb-2.5">
                            <span className="text-xs font-medium text-zinc-500">
                                Step {step} of {TOTAL_STEPS}
                            </span>

                            <span className="text-xs font-medium text-green-500">
                                {Math.round((step / TOTAL_STEPS) * 100)}%
                            </span>
                        </div>

                        <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-green-600 rounded-full"
                                animate={{
                                    width: `${(step / TOTAL_STEPS) * 100}%`,
                                }}
                                transition={{ duration: 0.35 }}
                            />
                        </div>

                        {/* Step indicators */}
                        <div className="hidden sm:flex items-center justify-between mt-4">
                            {steps.map((item, index) => {
                                const Icon = item.icon;
                                const active = item.number === step;
                                const completed = item.number < step;

                                return (
                                    <React.Fragment key={item.number}>

                                        <div className="flex flex-col items-center gap-1.5">

                                            <div
                                                className={`
                          w-8
                          h-8
                          rounded-full
                          flex
                          items-center
                          justify-center
                          border
                          transition-all
                          duration-300
                          ${active
                                                        ? "bg-green-600 border-green-600 text-white"
                                                        : completed
                                                            ? "bg-green-50 border-green-200 text-green-500"
                                                            : "bg-white border-zinc-200 text-zinc-400"
                                                    }
                        `}
                                            >
                                                <Icon size={14} />
                                            </div>

                                            <span
                                                className={`
                          text-[9px]
                          font-medium
                          ${active
                                                        ? "text-green-500"
                                                        : "text-zinc-400"
                                                    }
                        `}
                                            >
                                                {item.shortTitle}
                                            </span>

                                        </div>

                                        {index < steps.length - 1 && (
                                            <div
                                                className={`
                          flex-1
                          h-px
                          mx-2
                          mb-5
                          transition-colors
                          ${item.number < step
                                                        ? "bg-green-300"
                                                        : "bg-zinc-200"
                                                    }
                        `}
                                            />
                                        )}

                                    </React.Fragment>
                                );
                            })}
                        </div>

                    </div>
                </div>

                {/* --------------------------------
            Content
        -------------------------------- */}
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 sm:px-8 py-7">

                    <AnimatePresence mode="wait">

                        {/* STEP 1 */}
                        {step === 1 && (
                            <StepWrapper key="step-1">
                                <StepIcon>
                                    <Power size={28} />
                                </StepIcon>

                                <StepHeading>
                                    Power on your S.P.I.R.E.
                                </StepHeading>

                                <StepDescription>
                                    Start by powering on your S.P.I.R.E. robot and wait for the
                                    ESP32 controller to finish booting.
                                </StepDescription>

                                <InstructionList
                                    items={[
                                        "Turn on the robot's main power switch.",
                                        "Make sure the ESP32 and other onboard electronics are powered.",
                                        "Wait a few seconds for the ESP32 to complete its startup sequence.",
                                        "Keep the robot stationary while configuring its network.",
                                    ]}
                                />

                                <InfoBox icon={<Power size={17} />}>
                                    Keep the robot powered on throughout the setup process.
                                </InfoBox>
                            </StepWrapper>
                        )}

                        {/* STEP 2 */}
                        {step === 2 && (
                            <StepWrapper key="step-2">
                                <StepIcon>
                                    <Wifi size={28} />
                                </StepIcon>

                                <StepHeading>
                                    Connect to the robot's Wi-Fi
                                </StepHeading>

                                <StepDescription>
                                    Your S.P.I.R.E. creates its own temporary Wi-Fi network
                                    during setup. Connect your phone or laptop to it.
                                </StepDescription>

                                <div className="grid sm:grid-cols-2 gap-3 mt-6">

                                    <DeviceCard
                                        icon={Smartphone}
                                        title="Phone"
                                        description="Open Wi-Fi settings and connect to the S.P.I.R.E. network."
                                    />

                                    <DeviceCard
                                        icon={Laptop}
                                        title="Laptop"
                                        description="Open your Wi-Fi settings and connect to the robot's network."
                                    />

                                </div>

                                <div className="
                  mt-5
                  rounded-2xl
                  border
                  border-zinc-200
                  bg-zinc-50
                  p-5
                ">

                                    <p className="text-xs font-medium text-zinc-500 mb-3">
                                        ROBOT ACCESS POINT
                                    </p>

                                    <div className="space-y-3">

                                        <CredentialRow
                                            label="Network"
                                            value="SPIRE 1.0"
                                        />

                                        <CredentialRow
                                            label="Password"
                                            value="SPIRE78150"
                                        />

                                    </div>

                                </div>

                                <InfoBox icon={<Wifi size={17} />}>
                                    Your device may show "No Internet". This is normal during
                                    robot configuration.
                                </InfoBox>
                            </StepWrapper>
                        )}

                        {/* STEP 3 */}
                        {step === 3 && (
                            <StepWrapper key="step-3">
                                <StepIcon>
                                    <Globe size={28} />
                                </StepIcon>

                                <StepHeading>
                                    Open the robot setup page
                                </StepHeading>

                                <StepDescription>
                                    Once connected to the S.P.I.R.E. access point, open a web
                                    browser on your phone or laptop.
                                </StepDescription>

                                <div className="
                  mt-6
                  rounded-2xl
                  border
                  border-green-100
                  bg-green-50/60
                  p-5
                  sm:p-6
                ">

                                    <p className="text-xs font-semibold tracking-wider text-green-700 uppercase mb-3">
                                        ESP32 SETUP ADDRESS
                                    </p>

                                    <div className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    rounded-xl
                    bg-white
                    border
                    border-green-100
                    px-4
                    py-3
                  ">

                                        <code className="
                      text-lg
                      sm:text-xl
                      font-semibold
                      tracking-wide
                      text-zinc-800
                    ">
                                            {robotIP}
                                        </code>

                                        <button
                                            type="button"
                                            onClick={copyIP}
                                            className="
                        shrink-0
                        flex
                        items-center
                        gap-2
                        px-3
                        py-2
                        rounded-lg
                        text-xs
                        font-medium
                        bg-green-600
                        text-white
                        hover:bg-green-700
                        transition
                        cursor-pointer
                      "
                                        >
                                            {copied ? (
                                                <>
                                                    <Check size={14} />
                                                    Copied
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={14} />
                                                    Copy
                                                </>
                                            )}
                                        </button>

                                    </div>

                                </div>

                                <InstructionList
                                    items={[
                                        "Open Chrome, Safari, Edge, or another browser.",
                                        `Enter ${robotIP} in the address bar.`,
                                        "Press Enter or Go to open the ESP32 configuration page.",
                                    ]}
                                />

                                <InfoBox icon={<ExternalLink size={17} />}>
                                    Make sure you are still connected to the S.P.I.R.E.
                                    access point while opening this address.
                                </InfoBox>
                            </StepWrapper>
                        )}

                        {/* STEP 4 */}
                        {step === 4 && (
                            <StepWrapper key="step-4">
                                <StepIcon>
                                    <Wifi size={28} />
                                </StepIcon>

                                <StepHeading>
                                    Configure your Wi-Fi
                                </StepHeading>

                                <StepDescription>
                                    The ESP32 setup page will ask for the Wi-Fi network that
                                    you want your S.P.I.R.E. to use.
                                </StepDescription>

                                <div className="
                  mt-6
                  rounded-2xl
                  border
                  border-zinc-200
                  bg-zinc-50
                  p-5
                  sm:p-6
                ">

                                    <div className="space-y-4">

                                        <FakeInput
                                            label="Wi-Fi Name"
                                            placeholder="Enter your Wi-Fi SSID"
                                        />

                                        <FakeInput
                                            label="Wi-Fi Password"
                                            placeholder="Enter your Wi-Fi password"
                                            password
                                        />

                                    </div>

                                </div>

                                <InstructionList
                                    items={[
                                        "Enter the name of your Wi-Fi network.",
                                        "Enter the corresponding Wi-Fi password.",
                                        "Submit or save the configuration from the ESP32 page.",
                                        "Wait for the robot to save the credentials and restart.",
                                    ]}
                                />

                                <InfoBox icon={<ShieldCheck size={17} />}>
                                    These credentials are entered directly into the robot's
                                    setup page. They are not submitted through this website.
                                </InfoBox>
                            </StepWrapper>
                        )}

                        {/* STEP 5 */}
                        {step === 5 && (
                            <StepWrapper key="step-5">
                                <StepIcon>
                                    <RefreshCw size={28} />
                                </StepIcon>

                                <StepHeading>
                                    Reconnect to your network
                                </StepHeading>

                                <StepDescription>
                                    After saving your Wi-Fi credentials, the ESP32 will restart
                                    and attempt to connect to your selected network.
                                </StepDescription>

                                <div className="
                  mt-6
                  rounded-2xl
                  border
                  border-zinc-200
                  bg-zinc-50
                  p-5
                  sm:p-6
                ">

                                    <div className="flex items-center gap-4">

                                        <div className="
                      w-11
                      h-11
                      shrink-0
                      rounded-xl
                      bg-white
                      border
                      border-zinc-200
                      flex
                      items-center
                      justify-center
                    ">
                                            <RefreshCw
                                                size={20}
                                                className="text-green-500"
                                            />
                                        </div>

                                        <div>
                                            <p className="font-medium text-zinc-800">
                                                Robot restarting
                                            </p>

                                            <p className="text-sm text-zinc-500 mt-0.5">
                                                Wait approximately 10–20 seconds.
                                            </p>
                                        </div>

                                    </div>

                                </div>

                                <InstructionList
                                    items={[
                                        "Wait for the ESP32 to restart.",
                                        "Open Wi-Fi settings on your phone or laptop.",
                                        "Disconnect from the S.P.I.R.E. access point.",
                                        "Connect to the same Wi-Fi network you configured for the robot.",
                                        "Keep the robot powered on.",
                                    ]}
                                />

                                <InfoBox icon={<Wifi size={17} />}>
                                    Your phone or laptop and S.P.I.R.E. must be connected to
                                    the same Wi-Fi network for the next stage.
                                </InfoBox>
                            </StepWrapper>
                        )}

                        {/* STEP 6 */}
                        {step === 6 && (
                            <StepWrapper key="step-6">
                                <motion.div
                                    initial={{ scale: 0.7, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 220,
                                        damping: 15,
                                    }}
                                    className="
                    w-16
                    h-16
                    rounded-2xl
                    bg-green-50
                    border
                    border-green-100
                    flex
                    items-center
                    justify-center
                    text-green-500
                  "
                                >
                                    <Check size={31} strokeWidth={2.2} />
                                </motion.div>

                                <StepHeading>
                                    S.P.I.R.E. is ready
                                </StepHeading>

                                <StepDescription>
                                    Your robot has been configured for your Wi-Fi network.
                                    Your phone or laptop should now be connected to the same
                                    network.
                                </StepDescription>

                                <div className="
                  mt-6
                  rounded-2xl
                  border
                  border-green-100
                  bg-green-50/60
                  p-5
                  sm:p-6
                ">

                                    <div className="flex items-start gap-3">

                                        <ShieldCheck
                                            size={21}
                                            className="text-green-500 mt-0.5 shrink-0"
                                        />

                                        <div>
                                            <p className="font-medium text-green-800">
                                                Network configuration complete
                                            </p>

                                            <p className="text-sm text-green-700/70 mt-1 leading-relaxed">
                                                The next step is to pair this robot with your
                                                S.P.I.R.E. account so you can access and manage it
                                                from your dashboard.
                                            </p>
                                        </div>

                                    </div>

                                </div>

                                <div className="mt-5 flex items-center justify-center gap-2 text-xs text-zinc-400">
                                    <Bot size={14} />
                                    <span>Ready for robot pairing</span>
                                </div>
                            </StepWrapper>
                        )}

                    </AnimatePresence>

                </div>

                {/* --------------------------------
            Footer
        -------------------------------- */}
                <div className="
          px-5
          sm:px-7
          py-4
          border-t
          border-zinc-100
          bg-white
          flex
          items-center
          justify-between
          gap-3
        ">

                    {/* Back */}
                    <button
                        type="button"
                        onClick={previousStep}
                        disabled={step === 1}
                        className="
              flex
              items-center
              gap-2
              px-4
              py-2.5
              rounded-xl
              text-sm
              font-medium
              text-zinc-600
              hover:bg-zinc-100
              hover:text-zinc-900
              disabled:opacity-30
              disabled:pointer-events-none
              transition
              cursor-pointer
            "
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>

                    {/* Next / Pair */}
                    {step < TOTAL_STEPS ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="
                flex
                items-center
                gap-2
                px-5
                py-2.5
                rounded-xl
                text-sm
                font-medium
                bg-green-600
                text-white
                hover:bg-green-700
                shadow-sm
                hover:shadow-md
                transition-all
                cursor-pointer
              "
                        >
                            Next
                            <ArrowRight size={16} />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                onPairRobot?.();
                            }}
                            className="
                flex
                items-center
                gap-2
                px-5
                py-2.5
                rounded-xl
                text-sm
                font-medium
                bg-green-600
                text-white
                hover:bg-green-700
                shadow-sm
                hover:shadow-md
                transition-all
                cursor-pointer
              "
                        >
                            Pair Robot
                            <ArrowRight size={16} />
                        </button>
                    )}

                </div>
            </motion.div>
        </div>
    );
};

/* =====================================================
   Reusable components
===================================================== */

const StepWrapper = ({ children }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.22 }}
            className="max-w-xl mx-auto"
        >
            {children}
        </motion.div>
    );
};

const StepIcon = ({ children }) => {
    return (
        <div className="
      w-14
      h-14
      rounded-2xl
      bg-green-50
      border
      border-green-100
      flex
      items-center
      justify-center
      text-green-500
    ">
            {children}
        </div>
    );
};

const StepHeading = ({ children }) => {
    return (
        <h3 className="
      mt-5
      text-2xl
      sm:text-3xl
      font-semibold
      tracking-tight
      text-zinc-900
    ">
            {children}
        </h3>
    );
};

const StepDescription = ({ children }) => {
    return (
        <p className="
      mt-3
      text-sm
      sm:text-[15px]
      leading-6
      text-zinc-500
      max-w-lg
    ">
            {children}
        </p>
    );
};

const InstructionList = ({ items }) => {
    return (
        <div className="mt-6 space-y-3">

            {items.map((item, index) => (
                <div
                    key={index}
                    className="flex items-start gap-3"
                >
                    <div className="
            mt-0.5
            w-6
            h-6
            shrink-0
            rounded-full
            bg-green-50
            border
            border-green-100
            flex
            items-center
            justify-center
            text-[11px]
            font-semibold
            text-green-500
          ">
                        {index + 1}
                    </div>

                    <p className="
            text-sm
            leading-6
            text-zinc-600
          ">
                        {item}
                    </p>
                </div>
            ))}

        </div>
    );
};

const InfoBox = ({ icon, children }) => {
    return (
        <div className="
      mt-5
      flex
      items-start
      gap-3
      rounded-xl
      bg-green-50/70
      border
      border-green-100
      px-4
      py-3.5
      text-xs
      leading-5
      text-green-800/70
    ">
            <div className="shrink-0 text-green-500 mt-0.5">
                {icon}
            </div>

            <div>{children}</div>
        </div>
    );
};

const DeviceCard = ({ icon: Icon, title, description }) => {
    return (
        <div className="
      rounded-2xl
      border
      border-zinc-200
      bg-white
      p-4
    ">
            <Icon
                size={20}
                className="text-green-500 mb-3"
            />

            <p className="font-medium text-sm text-zinc-800">
                {title}
            </p>

            <p className="mt-1 text-xs leading-5 text-zinc-500">
                {description}
            </p>
        </div>
    );
};

const CredentialRow = ({ label, value }) => {
    return (
        <div className="flex items-center justify-between gap-4">

            <span className="text-xs text-zinc-500">
                {label}
            </span>

            <code className="text-sm font-medium text-zinc-800">
                {value}
            </code>

        </div>
    );
};

const FakeInput = ({ label, placeholder, password = false }) => {
    return (
        <div>
            <label className="
        block
        text-xs
        font-medium
        text-zinc-600
        mb-2
      ">
                {label}
            </label>

            <div className="
        h-11
        rounded-xl
        border
        border-zinc-200
        bg-white
        px-3.5
        flex
        items-center
        text-sm
        text-zinc-400
      ">
                {password ? "••••••••••••" : placeholder}
            </div>
        </div>
    );
};

export default AddSPIREModal;


