"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface Welcome {
  section2_title: string | null;
  section2_subtitle: string | null;
  section2_body: string | null;
  section2_image_collages: string[] | null;
}

const Welcome = () => {
  const [data, setData] = useState<Welcome | null>(null);
  const [loading, setLoading] = useState(true);

  return (
    <div className="bg-linear-to-b from-white via-white to-white">
      <div className="max-w-6xl mx-auto py-16 md:py-22 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 px-8 md:px-10 2xl:px-0">
        {/* IMAGES */}
        <div className="grid grid-cols-2 gap-5">
          <div
            key=""
            className="relative h-[180px] lg:h-[200px] rounded-3xl w-full bg-gray-100"
          >
            <Image src="" alt="" fill className="object-cover rounded-3xl" />
            <div className="absolute inset-0 bg-white/10 hover:bg-black/15 rounded-3xl duration-500" />
          </div>
        </div>

        {/* TEXT */}
        <div className="flex flex-col justify-center gap-4 xl:gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl 2xl:text-4xl font-bold uppercase text-[#f2836f]">
              Who We Are
            </h2>
            <label className="text-base lg:text-lg font-bold text-teal-600">
              Welcome Subtitle
            </label>
          </div>

          <p className="whitespace-pre-line text-xs lg:text-sm font-normal text-justify text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum
            nesciunt harum eveniet adipisci doloribus, velit nam, sed temporibus
            odit voluptate quos laborum quae labore? Illum temporibus officiis
            debitis dolor nemo? Lorem ipsum, dolor sit amet consectetur
            adipisicing elit. Earum libero minima animi voluptatibus. Veritatis
            voluptas, libero odio quisquam tempore debitis natus qui. Officiis,
            iure. Quod tempore molestiae inventore magnam aut!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
