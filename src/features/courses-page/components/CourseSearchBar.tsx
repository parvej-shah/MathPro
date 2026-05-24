import React, { useEffect, useRef, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { HiSparkles } from "react-icons/hi2";

interface CourseSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function CourseSearchBar({
  value,
  onChange,
  placeholder = "কোর্স খুঁজুন...",
}: CourseSearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Keyboard shortcut: Press "/" to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Glow effect on focus */}
      <div 
        className={`absolute -inset-1 bg-gradient-to-r from-purple via-pink-500 to-purple rounded-2xl blur-lg transition-opacity duration-500 ${
          isFocused ? 'opacity-30' : 'opacity-0'
        }`}
      />
      
      <div className="relative group">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/[0.08] to-white/[0.04] dark:from-white/[0.06] dark:to-white/[0.02] rounded-2xl" />
        
        {/* Border */}
        <div 
          className={`absolute inset-0 rounded-2xl border transition-all duration-300 ${
            isFocused 
              ? 'border-purple/50' 
              : 'border-gray-200/50 dark:border-white/10 group-hover:border-gray-300/50 dark:group-hover:border-white/20'
          }`}
        />

        {/* Search Icon */}
        <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
          <div className={`relative transition-colors duration-300 ${isFocused ? 'text-purple' : 'text-muted-foreground'}`}>
            <BsSearch className="text-xl" />
            {isFocused && (
              <HiSparkles className="absolute -top-1 -right-1 text-xs text-purple animate-pulse" />
            )}
          </div>
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="relative w-full py-5 pl-14 pr-28 text-base md:text-lg 
            bg-transparent
            rounded-2xl 
            text-heading dark:text-white 
            placeholder:text-muted-foreground dark:placeholder:text-muted-foreground
            focus:outline-none 
            transition-all duration-300"
        />

        {/* Keyboard Shortcut Hint */}
        <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
          <kbd className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-all duration-300 ${
            isFocused 
              ? 'bg-purple/10 border-purple/30 text-purple' 
              : 'bg-muted dark:bg-white/5 border-border dark:border-white/10 text-muted-foreground'
          }`}>
            /
          </kbd>
          <span className={`text-xs transition-colors duration-300 ${
            isFocused ? 'text-purple' : 'text-muted-foreground'
          }`}>
            টাইপ করুন
          </span>
        </div>
      </div>

      {/* Search Results Preview */}
      {value && (
        <div className="absolute top-full left-0 right-0 mt-3 z-50">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple/20 to-pink-500/20 rounded-xl blur-lg" />
            <div className="relative p-4 bg-background rounded-xl border border-gray-200/50 dark:border-white/10 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple/10 flex items-center justify-center">
                  <BsSearch className="text-purple text-sm" />
                </div>
                <div>
                  <p className="text-sm text-heading dark:text-white font-medium">
                    &quot;{value}&quot; খুঁজছে...
                  </p>
                  <p className="text-xs text-muted-foreground">Enter চাপুন সার্চ করতে</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
