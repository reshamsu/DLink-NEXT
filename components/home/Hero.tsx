"use client";

import Image from "next/image";
import { ReactTyped } from "react-typed";
import { TbSearch } from "react-icons/tb";
// import { supabase } from "@/lib/supabaseClient";

// const FALLBACK_IMAGES = ["/assets/hero/.jpg"];

// interface HeroRow {
//   title: string;
//   subtitle: string;
//   page_type: string[];
//   image_urls: string[];
// }

const Hero = () => {
  //   const [current, setCurrent] = useState(0);
  //   const [images, setImages] = useState<string[]>(FALLBACK_IMAGES);
  //   const [title, setTitle] = useState(
  //     "Let Us Unfold Your Extraordinary Travel Story"
  //   );
  //   const [subtitle, setSubtitle] = useState(
  //     "Discover thousands of beautiful places around the world."
  //   );
  //   const [pageType, setPageType] = useState("Homepage");

  //   useEffect(() => {
  //     if (!supabase) return;

  //     const fetchHero = async () => {
  //       const { data, error } = await supabase
  //         .from("hero")
  //         .select("*")
  //         .contains("page_type", ["Homepage"])
  //         .order("created_at", { ascending: true })
  //         .limit(1)
  //         .single();

  //       if (error || !data) {
  //         console.warn("Using fallback hero content");
  //         return;
  //       }

  //       const hero = data as HeroRow;

  //       if (hero.image_urls?.length) {
  //         setImages(hero.image_urls);
  //       }

  //       if (hero.title) setTitle(hero.title);
  //       if (hero.subtitle) setSubtitle(hero.subtitle);
  //       if (hero.page_type) setPageType(hero.page_type[0]);
  //     };

  //     fetchHero();
  //   }, []);

  //   useEffect(() => {
  //     const interval = setInterval(
  //       () => setCurrent((prev) => (prev + 1) % images.length),
  //       10000
  //     );
  //     return () => clearInterval(interval);
  //   }, [images.length]);

  //   const prevSlide = () =>
  //     setCurrent((prev) => (prev - 1 + images.length) % images.length);
  //   const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);

  return (
    <div className="bg-gray-200 text-gray-900 relative">
      <div className="relative h-[74vh] w-full overflow-hidden flex flex-col justify-center gap-10 text-center z-10 ">
        <div className="absolute inset-0 transition-opacity duration-1000">
          <Image
            src="/assets/banner/hero_image.jpg"
            alt="Hero"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/20 lg:bg-[#f2836f]/20 group-hover:bg-black/64 transition-all duration-1000" />
        </div>

        {/* TEXT */}
        <div className="max-w-6xl mx-auto flex flex-col justify-center items-center text-center gap-6 text-white z-10 pt-22 px-8">
          <h1 className="text-4xl 2xl:text-5xl font-extrabold flex flex-col md:flex-row gap-2 md:gap-2.5">
            Find your Next{" "}
            <ReactTyped
              className="text-4xl 2xl:text-5xl font-extrabold text-orange-400"
              strings={["Property", "Home", "Apartment", "Villa", "Land"]}
              typeSpeed={200}
              backSpeed={140}
              loop
            />
          </h1>
          <p className="text-sm font-medium max-w-3xl">
            Find Properties for Sale, Rent or Invest
          </p>
        </div>

        <form
          method="post"
          className="max-w-4xl mx-auto -mb-40 md:mb-0 relative z-30 bg-white text-gray-900 text-[15px] p-2 rounded-3xl md:rounded-full shadow-xl hover:scale-105 duration-1000 w-full flex flex-col justify-between lg:flex-row"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
            {/* Search Property */}
            <div className="flex flex-col justify-center gap-2">
              <input
                id="property"
                type="text"
                placeholder="City. Building or Name"
                className="bg-white/40 hover:bg-white duration-500 transition-all border border-black/10 px-8 py-4 rounded-t-3xl lg:rounded-l-full"
                required
              />
            </div>

            {/* Property Type */}
            <div className="flex flex-col justify-center gap-2">
              <select
                id="type"
                name="type"
                defaultValue=""
                className="bg-white/40 hover:bg-white duration-500 transition-all border border-black/10 px-6 py-4"
                required
              >
                <option value="" disabled>
                  Property Type
                </option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="land">Lands</option>
                <option value="commercial">Commercial Property</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Search City */}
            <div className="flex flex-col justify-center gap-2">
              <select
                id="bed-bath"
                name="bed-bath"
                defaultValue=""
                className="bg-white/40 hover:bg-white duration-500 transition-all border-l border-black/10 px-6 py-4"
                required
              >
                <option value="" disabled>
                  Beds & Bath
                </option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="select-none btn-orange-base cursor-pointer"
          >
            <TbSearch size="22" /> Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default Hero;
