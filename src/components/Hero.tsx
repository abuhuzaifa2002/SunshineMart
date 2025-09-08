import Link from 'next/link';

interface HeroProps {
  title: string;
  highlightedText: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export default function Hero({
  title,
  highlightedText,
  description,
  buttonText,
  buttonLink,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden  ">
      <div className='dark:bg-black dark:text-white'>
        <div className="pattern-diagonal-lines absolute inset-0  " />
        <div className=" relative flex gap-2 mt-4">
          <div className="relative bg-gradient-to-r from-gray-900 via-red-900  to-gray-900 px-4 py-16 rounded w-[1240px] ml-[200px]">
            <span className="animate-fade-in mb-3 inline-block font-medium tracking-wider text-white/90">
              DISCOVER THE COLLECTION
            </span>
            <h1 className="animate-slide-up mb-4 font-display text-5xl font-bold leading-tight text-white">
              {title}
              <br />
              <span className="text-amber-100">{highlightedText}</span>
            </h1>
            <p className="animate-fade-in-delay mb-8 max-w-xl text-lg leading-relaxed text-white/90">
              {description}
            </p>
            <Link
              className="group inline-flex items-center rounded-full bg-white px-8 py-3 font-semibold text-orange-600 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-amber-50"
              href={buttonLink}
            >
              <span>{buttonText}</span>
              <svg
                className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </Link>
          </div>
          <div className="advertise bg-gray-900 w-[250px] text-black rounded shadow-lg">
            <Link className="group flex items-center animate-bounce" href="/">
              <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-red-900 to-red-500 transition-all duration-500 ease-out group-hover:rotate-3 group-hover:scale-110 group-hover:shadow-lg">
                <span className=" font-bold text-white transition-transform duration-300 group-hover:scale-110 ">
                  ☀️
                </span>
              </div>
              <span className="text-md text-white font-display text-2xl font-bold transition-all duration-500 ease-out group-hover:scale-105 group-hover:tracking-wide">
                Sunshine
              </span>
            </Link>
            <p className='text-white ml-14'>Download the App</p>
            <div className=" ml-2 flex mt-4">
              <Link href="/app-download" className="text-white">
                <img
                  src="/images/qr.png"
                  alt="App Store"
                  className="h-20 w-auto mr-2"
                />
              </Link>
              <div className="flex flex-col justify-center">
                  <Link
                      href="/app-download" className="flex mt-2 w-35 h-[30px] p-1 h-14 bg-transparent text-black border border-white rounded-md items-center justify-center">
                                <div className="mr-3">
                                  <svg viewBox="0 0 384 512" width={20} >
                                    <path
                                      fill="white"
                                      d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
                                    />
                                  </svg>
                                </div>
                                <div>
                                  <div className="text-xs text-white">Download on the</div>
                                  <div className="text-xs text-white font-semibold font-sans -mt-1">App Store</div>
                                </div>
                  </Link>
                  <Link
                    href="/app-download" className="flex mt-2 w-35 h-[30px] p-1 h-14 bg-transparent text-black border border-white rounded-md items-center justify-center">
                    <div className="mr-3">
                      <svg viewBox="0 0 512 512" width={20}>
                        <path
                          fill="white"
                          d="M349.33 69.33c-19.2-19.2-41.6-28.8-64.8-28.8s-45.6 9.6-64.8 28.8c-19.2 19.2-28.8 41.6-28.8 64.8s9.6 45.6 28.8 64.8l64.8 64.8 64.8-64.8c19.2-19.2 28.8-41.6 28.8-64.8s-9.6-45.6-28.8-64.8zM256 320c-53 0-96 43-96 96s43 96 96 96 96-43 96-96c0-53-43-96-96-96zm0 160c-35.3 0-64-28.7-64-64s28.7-64 64-64c35.3 0 64 28.7 64 64s-28.7 64-64 64z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-white">Get it on</div>
                      <div className="text-xs text-white font-semibold font-sans -mt-1">Google Play</div>
                    </div>
                  </Link>
              </div>
            </div>
            <div className='mt-4 mb-2'>
              <p className='text-md text-orange-300 font-semibold text-center'>Download the app and get</p>
              <p className='text-orange-500 text-2xl animate-bounce font-bold text-center'> 20% off</p>
              <p className='text-md text-orange-300 font-semibold text-center'>on your first order </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
