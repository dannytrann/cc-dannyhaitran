"use client";

interface FilterBarProps {
  categories: readonly string[];
  active: string;
  onChange: (category: string) => void;
}

export function FilterBar({ categories, active, onChange }: FilterBarProps) {
  return (
    <div role="tablist" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat}
          role="tab"
          aria-selected={active === cat}
          onClick={() => onChange(cat)}
          className={`border-2 border-shadow px-4 py-1.5 text-sm font-medium transition-all cursor-pointer ${
            active === cat
              ? "bg-accent text-surface shadow-brutal-sm"
              : "bg-surface text-text-muted hover:bg-lavender/10"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
