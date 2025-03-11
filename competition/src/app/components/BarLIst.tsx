export default function BarList() {
  const items = [
    {
      id: 1,
      label:
        "Fifaninanana iray karakarain'ny EMIFI hoan'ny hira fanevan'ny sekoly.",
    },
    {
      id: 2,
      label:
        "Rehefa mampakatra rakitra ianao dia hahazo ny laharana, dia tehirizo tsara azafady ilay laharanao.",
    },
    {
      id: 3,
      label:
        "Ny mpandresy dia hambara amin'ny alalan'ilay laharany ao amin'ny pejin'ny EMIFI.",
    },
  ];

  return (
    <div className="flex flex-col  items-start relative">
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`flex items-start  space-x-4 opacity-0 animate-fade-in`}
          style={{ animationDelay: `${index * 500}ms` }}
        >
          <div className="flex flex-col items-center">
            <span className="w-3 lg:w-6 md:w-4 h-3 lg:h-6 md:h-4 bg-blue-500 rounded-full"></span>

            {index !== items.length - 1 && (
              <div className="w-1 lg:w-2 md:w-1 bg-white h-10 md:h-20"></div>
            )}
          </div>

          <span className="text-black text-sm font-bold lg:text-2xl md:text-xl leading-4 md:leading-7">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
