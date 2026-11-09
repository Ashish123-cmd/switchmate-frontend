import { useState, type ReactNode } from 'react';
import { Button } from '@/shared/ui/Button';

interface IdentifiedItem {
  id: string;
}

interface EditorProps<T> {
  item: T;
  onSave: (item: T) => void;
  onCancel: () => void;
}

interface EditableListProps<T extends IdentifiedItem> {
  items: T[];
  onChange: (items: T[]) => void;
  createItem: () => T;
  getItemLabel: (item: T) => string;
  itemTypeLabel: string;
  renderEditor: (props: EditorProps<T>) => ReactNode;
}

export function EditableList<T extends IdentifiedItem>({
  items,
  onChange,
  createItem,
  getItemLabel,
  itemTypeLabel,
  renderEditor,
}: EditableListProps<T>) {
  const [editor, setEditor] = useState<{ item: T; isNew: boolean } | null>(null);

  function saveItem(item: T) {
    if (editor?.isNew) {
      onChange([...items, item]);
    } else {
      onChange(items.map((currentItem) => (currentItem.id === item.id ? item : currentItem)));
    }
    setEditor(null);
  }

  function removeItem(itemId: string) {
    onChange(items.filter((item) => item.id !== itemId));
  }

  return (
    <div className="space-y-4">
      {items.length > 0 ? (
        <ul className="divide-y divide-slate-200 rounded border border-slate-200">
          {items.map((item) => (
            <li
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
              key={item.id}
            >
              <span className="text-sm font-medium text-slate-800">{getItemLabel(item)}</span>
              <div className="flex items-center gap-1">
                <Button
                  onClick={() => setEditor({ item, isNew: false })}
                  type="button"
                  variant="ghost"
                >
                  Edit
                </Button>
                <Button
                  aria-label={`Remove ${itemTypeLabel}: ${getItemLabel(item)}`}
                  onClick={() => removeItem(item.id)}
                  type="button"
                  variant="ghost"
                >
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500">No {itemTypeLabel.toLocaleLowerCase()} added yet.</p>
      )}
      <Button
        onClick={() => setEditor({ item: createItem(), isNew: true })}
        type="button"
        variant="secondary"
      >
        Add {itemTypeLabel}
      </Button>
      {editor &&
        renderEditor({
          item: editor.item,
          onSave: saveItem,
          onCancel: () => setEditor(null),
        })}
    </div>
  );
}
