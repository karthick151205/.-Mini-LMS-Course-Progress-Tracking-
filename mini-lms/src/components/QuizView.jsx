import { useState } from 'react';

function QuizView({ quiz, lessonId, courseId, isCompleted, markComplete, isAdmin }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false); // 💡 New: Admin preview toggle

  const isCorrect = selected === quiz.correct;

  const handleSubmit = () => {
    if (selected === null || isAdmin) return; // 🛡️ Prevent admin from submitting
    setSubmitted(true);
    if (isCorrect) markComplete(lessonId, courseId);
  };

  const handleRetry = () => {
    setSelected(null);
    setSubmitted(false);
  };

  const getOptionStyle = (index) => {
    // 💡 Admin Preview Logic
    if (isAdmin && showAnswer) {
      return index === quiz.correct 
        ? 'border-emerald-400 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-100'
        : 'border-stone-100 text-stone-300 opacity-50';
    }

    if (!submitted) {
      return selected === index
        ? 'border-amber-400 bg-amber-50 text-amber-800 ring-2 ring-amber-100 shadow-sm'
        : 'border-stone-200 text-stone-600 hover:border-amber-300 hover:bg-amber-50/50';
    }
    
    if (index === quiz.correct)
      return 'border-emerald-400 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-100';
    if (index === selected && !isCorrect)
      return 'border-red-400 bg-red-50 text-red-700 ring-2 ring-red-100';
    
    return 'border-stone-100 text-stone-300 cursor-default';
  };

  return (
    <div className="space-y-6">
      {/* 🛡️ Admin Header Tool */}
      {isAdmin && (
        <div className="flex items-center justify-between bg-stone-900 p-3 rounded-xl mb-4">
          <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Admin Preview</span>
          <button 
            onClick={() => setShowAnswer(!showAnswer)}
            className="text-[10px] bg-white text-stone-900 px-3 py-1 rounded-lg font-bold hover:bg-amber-500 transition-all"
          >
            {showAnswer ? 'HIDE ANSWER' : 'SHOW ANSWER'}
          </button>
        </div>
      )}

      {/* Question */}
      <div className="space-y-2">
        <p className="text-stone-500 text-[10px] font-black uppercase tracking-widest">Question</p>
        <p className="text-stone-800 font-bold text-lg leading-tight">
          {quiz.question}
        </p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {quiz.options.map((option, index) => (
          <div
            key={index}
            onClick={() => !submitted && !isAdmin && setSelected(index)}
            className={`flex items-center gap-3 px-5 py-4 rounded-2xl border transition-all duration-200 ${getOptionStyle(index)} 
              ${!submitted && !isAdmin ? 'cursor-pointer active:scale-[0.98]' : 'cursor-default'}`}
          >
            {/* Custom Checkbox UI */}
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
              ${(selected === index || (isAdmin && showAnswer && index === quiz.correct)) 
                ? 'bg-amber-500 border-amber-500' 
                : 'border-stone-300'}`}
            >
               {(selected === index || (isAdmin && showAnswer && index === quiz.correct)) && (
                 <div className="w-2 h-2 bg-white rounded-full" />
               )}
            </div>
            
            <span className="text-sm font-semibold">{option}</span>

            {/* Icons */}
            {(submitted || (isAdmin && showAnswer)) && index === quiz.correct && (
              <span className="ml-auto bg-emerald-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold">✓</span>
            )}
          </div>
        ))}
      </div>

      {/* --- Action Area --- */}
      <div className="pt-4">
        {isAdmin ? (
          <p className="text-stone-400 text-xs italic font-medium">Note: Admins cannot submit quiz answers.</p>
        ) : (
          <>
            {!submitted ? (
              <button
                onClick={handleSubmit}
                disabled={selected === null}
                className="w-full sm:w-auto bg-stone-900 hover:bg-amber-500 hover:text-stone-900 disabled:opacity-20 text-white text-xs font-black uppercase tracking-widest px-8 py-4 rounded-2xl transition-all shadow-lg active:scale-95"
              >
                Submit Answer
              </button>
            ) : (
              <div className="space-y-4">
                <div className={`p-4 rounded-2xl border flex items-center gap-3 ${isCorrect ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                  <span className="text-xl">{isCorrect ? '🎉' : '❌'}</span>
                  <p className="text-sm font-bold">{isCorrect ? 'Great job! Lesson completed.' : 'That wasn\'t quite right.'}</p>
                </div>
                {!isCorrect && (
                  <button onClick={handleRetry} className="text-stone-400 hover:text-stone-900 text-xs font-bold underline">Try Again</button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Already Passed (Student Only) */}
      {isCompleted && !submitted && !isAdmin && (
        <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl text-center">
          <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">✓ You've already passed this quiz</p>
        </div>
      )}
    </div>
  );
}

export default QuizView;