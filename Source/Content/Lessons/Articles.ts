import { Lesson } from '../../Core/Types';

export const articlesLesson: Lesson = {
  id: 'articles',
  title: 'Артикли',
  subtitle: 'a, an, the — когда использовать каждый',
  topic: 'articles',
  pages: [
    {
      nav: 'Введение',
      blocks: [
        {
          kind: 'Text',
          text: 'Знаете ли вы, как использовать a, an и the? Проверьте себя в интерактивных упражнениях и прочитайте объяснение.',
        },
        {
          kind: 'Text',
          text: 'Посмотрите на примеры, чтобы увидеть, как используются артикли.',
        },
        {
          kind: 'Examples',
          items: [
            "She's a doctor. — Она врач.",
            'I need an umbrella. — Мне нужен зонт.',
            'Have you heard the news? — Ты слышал новости?',
            "I don't like spiders. — Я не люблю пауков.",
          ],
        },
      ],
    },
    {
      nav: 'Профессии',
      blocks: [
        { kind: 'Subtitle', text: 'Профессии' },
        {
          kind: 'Text',
          text: 'Когда мы говорим, кем работает человек, обычно используем a/an.',
        },
        {
          kind: 'Examples',
          items: [
            "He's an architect. — Он архитектор.",
            "She's a scientist. — Она учёный.",
            'My grandmother was a teacher. — Моя бабушка была учительницей.',
          ],
        },
      ],
    },
    {
      nav: 'a и an',
      blocks: [
        { kind: 'Subtitle', text: 'Существительные в единственном числе' },
        {
          kind: 'Text',
          text: 'У исчисляемых существительных в единственном числе всегда есть артикль — a/an или the (либо другой определитель: my, your, this, that и т. п.).',
        },
        {
          kind: 'Text',
          text: 'a/an — неопределённый артикль. Он нужен, когда мы говорим о чём-то впервые или о чём-то, что является частью группы или типа.',
        },
        {
          kind: 'Examples',
          items: [
            'I saw a good film yesterday. — Вчера я посмотрел хороший фильм.',
            'Do you want a drink? — Хочешь напиток?',
          ],
        },
        {
          kind: 'Text',
          text: 'a ставится перед словом, которое начинается с согласного звука, an — перед словом, которое начинается с гласного звука. Так произносить легче.',
        },
        {
          kind: 'Examples',
          items: [
            'She has a university degree. — У неё есть университетский диплом.',
            'It took me an hour to get home. — Мне потребовался час, чтобы добраться домой.',
          ],
        },
      ],
    },
    {
      nav: 'the',
      blocks: [
        { kind: 'Subtitle', text: 'Определённый артикль the' },
        {
          kind: 'Text',
          text: 'the — определённый артикль. Он нужен, когда слушатель уже знает, о каком предмете речь: о нём говорили раньше или он существует в единственном экземпляре.',
        },
        {
          kind: 'Examples',
          items: [
            "I'm going to take the dog for a walk. — Я собираюсь выгулять собаку.",
            'Have you seen the car key? — Ты видел ключ от машины?',
            'They go to the school next to the bridge. — Они ходят в школу рядом с мостом.',
          ],
        },
      ],
    },
    {
      nav: 'В целом',
      blocks: [
        { kind: 'Subtitle', text: 'Вещи в целом' },
        {
          kind: 'Text',
          text: 'Когда мы говорим о вещах в целом, обычно используем существительное во множественном или неисчисляемом числе без артикля.',
        },
        {
          kind: 'Examples',
          items: [
            'Birds eat worms. — Птицы едят червей.',
            'Water freezes at 0°C. — Вода замерзает при 0 °C.',
            'Children need a lot of sleep. — Детям нужно много сна.',
          ],
        },
      ],
    },
  ],
};
