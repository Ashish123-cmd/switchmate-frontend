import { useState } from 'react';
import { generatePassword } from '@/features/auth/lib/generatePassword';
import { Button } from '@/shared/ui/Button';

interface PasswordSuggestionProps {
  onUse: (password: string) => void;
  disabled?: boolean;
}

export function PasswordSuggestion({ onUse, disabled = false }: PasswordSuggestionProps) {
  const [suggestion, setSuggestion] = useState(() => generatePassword());
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(suggestion);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-3 rounded border border-slate-200 bg-slate-50 p-4">
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-800">Suggested password</p>
        <p className="break-all rounded bg-white px-3 py-2 font-mono text-sm text-slate-900">{suggestion}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button disabled={disabled} onClick={() => onUse(suggestion)} type="button" variant="secondary">
          Use this password
        </Button>
        <Button
          disabled={disabled}
          onClick={() => {
            setSuggestion(generatePassword());
            setCopied(false);
          }}
          type="button"
          variant="ghost"
        >
          Regenerate
        </Button>
        <Button disabled={disabled} onClick={() => void copy()} type="button" variant="ghost">
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
    </div>
  );
}
