import {
  Sparkles,
  MapPinned,
  Compass,
  Mountain,
} from "lucide-react";

const suggestions = [
  {
    title: "Create New Trip",
    Icon: Sparkles,
  },
  {
    title: "Inspire Me Where To Go",
    Icon: Compass,
  },
  {
    title: "Discover Hidden Gems",
    Icon: MapPinned,
  },
  {
    title: "Adventure Destinations",
    Icon: Mountain,
  },
];

function EmptyState({onSelectOption}:any) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-4">

      <div className="text-center">
        <h2 className="text-3xl font-bold">
          Start Planning New{" "}
          <span className="text-primary">Trip</span> With AI
        </h2>

        <p className="text-gray-500 mt-2">
          Discover amazing destinations with AI
        </p>
      </div>

      <div className="flex flex-col gap-4 mt-10 w-full max-w-xl">

        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            onClick={() => onSelectOption(suggestion.title)}
            className="
              flex items-center gap-3
              border rounded-xl
              p-2 cursor-pointer
              hover:border-primary
              hover:text-primary
              transition-all
            "
          >
            <div className="w-11 h-11 rounded-lg  flex items-center justify-center">
              <suggestion.Icon className="h-5 w-5 text-primary" />
            </div>

            <h2 className="font-semibold text-lg">
              {suggestion.title}
            </h2>
          </div>
        ))}

      </div>
    </div>
  );
}

export default EmptyState;