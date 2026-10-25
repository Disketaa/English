import { useState } from 'preact/hooks';
import { highlightNodes } from '../Primitives/Text';
import { Button } from './Button';
import styles from './TestBlock.module.css';
import { Test } from '../../Core/Types';

export interface TestBlockProps {
  test: Test;
  onComplete?: () => void;
  onFinish?: () => void;
}

function splitBlanks(prompt: string): string[] {
  return prompt.split('___');
}

function splitAnswers(answer: string): string[] {
  return answer.split('/').map((s) => s.trim());
}

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/[\s.,!?;:]+/g, '');
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

function isCloseEnough(user: string, expected: string): boolean {
  const nu = normalize(user);
  const ne = normalize(expected);
  if (nu === ne) return true;
  // Only allow fuzzy matching for longer answers (translations)
  if (ne.length < 5) return false;
  const maxDist = Math.max(1, Math.floor(ne.length * 0.1));
  return levenshtein(nu, ne) <= maxDist;
}

export function TestBlock({ test, onComplete, onFinish }: TestBlockProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [values, setValues] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);

  const question = test.questions[currentIndex];
  const parts = splitBlanks(question.prompt);
  const blanks = parts.length - 1;
  const expected = splitAnswers(question.answer);

  const allCorrect =
    submitted &&
    values.length === expected.length &&
    values.every((v, i) => isCloseEnough(v, expected[i] ?? ''));

  function handleSubmit() {
    if (submitted) return;
    setSubmitted(true);
    const correct =
      values.length === expected.length &&
      values.every((v, i) => isCloseEnough(v, expected[i] ?? ''));
    if (correct) setScore((s) => s + 1);
  }

  function handleNext() {
    if (currentIndex + 1 >= test.questions.length) {
      setFinished(true);
      if (onComplete) onComplete();
      if (onFinish) onFinish();
    } else {
      setCurrentIndex((i) => i + 1);
      setValues([]);
      setSubmitted(false);
      setRevealed(false);
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
    <div class={`${styles.Container} ${submitted ? (allCorrect ? styles.ContainerCorrect : styles.ContainerWrong) : ''}`}>
        <div class={styles.Result}>
        <h2 class={styles.ResultTitle}>Результат</h2>
        <p class={styles.Score}>
          {score} из {total} ({pct}%)
        </p>
        <p class={styles.Verdict}>{verdict}</p>
      </div>
      </div>
  );
}

  // Ensure values array has right length
  const vals = values.length === (blanks > 0 ? blanks : 1) ? values : Array.from({ length: blanks > 0 ? blanks : 1 }, (_, i) => values[i] ?? '');

  return (
    <div class={`${styles.Container} ${submitted ? (allCorrect ? styles.ContainerCorrect : styles.ContainerWrong) : ''}`}>
      <div class={styles.Root}>
        <div class={styles.Prompt}>
          {blanks > 0 ? (
            parts.map((part, i) => (
              <span key={i} class={styles.Part}>
                <span>{highlightNodes(part)}</span>
                {i < blanks && (
                  <input
                    class={`${styles.Blank} ${submitted ? (isCloseEnough(vals[i], expected[i] ?? '') ? styles.BlankCorrect : styles.BlankWrong) : ''}`}
                    type="text"
                    value={vals[i]}
                    maxLength={Math.max(3, (expected[i] ?? '').length + 2)}
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
            ))
        ) : (
          <>
            <span>{highlightNodes(question.prompt)}</span>
            <input
              class={`${styles.Blank} ${submitted ? (isCloseEnough(vals[0] ?? '', expected[0] ?? '') ? styles.BlankCorrect : styles.BlankWrong) : ''}`}
              type="text"
              value={vals[0] ?? ''}
              maxLength={Math.max(10, (expected[0] ?? '').length + 5)}
              onInput={(e) => {
                const target = e.currentTarget;
                if (target instanceof HTMLInputElement) {
                  setValue(0, target.value);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmit();
              }}
              disabled={submitted}
              placeholder="Переведите на английский"
              style={{ width: '100%' }}
            />
          </>
        )}
        </div>
        {!submitted && (
          <>
            <hr class={styles.Separator} />
            <div class={styles.ButtonWrap}>
              <Button variant="Primary" onClick={handleSubmit} disabled={vals.some((v) => v.trim() === '')}>
                Проверить
              </Button>
            </div>
          </>
        )}
        {submitted && (
          <div class={styles.Feedback}>
            <hr class={styles.Separator} />
            <button
              class={styles.AnswerBox}
              type="button"
              onClick={() => setRevealed((v) => !v)}
            >
              {!allCorrect && (
                <span class={styles.Answer}>
                  Правильный ответ: <strong>{question.answer}</strong>
                </span>
              )}
              <span class={styles.ExplanationToggle}>
                {revealed
                  ? highlightNodes(question.explanation)
                  : 'Нажмите, для пояснения'}
              </span>
            </button>
            <div class={styles.ButtonWrap}>
              <Button variant="Primary" onClick={handleNext}>
                {currentIndex + 1 >= test.questions.length ? 'Завершить' : 'Далее'}
              </Button>
            </div>
          </div>
        )}
      </div>
      <p class={styles.ProgressText}>{currentIndex + 1} / {test.questions.length}</p>
    </div>
  );
}
