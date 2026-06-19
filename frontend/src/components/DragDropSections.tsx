import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye } from 'lucide-react';

interface DragDropSectionsProps {
  sections: string[];
  onChange: (newOrder: string[]) => void;
}

export const DragDropSections: React.FC<DragDropSectionsProps> = ({ sections, onChange }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.indexOf(active.id as string);
      const newIndex = sections.indexOf(over.id as string);
      onChange(arrayMove(sections, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center px-1 mb-1">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Arrange Sections</label>
        <span className="text-[10px] text-gray-500 font-semibold font-mono">Drag handle to reorder</span>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {sections.map((id) => (
              <SortableItem key={id} id={id} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

interface SortableItemProps {
  id: string;
}

const SortableItem: React.FC<SortableItemProps> = ({ id }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-3 rounded-lg border border-gray-800 bg-gray-950/40 select-none ${
        isDragging ? 'border-amber-500 bg-gray-900/60 shadow-xl' : 'hover:border-gray-700'
      }`}
    >
      <div className="flex items-center space-x-3">
        <button
          type="button"
          className="text-gray-500 hover:text-gray-300 cursor-grab active:cursor-grabbing p-1 rounded"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={16} />
        </button>
        <span className="text-xs font-bold text-gray-200 capitalize">{id} Section</span>
      </div>

      <span className="text-[10px] text-gray-500 flex items-center font-mono font-semibold">
        <Eye size={12} className="mr-1" /> ACTIVE
      </span>
    </div>
  );
};
