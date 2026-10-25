import { useState } from 'preact/hooks';
import { highlightNodes } from '../Primitives/Text';
import styles from './TestBlock.module.css';
import { Test } from '../../Core/Types';

export interface TestBlockProps {
  test: Test;
}

export function TestBlock({ test }: TestBlockProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = test.questions[currentIndex];
  const isCorrect =
    submitted &&
    normalize(userAnswer) === normalize(question.answer);

  function normalize(s: string): string {
    return s.trim().toLowerCase().replace(/\s+/g, ' ');
  }

  function handleSubmit() {
    if (submitted) return;
    setSubmitted(true);
    if (normalize(userAnswer) === normalize(question.answer)) {
      setScore((s) => s + 1);
    }
  }

  function handleNext() {
    if (currentIndex + 1 >= test.questions.length) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setUserAnswer('');
      setSubmitted(false);
    }
  }

  if (finished) {
    const total = test.questions.length;
    const pct = Math.round((score / total) * 100);
    let verdict = 'Перечитайте урок и проверьте главный вопрос.';
    if (score >= test.scoring.excellent) verdict = 'Отлично!';
    else if (score >= test.scoring.good) verdict = 'Хорошо, повторите «Исключения».';
    return (
      <div class={styles.Result}>
        <h2 class={styles.ResultTitle}>Результат</h2>
        <p class={styles.Score}>
          {score} из {total} ({pct}%)
        </p>
        <p class={styles.Verdict}>{verdict}</p>
      </div>
    );
  }

  return (
    <div class={styles.Root}>
      <p class={styles.Counter}>
        Вопрос {currentIndex + 1} из {test.questions.length}
      </p>
      <p class={styles.Prompt}>{highlightNodes(question.prompt)}</p>
      <input
        class={styles.Input}
        type="text"
        value={userAnswer}
        onInput={(e) => {
          const target = e.currentTarget;
          if (target instanceof HTMLInputElement) {
            setUserAnswer(target.value);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit();
        }}
        disabled={submitted}
        placeholder="Ваш ответ"
      />
      {!submitted && (
        <button class={styles.Button} onClick={handleSubmit}>
          Проверить
        </button>
      )}
      {submitted && (
        <div class={styles.Feedback}>
          <p class={isCorrect ? styles.Correct : styles.Wrong}>
            {isCorrect ? '✓ Верно!' : '✗ Неверно'}
          </p>
          {!isCorrect && (
            <p class={styles.Answer}>
              Правильный ответ: <strong>{question.answer}</strong>
            </p>
          )}
          <p class={styles.Explanation}>{question.explanation}</p>
          <button class={styles.Button} onClick={handleNext}>
            {currentIndex + 1 >= test.questions.length ? 'Завершить' : 'Далее'}
          </button>
        </div>
      )}
    </div>
  );
}
