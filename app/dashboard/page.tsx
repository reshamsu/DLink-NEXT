export default function Dashboard() {
  return (
    <div className="bg-gray-100 text-gray-700">
      <div className="max-w-6xl mx-auto lg:ml-80 h-screen pt-24 lg:pt-16 pb-10 px-6 md:px-10 lg:px-0 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h2 className="playfair text-3xl font-bold text-teal-600">
            Dashboard <span className="text-[#f2836f]">Analytics</span>
          </h2>
          <label className="text-base font-bold">
            Find all your website info and statuses here.
          </label>
        </div>
      </div>
    </div>
  );
}
