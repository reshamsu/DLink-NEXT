"use client";

import Image from "next/image";
import Link from "next/link";

const Offer = () => {
  return (
    <section className="bg-white text-gray-800 relative">
      <div className="max-w-6xl mx-auto py-20 px-6 2xl:px-0 flex flex-col gap-12 2xl:gap-16">
        <div className="flex flex-col items-center text-center gap-4">
          <h1 className="text-3xl lg:text-4xl font-extrabold">
            Our <span className="text-orange-400">Expertise</span>
          </h1>
          <p className="text-sm 2xl:text-base text-gray-600 max-w-3xl">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus
            doloribus iure similique dolorem aperiam?
          </p>
        </div>

        <div className="flex flex-col-reverse md:grid md:grid-cols-2 gap-6 2xl:gap-14 px-2 md:px-0 items-center">
          <div className="flex flex-col gap-4 lg:gap-6 py-4 md:py-0 md:px-8">
            <h2 className="text-2xl md:text-xl 2xl:text-3xl font-extrabold border-b-4 border-orange-400 w-10 pb-4">
              Apartments
            </h2>
            <p className="text-sm md:text-xs 2xl:text-base text-gray-500 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Reiciendis ipsa nisi quasi necessitatibus exercitationem esse
              fugit dolor maxime neque mollitia adipisci cum eligendi
              praesentium iusto aspernatur accusamus quam, velit voluptatum?
            </p>
            <Link
              href="/apartments"
              className="flex items-center justify-center text-sm 2xl:text-base font-extrabold py-1.5 hover:p-2 duration-500 transition-all text-black border-b-2 w-fit"
            >
              Learn More
            </Link>
          </div>

          <div className="relative">
            <Image
              src="/assets/banner/apartment3.jpg"
              alt="Apartments"
              width={800}
              height={600}
              className="w-full h-full md:h-70 lg:h-[90%] object-cover rounded-3xl"
            />
            <div className="absolute inset-0 bg-white/10" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 2xl:gap-14 px-2 md:px-0 items-center">
          <div className="relative">
            <Image
              src="/assets/banner/house.jpg"
              alt="Homes"
              width={800}
              height={600}
              className="w-full h-full md:h-70 lg:h-[90%] object-cover rounded-3xl"
            />
            <div className="absolute inset-0 bg-white/15" />
          </div>

          <div className="flex flex-col gap-4 lg:gap-6 py-4 md:py-0 md:px-8">
            <h2 className="text-2xl md:text-xl 2xl:text-3xl font-extrabold border-b-4 border-orange-400 w-10 pb-4">
              Houses
            </h2>
            <p className="text-sm md:text-xs 2xl:text-base text-gray-500 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Provident, ea esse quia ex eos similique qui consectetur, ipsam ut
              cumque tempora, nihil beatae. Cumque alias corrupti perspiciatis
              totam tempore expedita?
            </p>
            <Link
              href="/homes"
              className="flex items-center justify-center text-sm 2xl:text-base font-extrabold py-1.5 hover:p-2 duration-500 transition-all text-black border-b-2 w-fit"
            >
              Learn More
            </Link>
          </div>
        </div>

        <div className="flex flex-col-reverse md:grid md:grid-cols-2 gap-6 2xl:gap-14 px-2 md:px-0 items-center">
          <div className="flex flex-col gap-4 lg:gap-6 py-4 md:py-0 md:px-8">
            <h2 className="text-2xl md:text-xl 2xl:text-3xl font-extrabold border-b-4 border-orange-400 w-10 pb-4">
              Lands
            </h2>
            <p className="text-sm md:text-xs 2xl:text-base text-gray-500 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Reiciendis ipsa nisi quasi necessitatibus exercitationem esse
              fugit dolor maxime neque mollitia adipisci cum eligendi
              praesentium iusto aspernatur accusamus quam, velit voluptatum?
            </p>
            <Link
              href="/lands"
              className="flex items-center justify-center text-sm 2xl:text-base font-extrabold py-1.5 hover:p-2 duration-500 transition-all text-black border-b-2 w-fit"
            >
              Learn More
            </Link>
          </div>
          <div className="relative">
            <Image
              src="/assets/banner/land2.jpg"
              alt="Lands"
              width={800}
              height={600}
              className="w-full h-full md:h-70 lg:h-[90%] 2xl:h-[420px] object-cover rounded-3xl"
            />
            <div className="absolute inset-0 bg-white/10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Offer;
