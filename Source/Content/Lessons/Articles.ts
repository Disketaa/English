import { Lesson } from '../../Core/Types';

export const articlesLesson: Lesson = {
  id: 'articles',
  title: 'Артикли',
  subtitle: 'a, an, the — когда какой нужен',
  topic: 'articles',
  pages: [
    {
      nav: 'Основы',
      blocks: [
        { kind: 'Subtitle', text: 'Что такое артикль?' },
        {
          kind: 'Text',
          text: 'Артикль — это маленькое слово перед существительным. В русском языке артиклей нет, а в английском они есть: и их очень много...',
        },
        {
          kind: 'Text',
          text: 'Всего существует три варианта: **a/an**, **the** и **ㅤ**. \n**ㅤ** — артикль писать не нужно',
        },
        {
          kind: 'Examples',
          items: [
            'I have **a** dog. — У меня есть собака.',
            'She eats **an** apple. — Она ест яблоко.',
            '**The** dog is big. — Эта собака большая.',
            'I like **ㅤ** dogs. — Я люблю собак.',
          ],
        },
        { kind: 'Subtitle', text: 'Главный вопрос' },
        {
          kind: 'Text',
          text: 'Чтобы выбрать артикль, задайте вопрос: \n"Собеседник знает, о каком предмете речь?"',
        },
        {
          kind: 'Text',
          text: '» Да, знает — ставим **the**. \n» Нет, это что-то новое — ставим **a/an**. \n» Говорим вообще про всех — **ㅤ**.',
        },
      ],
    },
    {
      nav: 'Артикль The',
      blocks: [
        { kind: 'Subtitle', text: 'The — «тот самый»' },
        {
          kind: 'Text',
          text: '**The** — это определённый артикль. \nОн значит: «тот самый, который мы оба знаем».',
        },
        { kind: 'Subtitle', text: 'Когда ставим **the**?' },
        {
          kind: 'Text',
          text: '❶ Когда мы уже говорили об этом. \nСначала мы называем предмет с **a/an**, а потом — с **the**.',
        },
        {
          kind: 'Examples',
          items: [
            'I saw **a** cat. **The** cat was black. — Я увидел кошку. Кошка была чёрной.',
          ],
        },
        {
          kind: 'Text',
          text: '❷ Ясно из ситуации. \nВы оба понимаете, о чём идёт речь.',
        },
        {
          kind: 'Examples',
          items: [
            'Please close **the** door. — Закрой, пожалуйста, дверь.',
            'Where is **the** car key? — Где ключ от машины?',
          ],
        },
        {
          kind: 'Text',
          text: '❸ Такой предмет только один во всём мире. \nНапример: солнце, луна, небо.',
        },
        {
          kind: 'Examples',
          items: [
            '**The** sun is hot. — Солнце горячее.',
            '**The** moon is bright tonight. — Луна сегодня яркая.',
          ],
        },
        {
          kind: 'Text',
          text: '**The** можно ставить и перед единственным, и перед множественным числом: **the book**, **the books**.',
        },
      ],
    },
    {
      nav: 'Артикль A/An',
      blocks: [
        { kind: 'Subtitle', text: 'A/An — «какой-то один»' },
        {
          kind: 'Text',
          text: '**A** и **an** — это неопределённый артикль. Он значит «какой-то».',
        },
        {
          kind: 'Text',
          text: 'Он используется для **одного** предмета, который можно посчитать.',
        },
        { kind: 'Subtitle', text: '**A** или **An**?' },
        {
          kind: 'Text',
          text: 'Всё зависит от **звука**, а не от буквы! \nПеред **согласным** звуком — **a**. \nПеред **гласным** звуком — **an**. \nТак проще говорить и язык не заплетается.',
        },
        {
          kind: 'Examples',
          items: [
            '**a** **b**ook — книга',
            '**a** **t**able — стол',
            '**an** **a**pple — яблоко',
            '**an** **u**mbrella — зонт',
          ],
        },
        {
          kind: 'Text',
          text: 'Обратите внимание: слушаем звук. \nЭто важно в двух случаях:',
        },
        {
          kind: 'Examples',
          items: [
            '**a** **u**niversity — университет (звук «u», согласный)',
            '**an** h**o**ur — час (буква «h» не произносится в этом слове)',
          ],
        },
        { kind: 'Subtitle', text: 'Когда ставим **a**/**an**' },
        {
          kind: 'Text',
          text: '❶ Первое упоминание. \nМы говорим о предмете впервые.',
        },
        {
          kind: 'Examples',
          items: ['I saw **a** good film yesterday. — Вчера я посмотрел хороший фильм.'],
        },
        {
          kind: 'Text',
          text: '❷ Профессия. \nКогда говорим, кто кем работает.',
        },
        {
          kind: 'Examples',
          items: ["He's **a** doctor. — Он врач.", "She's **an** architect. — Она архитектор."],
        },
        {
          kind: 'Text',
          text: '❸ Один из многих. \nНе важно какой именно.',
        },
        {
          kind: 'Examples',
          items: ['Do you want **a** drink? — Хочешь напиток?'],
        },
      ],
    },
    {
      nav: 'Нулевой артикль',
      blocks: [
        { kind: 'Subtitle', text: 'Когда артикля нет' },
        {
          kind: 'Text',
          text: 'Иногда артикль вовсе не нужен. \nЭто называется **нулевой артикль**. \nКогда мы говорим о вещах **в целом**, **обо всех сразу**.',
        },
        { kind: 'Subtitle', text: 'Два случая' },
        {
          kind: 'Text',
          text: '❶ Множественное число. \nНеконретный контекст.',
        },
        {
          kind: 'Examples',
          items: [
            '**ㅤ** Birds eat **ㅤ** worms. — Птицы едят червей.',
            'I like **ㅤ** dogs. — Я люблю собак.',
          ],
        },
        {
          kind: 'Text',
          text: '❷ Неисчесляемые. \nНапример: вода, молоко, любовь, музыка.',
        },
        {
          kind: 'Examples',
          items: [
            '**ㅤ** Water freezes at 0°C. — Вода замерзает при 0 °C.',
            '**ㅤ** Music makes me happy. — Музыка делает меня счастливым.',
          ],
        },
        { kind: 'Subtitle', text: 'Сравните' },
        {
          kind: 'Examples',
          items: [
            '**ㅤ** Children need sleep. — Детям нужен сон. (все дети вообще)',
            '**The** children are asleep. — Дети спят. (конкретные дети)',
          ],
        },
      ],
    },
    {
      nav: 'Исключения',
      blocks: [
        { kind: 'Subtitle', text: 'Слова без артикля' },
        {
          kind: 'Text',
          text: 'Есть слова, которые принято говорить **без артикля**. \n\nИх просто нужно запомнить:\n**Приёмы пищи**, \n**Языки**, \n**Виды спорта**, \n**Транспорт**.',
        },
        {
          kind: 'Examples',
          items: [
            '**Have** **ㅤ** breakfast. — Завтракать',
            'I speak **ㅤ** English. — Я говорю по-английски.',
            'She plays **ㅤ** tennis. — Она играет в теннис.',
            'By **ㅤ** train. — На поезде.',
          ],
        },
        { kind: 'Subtitle', text: 'Места: school, work, bed' },
        {
          kind: 'Text',
          text: 'Если мы идём туда **по назначению** (учиться, работать, спать) — артикля нет.',
        },
        {
          kind: 'Examples',
          items: [
            'I go to **ㅤ** school every day. — Я хожу в школу каждый день. (учиться)',
            'I went to **the** school to meet a teacher. — Я ходил в школу, чтобы встретиться с учителем. (конкретное здание)',
          ],
        },
        { kind: 'Subtitle', text: 'Слова, где всегда **the**:' },
        {
          kind: 'Text',
          text: '**Музыкальные инструменты**, \n**Океаны, моря и реки**, \n**Страны во множественном числе**, \n**Самый-самый**.',
        },
        {
          kind: 'Examples',
          items: [
            'Play **the** **piano**. — Играть на пианино',
            '**The** **Pacific** Ocean. — Тихий океан',
            '**The** **Netherlands** — Нидерланды',
            '**The** **best** day. — Самый лучший день',
          ],
        },
      ],
    },
    {
      nav: 'Как запомнить',
      blocks: [
        { kind: 'Subtitle', text: 'Простая схема' },
        {
          kind: 'Diagram',
          start: 'root',
          nodes: [
            { id: 'root', text: 'Исчисляемое?', kind: 'question' },
            { id: 'singular', text: 'В единственном числе?', kind: 'question' },
            { id: 'concrete', text: 'Конкретное?', kind: 'question' },
            { id: 'specific', text: 'Конкретное?', kind: 'question' },
            { id: 'rThe1', text: '**The**', kind: 'result' },
            { id: 'rA', text: '**A**/**An**', kind: 'result' },
            { id: 'rThe2', text: '**The**', kind: 'result' },
            { id: 'rNone', text: '**ㅤ**', kind: 'result' },
          ],
          edges: [
            { from: 'root', to: 'singular', label: 'Да' },
            { from: 'root', to: 'concrete', label: 'Нет' },
            { from: 'singular', to: 'specific', label: 'Да' },
            { from: 'singular', to: 'rThe2', label: 'Нет' },
            { from: 'specific', to: 'rThe1', label: 'Да' },
            { from: 'specific', to: 'rA', label: 'Нет' },
            { from: 'concrete', to: 'rThe2', label: 'Да' },
            { from: 'concrete', to: 'rNone', label: 'Нет' },
          ],
        },
        { kind: 'Subtitle', text: 'Короткая шпаргалка' },
        {
          kind: 'Examples',
          items: [
            '**a/an** — какой-то, один из многих',
            '**the** — тот самый, известный',
            'без артикля — все вообще, в целом',
          ],
        },
        { kind: 'Subtitle', text: 'Совет' },
        {
          kind: 'Text',
          text: 'Не бойтесь ошибаться. Даже если вы перепутаете артикль, вас всё равно поймут. Чем больше вы читаете и слушаете английский, тем лучше чувствуете, какой артикль нужен.',
        },
      ],
    },
    {
      nav: 'Заключение',
      blocks: [
        { kind: 'Subtitle', text: 'Что мы узнали' },
        {
          kind: 'Text',
          text: '**A/an** — один предмет, новый или «какой-то».\n**The** — конкретный предмет, который знают все,\n**ㅤ** — когда говорим о вещах в целом.',
        },
        {
          kind: 'Examples',
          items: [
            'I have **a** cat. — У меня есть кошка.',
            '**The** cat is very cute. — Эта кошка очень милая.',
            '**ㅤ** Cats are cute. — Кошки милые (все кошки вообще).',
          ],
        },
        {
          kind: 'Text',
          text: 'Теперь вы знаете главное. Переходите к упражнениям и тренируйтесь. У вас всё получится!',
        },
      ],
    },
  ],
};
