import { Brush, MousePointer2, Square, type LucideIcon } from "lucide-react";
import { useState } from "react";
import type { Tool } from "../model/types";

type ToolSelectorProps = {
  currentTool: Tool;
  onToolChange: (tool: Tool) => void;
};

const tools: { tool: Tool; icon: LucideIcon }[] = [
  { tool: "cursor", icon: MousePointer2 },
  { tool: "rectangle", icon: Square },
  { tool: "brush", icon: Brush },
];

function ToolSelector({ currentTool, onToolChange }: ToolSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {isOpen && (
        <div className="absolute bottom-full mb-2 flex flex-col items-center rounded-xl overflow-hidden bg-elevated text-text">
          {tools.map(
            ({ tool, icon: Icon }) =>
              tool !== currentTool && (
                <button
                  key={tool}
                  className="cursor-pointer p-3 transition-colors duration-300 hover:bg-surface"
                  onClick={() => {
                    onToolChange(tool);
                    setIsOpen(false);
                  }}
                >
                  <Icon />
                </button>
              ),
          )}
        </div>
      )}
      <button
        className="p-3 rounded-xl bg-surface border border-border text-text cursor-pointer"
        onClick={() => setIsOpen((open) => !open)}
      >
        {(() => {
          const Icon = tools.find((item) => item.tool === currentTool)!.icon;
          return <Icon />;
        })()}
      </button>
    </div>
  );
}

export default ToolSelector;
