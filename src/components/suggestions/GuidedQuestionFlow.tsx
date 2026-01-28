/**
 * Guided Question Flow Component
 * Step-by-step question flow for a domain
 */

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SuggestionDomain, GuidedQuestion } from '@/types/suggestions';
import { SUGGESTION_DOMAIN_LABELS } from '@/types/suggestions';
import { useProfileStore } from '@/stores/profileStore';
import { useSuggestionsStore } from '@/stores/suggestionsStore';
import { getApplicableQuestions, calculateDomainProgress } from '@/services/suggestionsFilter';
import { generateSuggestionsForDomain } from '@/services/suggestionsEngine';
import { getQuestionsByDomain } from '@/data/suggestions';
import { QuestionCard } from './QuestionCard';
import { SuggestionsList } from './SuggestionsList';
import { Button } from '@/components/common';
import { ChevronLeft, ChevronRight, CheckCircle2, ListChecks, Sparkles } from 'lucide-react';

interface GuidedQuestionFlowProps {
  /** The domain being explored */
  domain: SuggestionDomain;
  /** Optional class name */
  className?: string;
}

export function GuidedQuestionFlow({
  domain,
  className = '',
}: GuidedQuestionFlowProps): JSX.Element {
  const navigate = useNavigate();
  const profile = useProfileStore((state) => state.currentProfile);
  const domainState = useSuggestionsStore((state) => state.domainStates[domain]);
  const saveAnswer = useSuggestionsStore((state) => state.saveAnswer);
  const startDomain = useSuggestionsStore((state) => state.startDomain);
  const completeDomain = useSuggestionsStore((state) => state.completeDomain);
  const setSuggestions = useSuggestionsStore((state) => state.setSuggestions);
  const acceptSuggestion = useSuggestionsStore((state) => state.acceptSuggestion);
  const rejectSuggestion = useSuggestionsStore((state) => state.rejectSuggestion);
  const modifySuggestion = useSuggestionsStore((state) => state.modifySuggestion);

  // Track whether we're viewing suggestions after generating
  const [showingSuggestions, setShowingSuggestions] = useState(
    domainState.status === 'completed' && domainState.suggestions.length > 0
  );

  // Get all questions for this domain
  const allQuestions = useMemo(() => getQuestionsByDomain(domain), [domain]);

  // Get applicable questions based on profile and previous answers
  const applicableQuestions = useMemo(() => {
    return getApplicableQuestions(allQuestions, profile, domainState.answers);
  }, [allQuestions, profile, domainState.answers]);

  // Current question index
  const [currentIndex, setCurrentIndex] = useState(() => {
    // Find first unanswered question
    const answeredIds = new Set(domainState.answers.map((a) => a.questionId));
    const firstUnansweredIndex = applicableQuestions.findIndex((q) => !answeredIds.has(q.id));
    return firstUnansweredIndex >= 0 ? firstUnansweredIndex : 0;
  });

  const currentQuestion = applicableQuestions[currentIndex];
  const currentAnswer = domainState.answers.find((a) => a.questionId === currentQuestion?.id);

  // Calculate progress
  const progress = useMemo(() => {
    return calculateDomainProgress(allQuestions, profile, domainState.answers);
  }, [allQuestions, profile, domainState.answers]);

  const allQuestionsAnswered = progress.answered === progress.total && progress.total > 0;
  const hasSuggestions = domainState.suggestions.length > 0;
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === applicableQuestions.length - 1;

  // Handle answer submission
  const handleAnswer = (value: string | number | boolean | string[], notes?: string, source?: string) => {
    // Start domain if not started
    if (domainState.status === 'not_started') {
      startDomain(domain);
    }

    // Save the answer
    saveAnswer({
      questionId: currentQuestion.id,
      domain,
      value,
      notes,
      analysisSource: source,
    });

    // Move to next question if not last
    if (!isLastQuestion) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Navigation
  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleGenerateSuggestions = () => {
    // Generate suggestions using the engine
    const generatedSuggestions = generateSuggestionsForDomain(
      domain,
      domainState.answers,
      profile
    );

    // Store the generated suggestions
    setSuggestions(domain, generatedSuggestions);

    // Mark domain as completed
    completeDomain(domain);

    // Show suggestions view
    setShowingSuggestions(true);
  };

  const handleComplete = () => {
    navigate('/consumer/dashboard/suggestions');
  };

  const handleViewSuggestions = () => {
    setShowingSuggestions(true);
  };

  const handleBackToQuestions = () => {
    setShowingSuggestions(false);
  };

  const handleAcceptSuggestion = (suggestionId: string, notes?: string) => {
    acceptSuggestion(suggestionId, notes);
  };

  const handleRejectSuggestion = (suggestionId: string) => {
    rejectSuggestion(suggestionId);
  };

  const handleModifySuggestion = (suggestionId: string, title: string, description: string) => {
    modifySuggestion(suggestionId, title, description);
  };

  // Empty state if no questions
  if (applicableQuestions.length === 0) {
    return (
      <div className={`rounded-xl border border-gray-200 bg-white p-8 text-center ${className}`}>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <ListChecks className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">No Questions Applicable</h3>
        <p className="mt-2 text-gray-500">
          Based on your profile, there are no questions in this domain that apply to your situation.
        </p>
        <Button onClick={() => navigate('/consumer/dashboard/suggestions')} className="mt-6">
          Return to Suggestions
        </Button>
      </div>
    );
  }

  // Show suggestions view after generating
  if (showingSuggestions) {
    return (
      <div className={className}>
        {/* Header with back button */}
        <div className="mb-6 flex items-center justify-between">
          <Button variant="outline" onClick={handleBackToQuestions} className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Questions
          </Button>
          <Button onClick={handleComplete} className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Done - Return to Overview
          </Button>
        </div>

        {/* Suggestions list */}
        <SuggestionsList
          suggestions={domainState.suggestions}
          domain={domain}
          onAccept={handleAcceptSuggestion}
          onReject={handleRejectSuggestion}
          onModify={handleModifySuggestion}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Progress header */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">{SUGGESTION_DOMAIN_LABELS[domain]}</h2>
            <p className="text-sm text-gray-500">
              Question {currentIndex + 1} of {applicableQuestions.length}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold text-blue-600">{progress.percentage}%</div>
            <div className="text-xs text-gray-500">Complete</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-blue-500 transition-all"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>

        {/* Question dots */}
        <div className="mt-3 flex flex-wrap gap-1">
          {applicableQuestions.map((q, index) => {
            const isAnswered = domainState.answers.some((a) => a.questionId === q.id);
            const isCurrent = index === currentIndex;

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(index)}
                className={`
                  h-2 w-2 rounded-full transition-all
                  ${isCurrent
                    ? 'w-4 bg-blue-500'
                    : isAnswered
                    ? 'bg-green-500'
                    : 'bg-gray-200 hover:bg-gray-300'
                  }
                `}
                title={`Question ${index + 1}: ${q.userQuestion.slice(0, 50)}...`}
              />
            );
          })}
        </div>
      </div>

      {/* Current question */}
      {currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          currentAnswer={currentAnswer}
          onAnswer={handleAnswer}
        />
      )}

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={isFirstQuestion}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="flex gap-3">
          {hasSuggestions ? (
            // Suggestions already generated - show view/complete options
            <>
              <Button variant="outline" onClick={handleViewSuggestions}>
                View Suggestions
              </Button>
              <Button onClick={handleComplete} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Return to Overview
              </Button>
            </>
          ) : allQuestionsAnswered ? (
            // All questions answered but no suggestions yet - show generate button
            <Button
              onClick={handleGenerateSuggestions}
              className="flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Generate Suggestions
            </Button>
          ) : isLastQuestion ? (
            // On last question - show generate button (disabled until answered)
            <Button
              onClick={handleGenerateSuggestions}
              disabled={!currentAnswer}
              className="flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Finish & Generate Suggestions
            </Button>
          ) : (
            // In middle of questions - show next button
            <Button
              onClick={handleNext}
              disabled={!currentAnswer}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Answered questions summary */}
      {domainState.answers.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-3 text-sm font-medium text-gray-700">Your Answers</h3>
          <div className="space-y-2">
            {applicableQuestions.map((q, index) => {
              const answer = domainState.answers.find((a) => a.questionId === q.id);
              if (!answer) return null;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(index)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-left hover:bg-gray-100"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {index + 1}. {q.userQuestion}
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        Answer: <span className="font-medium">{formatAnswer(answer.value, q)}</span>
                      </p>
                    </div>
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/** Format an answer value for display */
function formatAnswer(value: string | number | boolean | string[], question: GuidedQuestion): string {
  if (question.inputType === 'select' && question.options) {
    const option = question.options.find((o) => o.value === value);
    return option?.label || String(value);
  }

  if (value === 'yes') return 'Yes';
  if (value === 'no') return 'No';
  if (value === 'na') return 'Not Sure';

  if (Array.isArray(value)) return value.join(', ');

  return String(value);
}
