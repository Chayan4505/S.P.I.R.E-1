const baseUrl = process.env.BACKEND_URL || "http://localhost:5000";
 
const defaultImages = {
  logo: `${baseUrl}/uploads/Logo.png`,
  hero: `${baseUrl}/uploads/hero.jpg`,
};
 
const baseStyles = `
  font-family:'Segoe UI',-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif;
  -webkit-font-smoothing:antialiased;
  -webkit-text-size-adjust:100%;
  -ms-text-size-adjust:100%;
`;
 
const headBlock = `
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,date=no,address=no,email=no">
  <style>
    body, table, td, div, p { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    @media only screen and (max-width:480px) {
      .spire-otp-cell { padding:1px !important; }
      .spire-otp-box {
        width:30px !important;
        height:42px !important;
        line-height:42px !important;
        font-size:16px !important;
        border-radius:8px !important;
      }
      .spire-card-body { padding:22px 16px !important; }
      .spire-hero { height:130px !important; }
    }
  </style>
`;
 
const otpBoxes = (otp) => {
  return String(otp)
    .split("")
    .map(
      (digit) => `
        <td class="spire-otp-cell" style="padding:2px;">
          <div
            class="spire-otp-box"
            style="
              width:38px;
              height:48px;
              background:#ffffff;
              border:1.5px solid #38b000;
              border-radius:10px;
              text-align:center;
              line-height:48px;
              font-size:21px;
              font-weight:800;
              color:#238000;
              box-sizing:border-box;
            "
          >
            ${digit}
          </div>
        </td>
      `
    )
    .join("");
};
 
