import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
export const Footer: FC = () => {
    const currentYear = new Date().getFullYear();
    return (
        <div className="flex">
            <footer className="border-t-2 border-[#141414] bg-black hover:text-white w-screen" >
                <div className="ml-12 py-2 mr-12">
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-8 md:space-x-12 relative">
                        <div className='flex flex-col col-span-2 mx-4 items-center md:items-start'>
                            <div className='flex flex-row ml-1'>
                            </div>
                            <div className="flex md:ml-2">
                                {/* X / Twitter */}
                                <a href="https://twitter.com/Gael1130" target="_blank">
                                    <img src="x_gael1130.svg" alt="" className='w-24 h-full mx-auto hover:bg-red'/>
                                </a>
                                {/* Youtube */}
                                <a href="https://youtu.be/GDyXXdf4Znc"  type="button" className="border-white text-secondary hover:text-red-500 leading-normal focus:outline-none focus:ring-0 transition duration-150 ease-in-out w-9 h-9 m-1" target="_blank">
                                    <svg aria-hidden="true"
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
                            </div>
                            <div className="mb-2 m-1 sm:text-left place-items-start items-start font-normal tracking-tight text-secondary">
                                        © { currentYear } built by Gael, art by Elsa
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
