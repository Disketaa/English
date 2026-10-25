import { useState } from 'preact/hooks';
import { highlightNodes } from '../Primitives/Text';
import styles from './TestBlock.module.css';
import { Test } from '../../Core/Types';

export interface TestBlockProps {
  test: Test;
}

function splitBlanks(prompt: string): string[] {
  return prompt.split('___');
}

function splitAnswers(answer: string): string[] {
  return answer.split('/').map((s) => s.trim());
}

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function TestBlock({ test }: TestBlockProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [values, setValues] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = test.questions[currentIndex];
  const parts = splitBlanks(question.prompt);
  const blanks = parts.length - 1;
  const expected = splitAnswers(question.answer);

  // Initialize values when question changes
  if (values.length !== blanks && !submitted) {
    // reset
  }

  const allCorrect =
    submitted &&
    values.length === expected.length &&
    values.every((v, i) => normalize(v) === normalize(expected[i] ?? ''));

  function handleSubmit() {
    if (submitted) return;
    setSubmitted(true);
    const correct =
      values.length === expected.length &&
      values.every((v, i) => normalize(v) === normalize(expected[i] ?? ''));
    if (correct) setScore((s) => s + 1);
  }

  function handleNext() {
    if (currentIndex + 1 >= test.questions.length) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setValues([]);
      setSubmitted(false);
    }
  }

  function setValue(i: number, v: string) {
    setValues((prev) => {
      const next = [...prev];
      while (next.length <= i) next.push('');
      next[i] = v;
      return next;
    });
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

  // Ensure values array has right length
  const vals = values.length === blanks ? values : Array.from({ length: blanks }, (_, i) => values[i] ?? '');

  return (
    <div class={styles.Root}>
      <p class={styles.Counter}>
        Вопрос {currentIndex + 1} из {test.questions.length}
      </p>
      <div class={styles.Prompt}>
        {parts.map((part, i) => (
          <span key={i} class={styles.Part}>
            <span>{highlightNodes(part)}</span>
            {i < blanks && (
              <input
                class={`${styles.Blank} ${submitted ? (normalize(vals[i]) === normalize(expected[i] ?? '') ? styles.BlankCorrect : styles.BlankWrong) : ''}`}
                type="text"
                value={vals[i]}
                onInput={(e) => {
                  const target = e.currentTarget;
                  if (target instanceof HTMLInputElement) {
                    setValue(i, target.value);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSubmit();
                }}
                disabled={submitted}
              />
            )}
          </span>
        ))}
      </div>
      {!submitted && (
        <button class={styles.Button} onClick={handleSubmit}>
          Проверить
        </button>
      )}
      {submitted && (
        <div class={styles.Feedback}>
          <p class={allCorrect ? styles.Correct : styles.Wrong}>
            {allCorrect ? '✓ Верно!' : '✗ Неверно'}
          </p>
          {!allCorrect && (
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
