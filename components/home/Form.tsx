import React from "react";
import { TbSearch } from "react-icons/tb";

const Form = () => {
  return (
    <div className="bg-gray-100 text-gray-800" id="form">
      <div className="max-w-6xl mx-auto py-14 px-6 2xl:px-0 flex flex-col items-center gap-10">
        <div className="flex flex-col items-center text-center gap-2">
          <h2 className="text-2xl font-bold">Find Your Ideal Property</h2>
          <p className="text-gray-500">
            Choose location and dates to find available property
          </p>
        </div>
        <form
          method="post"
          className="bg-white text-sm p-7 rounded-3xl shadow-md w-full flex flex-col lg:flex-row gap-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Property */}
            <div className="flex flex-col gap-2">
              <label htmlFor="property" className="font-medium">
                Search Property
              </label>
              <input
                id="property"
                type="text"
                placeholder="Property Title or Name"
                className="bg-white/40 hover:bg-white duration-500 transition-all border border-black/10 px-4 py-3 rounded-xl hover:scale-105"
                required
              />
            </div>

            {/* Property Type */}
            <div className="flex flex-col gap-2">
              <label htmlFor="type" className="font-medium">
                Property Type
              </label>
              <select
                id="type"
                name="type"
                defaultValue=""
                className="bg-white/40 hover:bg-white duration-500 transition-all border border-black/10 px-4 py-3 rounded-xl hover:scale-105 w-full"
                required
              >
                <option value="" disabled>
                  Type
                </option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="land">Lands</option>
                <option value="commercial">Commercial Property</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Search City */}
            <div className="flex flex-col gap-2">
              <label htmlFor="city" className="font-medium">
                Search City
              </label>
              <select
                id="city"
                name="city"
                defaultValue=""
                className="bg-white/40 hover:bg-white duration-500 transition-all border border-black/10 px-4 py-3 rounded-xl hover:scale-105 w-full"
                required
              >
                <option value="" disabled>
                  City
                </option>
                <option value="dehiwela">Dehiwela</option>
                <option value="wellawatta">Wellawatta (Colombo 6)</option>
                <option value="mount">Mount Lavinia</option>
                <option value="kohuwela">Kohuwela</option>
                <option value="nugegoda">Nugegoda</option>
                <option value="borelasgamuwa">Borelasgamuwa</option>
                <option value="rathmalana">Rathmalana</option>
              </select>
            </div>

            {/* Property Status */}
            <div className="flex flex-col gap-2">
              <label htmlFor="status" className="font-medium">
                Property Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue=""
                className="bg-white/40 hover:bg-white duration-500 transition-all border border-black/10 px-4 py-3 rounded-xl hover:scale-105 w-full"
                required
              >
                <option value="" disabled>
                  Status
                </option>
                <option value="rental">Rental</option>
                <option value="sale">Sale</option>
                <option value="lease">Lease</option>
              </select>
            </div>
          </div>

          <div className="flex items-center">
            <button
              type="submit"
              className="flex items-center gap-3 hover:gap-4 duration-500 transition-transform select-none btn-orange-base cursor-pointer"
            >
              <TbSearch size="22" /> Search Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
