import { useRef } from "react";

export default function OtpInput({ otp, setOtp }) {
  const inputsRef = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  return (
    <div className="flex gap-3 justify-center">
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={otp[index]}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="w-10 h-10 max-md:w-8 max-md:h-8 text-center text-xl max-md:text-sm font-semibold
                     rounded-lg border border-gray-600
                     text-black
                     focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      ))}
    </div>
  );
}