//  EMAIL VERIFICATION
export const emailVerification = (name, otp, images = defaultImages) => {
  return `
<!DOCTYPE html>
<html>
<head>
  ${headBlock}
  <title>Verify Your S.P.I.R.E. Account</title>
</head>
 
<body
  style="
    margin:0;
    padding:0;
    background:#f4f7f4;
    ${baseStyles}
  "
>
 
  <div
    style="
      width:100%;
      padding:28px 12px;
      box-sizing:border-box;
    "
  >
 
    <!-- Main Container -->
    <div
      style="
        width:100%;
        max-width:580px;
        margin:0 auto;
      "
    >
 
      <!-- Brand -->
      <div
        style="
          text-align:center;
          margin-bottom:22px;
        "
      >
        <img
          src="${images.logo}"
          width="120"
          height="38"
          alt="S.P.I.R.E."
          style="
            width:auto;
            height:38px;
            max-width:120px;
            vertical-align:middle;
            display:inline-block;
            border:0;
            outline:none;
          "
        />
 
        <span
          style="
            display:inline-block;
            margin-left:8px;
            vertical-align:middle;
            color:#111827;
            font-size:25px;
            line-height:38px;
            font-weight:750;
            letter-spacing:-0.5px;
          "
        >
          S.P.I.R.E.
        </span>
      </div>
 
 
      <!-- Card -->
      <div
        style="
          background:#ffffff;
          border-radius:20px;
          overflow:hidden;
          border:1px solid #e5e7eb;
          box-shadow:0 8px 28px rgba(15,23,42,0.07);
        "
      >
 
        <!-- Hero Header -->
        <div
          style="
            background:linear-gradient(135deg,#166534 0%,#38b000 55%,#9ef01a 100%);
            padding:30px 24px 0;
          "
        >
 
          <!-- Label -->
          <div
            style="
              display:inline-block;
              padding:6px 12px;
              border-radius:999px;
              background:rgba(255,255,255,0.14);
              border:1px solid rgba(255,255,255,0.25);
              margin-bottom:13px;
            "
          >
            <span
              style="
                color:#f0fdf4;
                font-size:10px;
                font-weight:700;
                letter-spacing:1.2px;
                text-transform:uppercase;
              "
            >
              Email Verification
            </span>
          </div>
 
 
          <!-- Heading -->
          <h1
            style="
              margin:0;
              color:#ffffff;
              font-size:28px;
              line-height:1.2;
              font-weight:750;
              letter-spacing:-0.5px;
            "
          >
            Verify Your Email
          </h1>
 
 
          <p
            style="
              margin:10px 0 24px;
              color:#ecfdf5;
              font-size:14px;
              line-height:1.6;
            "
          >
            One final step before accessing your S.P.I.R.E. account.
          </p>
 
 
          <!-- Hero Image -->
          <div
            class="spire-hero"
            style="
              width:100%;
              height:170px;
              overflow:hidden;
              border-radius:16px 16px 0 0;
            "
          >
            <img
              src="${images.hero}"
              width="580"
              height="170"
              alt="S.P.I.R.E. agricultural robot"
              style="
                width:100%;
                height:100%;
                object-fit:cover;
                display:block;
                border:0;
                outline:none;
              "
            >
          </div>
 
        </div>
 
 
        <!-- Body -->
        <div
          class="spire-card-body"
          style="
            padding:30px 26px;
          "
        >
 
          <!-- Greeting -->
          <h2
            style="
              margin:0 0 12px;
              color:#111827;
              font-size:22px;
              line-height:1.3;
              font-weight:700;
            "
          >
            Hello ${name},
          </h2>
 
 
          <p
            style="
              margin:0;
              color:#4b5563;
              font-size:14px;
              line-height:1.75;
            "
          >
            Welcome to S.P.I.R.E. Thank you for creating your account.
            To continue, please verify your email address using the
            One-Time Password below.
          </p>
 
 
          <!-- OTP Card -->
          <div
            style="
              margin:26px 0;
              padding:20px 12px;
              background:linear-gradient(135deg,#f7ffd6 0%,#effdf3 100%);
              border:1px solid #b7e47d;
              border-radius:16px;
              text-align:center;
              box-sizing:border-box;
            "
          >
 
            <p
              style="
                margin:0 0 13px;
                color:#238000;
                font-size:10px;
                font-weight:750;
                letter-spacing:1.2px;
                text-transform:uppercase;
              "
            >
              Your Verification Code
            </p>
 
 
            <!-- OTP -->
            <table
              role="presentation"
              align="center"
              cellpadding="0"
              cellspacing="0"
              border="0"
              style="
                margin:0 auto;
                max-width:100%;
              "
            >
              <tr>
                ${otpBoxes(otp)}
              </tr>
            </table>
 
 
            <p
              style="
                margin:15px 0 0;
                color:#4b5563;
                font-size:12px;
                line-height:1.5;
              "
            >
              This verification code expires in
              <strong style="color:#166534;">
                5 minutes
              </strong>.
            </p>
 
          </div>
 
 
          <!-- Security Notice -->
          <div
            style="
              background:#f8faf8;
              border:1px solid #e5e7eb;
              border-left:4px solid #38b000;
              padding:13px 14px;
              border-radius:9px;
              margin-bottom:24px;
            "
          >
            <p
              style="
                margin:0;
                color:#4b5563;
                font-size:12px;
                line-height:1.65;
              "
            >
              If you did not create an account, you can safely ignore
              this email. Never share your verification code with anyone.
            </p>
          </div>
 
 
          <!-- Button -->
          <div style="text-align:center;">
 
            <a
              href="https://yourapp.com"
              style="
                display:inline-block;
                background:#238000;
                color:#ffffff;
                text-decoration:none;
                padding:12px 27px;
                border-radius:999px;
                font-size:13px;
                font-weight:650;
                box-shadow:0 5px 14px rgba(35,128,0,0.22);
              "
            >
              Open S.P.I.R.E.
            </a>
 
          </div>
 
        </div>
 
      </div>
 
 
      <!-- Footer -->
      <div
        style="
          text-align:center;
          padding:20px 10px 8px;
        "
      >
 
        <p
          style="
            margin:0;
            color:#238000;
            font-size:15px;
            font-weight:750;
          "
        >
          S.P.I.R.E.
        </p>
 
        <p
          style="
            margin:7px 0 0;
            color:#6b7280;
            font-size:11px;
            line-height:1.5;
          "
        >
          Soil Precision &amp; Intelligent Robotic Ecosystem
        </p>
 
        <p
          style="
            margin:12px 0 0;
            color:#9ca3af;
            font-size:10px;
          "
        >
          © ${new Date().getFullYear()} S.P.I.R.E. All rights reserved.
        </p>
 
      </div>
 
    </div>
 
  </div>
 
</body>
</html>
  `;
};
 
 
//  RESEND OTP
export const resendOTPTemplate = (name, otp, images = defaultImages) => {
  return `
<!DOCTYPE html>
<html>
<head>
  ${headBlock}
  <title>New S.P.I.R.E. Verification Code</title>
</head>
 
<body
  style="
    margin:0;
    padding:0;
    background:#f4f7f4;
    ${baseStyles}
  "
>
 
  <div
    style="
      width:100%;
      padding:28px 12px;
      box-sizing:border-box;
    "
  >
 
    <div
      style="
        width:100%;
        max-width:580px;
        margin:0 auto;
      "
    >
 
      <!-- Brand -->
      <div
        style="
          text-align:center;
          margin-bottom:22px;
        "
      >
        <img
          src="${images.logo}"
          width="120"
          height="38"
          alt="S.P.I.R.E."
          style="
            width:auto;
            height:38px;
            max-width:120px;
            vertical-align:middle;
            display:inline-block;
            border:0;
            outline:none;
          "
        />
 
        <span
          style="
            display:inline-block;
            margin-left:8px;
            vertical-align:middle;
            color:#111827;
            font-size:25px;
            line-height:38px;
            font-weight:750;
            letter-spacing:-0.5px;
          "
        >
          S.P.I.R.E.
        </span>
      </div>
 
 
      <!-- Card -->
      <div
        style="
          background:#ffffff;
          border-radius:20px;
          overflow:hidden;
          border:1px solid #e5e7eb;
          box-shadow:0 8px 28px rgba(15,23,42,0.07);
        "
      >
 
        <!-- Header -->
        <div
          style="
            background:linear-gradient(135deg,#166534 0%,#38b000 55%,#9ef01a 100%);
            padding:28px 24px;
          "
        >
 
          <div
            style="
              display:inline-block;
              padding:6px 12px;
              border-radius:999px;
              background:rgba(255,255,255,0.14);
              border:1px solid rgba(255,255,255,0.25);
              margin-bottom:13px;
            "
          >
            <span
              style="
                color:#f0fdf4;
                font-size:10px;
                font-weight:700;
                letter-spacing:1.2px;
                text-transform:uppercase;
              "
            >
              New Verification Code
            </span>
          </div>
 
 
          <h1
            style="
              margin:0;
              color:#ffffff;
              font-size:27px;
              line-height:1.2;
              font-weight:750;
              letter-spacing:-0.5px;
            "
          >
            Your New OTP
          </h1>
 
 
          <p
            style="
              margin:9px 0 0;
              color:#ecfdf5;
              font-size:14px;
              line-height:1.6;
            "
          >
            Use the new verification code below to continue.
          </p>
 
        </div>
 
 
        <!-- Body -->
        <div
          class="spire-card-body"
          style="
            padding:30px 26px;
          "
        >
 
          <h2
            style="
              margin:0 0 12px;
              color:#111827;
              font-size:22px;
              line-height:1.3;
              font-weight:700;
            "
          >
            Hello ${name},
          </h2>
 
 
          <p
            style="
              margin:0;
              color:#4b5563;
              font-size:14px;
              line-height:1.75;
            "
          >
            Here is your new One-Time Password for verifying your
            S.P.I.R.E. account.
          </p>
 
 
          <!-- OTP -->
          <div
            style="
              margin:26px 0;
              padding:20px 12px;
              background:linear-gradient(135deg,#f7ffd6 0%,#effdf3 100%);
              border:1px solid #b7e47d;
              border-radius:16px;
              text-align:center;
              box-sizing:border-box;
            "
          >
 
            <p
              style="
                margin:0 0 13px;
                color:#238000;
                font-size:10px;
                font-weight:750;
                letter-spacing:1.2px;
                text-transform:uppercase;
              "
            >
              Your New Verification Code
            </p>
 
 
            <table
              role="presentation"
              align="center"
              cellpadding="0"
              cellspacing="0"
              border="0"
              style="
                margin:0 auto;
                max-width:100%;
              "
            >
              <tr>
                ${otpBoxes(otp)}
              </tr>
            </table>
 
 
            <p
              style="
                margin:15px 0 0;
                color:#4b5563;
                font-size:12px;
                line-height:1.5;
              "
            >
              This OTP expires in
              <strong style="color:#166534;">
                5 minutes
              </strong>.
            </p>
 
          </div>
 
 
          <!-- Security -->
          <div
            style="
              background:#f8faf8;
              border:1px solid #e5e7eb;
              border-left:4px solid #38b000;
              padding:13px 14px;
              border-radius:9px;
              margin-bottom:24px;
            "
          >
            <p
              style="
                margin:0;
                color:#4b5563;
                font-size:12px;
                line-height:1.65;
              "
            >
              If you did not request a new code, you can safely ignore
              this email. Never share your OTP with anyone.
            </p>
          </div>
 
 
          <!-- Button -->
          <div style="text-align:center;">
 
            <a
              href="https://yourapp.com"
              style="
                display:inline-block;
                background:#238000;
                color:#ffffff;
                text-decoration:none;
                padding:12px 27px;
                border-radius:999px;
                font-size:13px;
                font-weight:650;
                box-shadow:0 5px 14px rgba(35,128,0,0.22);
              "
            >
              Open S.P.I.R.E.
            </a>
 
          </div>
 
        </div>
 
      </div>
 
 
      <!-- Footer -->
      <div
        style="
          text-align:center;
          padding:20px 10px 8px;
        "
      >
 
        <p
          style="
            margin:0;
            color:#238000;
            font-size:15px;
            font-weight:750;
          "
        >
          S.P.I.R.E.
        </p>
 
        <p
          style="
            margin:7px 0 0;
            color:#6b7280;
            font-size:11px;
            line-height:1.5;
          "
        >
          Soil Precision &amp; Intelligent Robotic Ecosystem
        </p>
 
        <p
          style="
            margin:12px 0 0;
            color:#9ca3af;
            font-size:10px;
          "
        >
          © ${new Date().getFullYear()} S.P.I.R.E. All rights reserved.
        </p>
 
      </div>
 
    </div>
 
  </div>
 
</body>
</html>
  `;
};