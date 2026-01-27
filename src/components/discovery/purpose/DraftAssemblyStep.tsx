/**
 * Draft Assembly Step Component (Step 5)
 * Generate and select from template-based drafts
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/common';
import type { PurposeDriver, TradeoffAnchor, SoFPDraft } from '@/types/financialPurpose';
import { generateDrafts, getTemplateName } from '@/services/purposeTemplateEngine';
import { SOFP_MAX_LENGTH } from '@/data/purposeTemplates';

interface DraftAssemblyStepProps {
  primaryDriver?: PurposeDriver;
  secondaryDriver?: PurposeDriver;
  tradeoffAnchors: TradeoffAnchor[];
  visionAnchors: string[];
  drafts: SoFPDraft[];
  selectedDraftId?: string;
  onDraftsChange: (drafts: SoFPDraft[], selectedId?: string) => void;
  onComplete: () => void;
  onBack: () => void;
  isAdvisorMode: boolean;
}

export function DraftAssemblyStep({
  primaryDriver,
  secondaryDriver,
  tradeoffAnchors,
  visionAnchors,
  drafts: existingDrafts,
  selectedDraftId,
  onDraftsChange,
  onComplete,
  onBack,
  isAdvisorMode,
}: DraftAssemblyStepProps): JSX.Element {
  // Generate drafts if none exist
  const [drafts, setDrafts] = useState<SoFPDraft[]>(() => {
    if (existingDrafts.length > 0) {
      return existingDrafts;
    }
    return generateDrafts({
      primaryDriver,
      secondaryDriver,
      tradeoffAnchors,
      visionAnchors,
    });
  });

  const [selected, setSelected] = useState<string | undefined>(selectedDraftId);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  // Update parent when drafts or selection changes
  useEffect(() => {
    onDraftsChange(drafts, selected);
  }, [drafts, selected, onDraftsChange]);

  const handleSelect = (draftId: string): void => {
    setSelected(draftId);
  };

  const handleStartEdit = (draft: SoFPDraft): void => {
    setEditingId(draft.id);
    setEditText(draft.text);
  };

  const handleSaveEdit = (): void => {
    if (!editingId) return;

    setDrafts((prev) =>
      prev.map((draft) =>
        draft.id === editingId
          ? { ...draft, text: editText, editedByUser: true }
          : draft
      )
    );
    setEditingId(null);
    setEditText('');
  };

  const handleCancelEdit = (): void => {
    setEditingId(null);
    setEditText('');
  };

  const handleRegenerate = (): void => {
    const newDrafts = generateDrafts({
      primaryDriver,
      secondaryDriver,
      tradeoffAnchors,
      visionAnchors,
    });
    setDrafts(newDrafts);
    setSelected(undefined);
  };

  const selectedDraft = drafts.find((d) => d.id === selected);
  const canContinue = !!selected;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Choose Your Statement
        </h2>
        <p className="text-gray-600">
          {isAdvisorMode
            ? "We've created drafts based on the client's inputs. Select the one that fits best."
            : "We've created some drafts based on your inputs. Select the one that feels right and edit if needed."}
        </p>
      </div>

      {/* Draft cards */}
      <div className="space-y-4">
        {drafts.map((draft) => {
          const isSelected = selected === draft.id;
          const isEditing = editingId === draft.id;
          const templateName = getTemplateName(draft.templateId);

          return (
            <div
              key={draft.id}
              className={`
                rounded-xl border-2 transition-all overflow-hidden
                ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'}
              `}
            >
              {/* Header */}
              <div
                className={`px-4 py-2 flex items-center justify-between ${
                  isSelected ? 'bg-primary/10' : 'bg-gray-50'
                }`}
              >
                <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-gray-600'}`}>
                  {templateName}
                  {draft.editedByUser && (
                    <span className="ml-2 text-xs text-gray-400">(edited)</span>
                  )}
                </span>
                {isSelected && !isEditing && (
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                {isEditing ? (
                  <div className="space-y-3">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                      rows={3}
                      maxLength={SOFP_MAX_LENGTH}
                    />
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs ${
                          editText.length > SOFP_MAX_LENGTH * 0.9
                            ? 'text-amber-600'
                            : 'text-gray-400'
                        }`}
                      >
                        {editText.length}/{SOFP_MAX_LENGTH} characters
                      </span>
                      <div className="flex gap-2">
                        <Button variant="secondary" size="sm" onClick={handleCancelEdit}>
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleSaveEdit}>
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleSelect(draft.id)}
                    className="w-full text-left"
                  >
                    <p className={`text-gray-700 ${isSelected ? 'font-medium' : ''}`}>
                      "{draft.text}"
                    </p>
                  </button>
                )}
              </div>

              {/* Actions */}
              {isSelected && !isEditing && (
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                  <button
                    onClick={() => handleStartEdit(draft)}
                    className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    Edit this statement
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Regenerate option */}
      <div className="text-center">
        <button
          onClick={handleRegenerate}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Generate new drafts
        </button>
      </div>

      {/* Selected preview */}
      {selectedDraft && (
        <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
          <p className="text-xs text-primary font-medium mb-2">Selected Statement:</p>
          <p className="text-gray-800 font-medium italic">
            "{selectedDraft.text}"
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onComplete} disabled={!canContinue}>
          Continue to Refinement
        </Button>
      </div>
    </div>
  );
}
