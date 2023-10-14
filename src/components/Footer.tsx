import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
export const Footer: FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="flex">
      <footer className="border-t-2 border-[#141414] bg-black hover:text-white w-screen">
        <div className="ml-12 py-2 mr-12">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-8 md:space-x-12 relative">
            <div className="flex flex-col col-span-2 mx-4 items-center md:items-start">
              <div className="flex flex-row ml-1"></div>
              <div className="flex md:ml-2">
                {/* X / Twitter Gael */}
                <a
                  href="https://twitter.com/Gael1130"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-500"
                >
                  <Image
                    src="/x_gael1130.svg"
                    alt="Twitter / X Handle Gael"
                    width={240} // Assuming width is 24 * 10 (since the class indicates 'w-24')
                    height={240} // Assuming an equal height as width for simplicity, adjust as needed
                    className="w-24 h-full mx-auto hover:invert"
                  />
                </a>
                {/* Youtube Gael */}
                <a
                  href="https://youtu.be/awzE0MP0Ewc"
                  type="button"
                  className="border-white text-secondary hover:text-red-500 leading-normal focus:outline-none focus:ring-0 transition duration-150 ease-in-out w-9 h-9 m-1"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="youtube"
                    className="w-4 h-full mx-auto"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 576 512"
                  >
                    <path
                      fill="currentColor"
                      d="M569.6 119.3c-6.4-23.9-25.6-42.7-49.6-49.1C458.1 56 288 56 288 56S117.9 56 56 70.2c-24 6.4-43.2 25.2-49.6 49.1C0 153.2 0 256 0 256s0 102.8 6.4 136.7c6.4 23.9 25.6 42.7 49.6 49.1 61.9 16.5 232 16.5 232 16.5s170.1 0 232-16.5c24-6.4 43.2-25.2 49.6-49.1 6.4-33.9 6.4-136.7 6.4-136.7s0-102.8-6.4-136.7zM230.4 352V160l166.4 96-166.4 96z"
                    ></path>
                  </svg>
                </a>

                {/* Lkdn Elsa */}
                <p className="mt-2.5">
                  <a
                    href="https://www.revealdesignagency.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-blue-500 hover:underline"
                  >
                    {" "}
                    Elsa
                  </a>
                </p>
                <a
                  href="https://www.linkedin.com/in/elsa-lambinet-sander-5b4b4944/"
                  type="button"
                  className="border-white text-secondary hover:text-red-500 leading-normal focus:outline-none focus:ring-0 transition duration-150 ease-in-out w-9 h-9 m-1"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    // width="24px"
                    // height="24px"
                    className="h-5 mt-2 mx-auto hover:invert"
                  >
                    <path
                      fill="#0288D1"
                      d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"
                    />
                    <path
                      fill="#FFF"
                      d="M12 19H17V36H12zM14.485 17h-.028C12.965 17 12 15.888 12 14.499 12 13.08 12.995 12 14.514 12c1.521 0 2.458 1.08 2.486 2.499C17 15.887 16.035 17 14.485 17zM36 36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698-1.501 0-2.313 1.012-2.707 1.99C24.957 25.543 25 26.511 25 27v9h-5V19h5v2.616C25.721 20.5 26.85 19 29.738 19c3.578 0 6.261 2.25 6.261 7.274L36 36 36 36z"
                    />
                  </svg>
                </a>
              </div>
              <div className="mb-2 m-1 sm:text-left place-items-start items-start font-normal tracking-tight text-secondary">
                © {currentYear} built by Gael, art by Elsa
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
