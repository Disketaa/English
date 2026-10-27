import { Lesson, Test } from '../../Core/Types';

export const articlesTest: Test = {
  title: 'Тест по теме «Артикли»',
  questions: [
    {
      prompt: 'She eats ___ apple every morning.',
      answer: 'an',
      options: ['a', 'an', 'the', '.'],
      explanation: 'Слово _apple_ начинается с гласного звука, поэтому **an**, вместо **a**.',
      type: 'choice',
    },
    {
      prompt: 'I have ___ dog. ___ dog is big.',
      answer: 'a, the',
      options: ['a', 'an', 'the', '.'],
      explanation:
        'Собака упоминается впервые, поэтому **a**. Во втором предложении это уже известная собака, поэтому **the**.',
      type: 'choice',
    },
    {
      prompt: 'He is ___ doctor.',
      answer: 'a',
      options: ['a', 'an', 'the', '.'],
      explanation: 'Профессия называется с **a**/**an**.',
      type: 'choice',
    },
    {
      prompt: 'Please close ___ door. **(конкретную)**',
      answer: 'the',
      options: ['a', 'an', 'the', '.'],
      explanation: 'Из ситуации ясно, о какой двери речь.',
      type: 'choice',
    },
    {
      prompt: '___ sun is hot.',
      answer: 'The',
      options: ['The', 'A', 'An', '.'],
      explanation: 'Солнце одно на весь мир.',
      type: 'choice',
    },
    {
      prompt: 'I like ___ dogs. **(в целом)**',
      answer: '—',
      options: ['the', 'a', 'an', '.'],
      explanation: 'Говорим о собаках вообще, во множественном числе. Нужен нулевой артикль.',
      type: 'choice',
    },
    {
      prompt: '___ water freezes at 0°C.',
      answer: '—',
      options: ['the', 'a', 'an', '.'],
      explanation:
        '**Water** **неисчисляемое**, и речь о воде **в целом**. Нужен **нулевой артикль**.',
      type: 'choice',
    },
    {
      prompt: 'It takes me ___ hour to get home.',
      answer: 'an',
      options: ['a', 'an', 'the', '.'],
      explanation:
        'Буква **h** в **hour** не произносится, поэтому слово начинается с гласного звука.',
      type: 'choice',
    },
    {
      prompt: 'He studies at ___ university.',
      answer: 'a',
      options: ['a', 'an', 'the', '.'],
      explanation:
        '**University** начинается со звука **u**, это согласный звук. Здесь важен звук, а не буква.',
      type: 'choice',
    },
    {
      prompt: "Let's have ___ breakfast.",
      answer: '—',
      options: ['the', 'a', 'an', '.'],
      explanation: 'Приёмы пищи употребляются **без артикля**.',
      type: 'choice',
    },
    {
      prompt: 'I speak ___ English.',
      answer: '—',
      options: ['the', 'a', 'an', '.'],
      explanation: 'Языки употребляются **без артикля**.',
      type: 'choice',
    },
    {
      prompt: 'She plays ___ tennis.',
      answer: '—',
      options: ['the', 'a', 'an', '.'],
      explanation: 'Виды спорта употребляются **без артикля**.',
      type: 'choice',
    },
    {
      prompt: 'He plays ___ piano.',
      answer: 'the',
      options: ['a', 'an', 'the', '.'],
      explanation: 'Музыкальные инструменты употребляются с **the**.',
      type: 'choice',
    },
    {
      prompt: 'We travel by ___ train.',
      answer: '—',
      options: ['the', 'a', 'an', '.'],
      explanation: 'Фраза **by + транспорт** пишется **без артикля**.',
      type: 'choice',
    },
    {
      prompt: 'I go to ___ school every day. **(учиться)**',
      answer: '—',
      options: ['the', 'a', 'an', '.'],
      explanation: 'Идём в школу **по назначению**, то есть учиться. **Артикля нет**.',
      type: 'choice',
    },
    {
      prompt: 'I went to ___ school to meet a teacher.',
      answer: 'the',
      options: ['a', 'an', 'the', '.'],
      explanation:
        'Здесь **конкретное** здание школы, поэтому **the school**. Учитель **«какой-то»**, из контекста непонятно какой, поэтому **a teacher**.',
      type: 'choice',
    },
    {
      prompt: '___ Pacific Ocean is huge.',
      answer: 'The',
      options: ['The', 'A', 'An', '.'],
      explanation: 'Океаны, моря и реки употребляются с **the**.',
      type: 'choice',
    },
    {
      prompt: "It's ___ best day of my life.",
      answer: 'the',
      options: ['a', 'an', 'the', '.'],
      explanation: 'Превосходная степень **(«самый-самый»)** всегда с **the**.',
      type: 'choice',
    },
    {
      prompt: '___ children need sleep. **(в целом)**',
      answer: '—',
      options: ['the', 'a', 'an', '.'],
      explanation: 'Дети **вообще**, множественное число, **нулевой артикль**.',
      type: 'choice',
    },
    {
      prompt: '___ children are asleep. **(конкретные)**',
      answer: 'the',
      options: ['a', 'an', 'the', '.'],
      explanation: 'Это **конкретные дети**, о которых знают оба собеседника.',
      type: 'choice',
    },
    {
      prompt: 'Я вижу кошку. Кошка чёрная.',
      answer: 'I see a cat. The cat is black.',
      explanation: 'Первое упоминание даёт **a**, повторное даёт **the**.',
      type: 'translate',
    },
    {
      prompt: 'Она учитель.',
      answer: 'She is a teacher.',
      explanation: 'Профессия берёт **a**/**an**.',
      type: 'translate',
    },
    {
      prompt: 'Луна очень большая.',
      answer: 'The moon is very big.',
      explanation: 'Луна одна, поэтому **the**.',
      type: 'translate',
    },
  ],
  scoring: { excellent: 20, good: 15 },
};

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
          text: 'Артикль — это такое особое слово перед _существительным_. \nВ русском языке артиклей нет, а в английском они очень частое явление.',
        },
        {
          kind: 'Text',
          text: 'Всего есть четыре варианта: **a**/**an**, **the** и ****. \n**** — артикль писать не нужно',
        },
        {
          kind: 'Examples',
          items: [
            'I have **a** _dog_. — У меня есть собака.',
            'She eats **an** _apple_. — Она ест яблоко.',
            '**The** _dog_ is big. — Эта собака большая.',
            'I like **** _dogs_. — Я люблю собак.',
          ],
        },
        { kind: 'Subtitle', text: 'Задайте вопрос:' },
        {
          kind: 'Text',
          text: '**Собеседник знает, о каком предмете речь?** \n\nДа, знает — ставим **the**. \nНет, это что-то новое — ставим **a/an**. \nГоворим вообще или в целом — ****.',
        },
      ],
    },
    {
      nav: 'Артикль The',
      blocks: [
        { kind: 'Subtitle', text: 'The — «тот самый»' },
        {
          kind: 'Text',
          text: '**The** — это определённый артикль. \n**Тот самый, который мы оба знаем**.',
        },
        { kind: 'Subtitle', text: 'Когда ставим **the**?' },
        {
          kind: 'Text',
          text: '❶ Ясно из ситуации. \nВы оба понимаете, о чём идёт речь.',
        },
        {
          kind: 'Examples',
          items: [
            'Please close **the** _door_. — Закрой, пожалуйста, дверь.',
            'Where is **the** car _key_? — Где ключ от машины?',
          ],
        },
        {
          kind: 'Text',
          text: '❷ Когда мы уже говорили об этом. \nСначала мы называем предмет с **a/an**, а потом — с **the**.',
        },
        {
          kind: 'Examples',
          items: [
            'I saw **a** _cat_. **The** _cat_ was black. — Я увидел кошку. Кошка была чёрной.',
          ],
        },
        {
          kind: 'Text',
          text: '❸ Такой предмет только один во всём мире. \nНапример: солнце, луна, небо.',
        },
        {
          kind: 'Examples',
          items: [
            '**The** _sun_ is hot. — Солнце горячее.',
            '**The** _moon_ is bright tonight. — Луна сегодня яркая.',
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
          items: ['I saw **a** good _film_ yesterday. — Вчера я посмотрел хороший фильм.'],
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
          items: ['Do you want **a** _drink_? — Хочешь напиток?'],
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
            '**** _Birds_ eat **** _worms_. — Птицы едят червей.',
            'I like **** _dogs_. — Я люблю собак.',
          ],
        },
        {
          kind: 'Text',
          text: '❷ Неисчесляемые. \nНапример: вода, молоко, любовь, музыка.',
        },
        {
          kind: 'Examples',
          items: [
            '**** _Water_ freezes at 0°C. — Вода замерзает при 0 °C.',
            '**** _Music_ makes me happy. — Музыка делает меня счастливым.',
          ],
        },
        { kind: 'Subtitle', text: 'Сравните' },
        {
          kind: 'Examples',
          items: [
            '**** _Children_ need sleep. — Детям нужен сон. (все дети вообще)',
            '**The** _children_ are asleep. — Дети спят. (конкретные дети)',
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
            '**Have** **** _breakfast_. — Завтракать',
            'I speak **** _English_. — Я говорю по-английски.',
            'She plays **** _tennis_. — Она играет в теннис.',
            'By **** _train_. — На поезде.',
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
            'I go to **** _school_ every day. — Я хожу в школу каждый день. (учиться)',
            'I went to **the** _school_ to meet **a** _teacher_. — Я ходил в школу, чтобы встретиться с учителем. (конкретное здание) \n\n(из контекста непонятно с каким учителем именно)',
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
            { id: 'rNone', text: '****', kind: 'result' },
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
          text: '**A/an** — один предмет, новый или «какой-то».\n**The** — конкретный предмет, который знают все,\n**** — когда говорим о вещах в целом.',
        },
        {
          kind: 'Examples',
          items: [
            'I have **a** _cat_. — У меня есть кошка.',
            '**The** _cat_ is very cute. — Эта кошка очень милая.',
            '**** _Cats_ are cute. — Кошки милые (все кошки вообще).',
          ],
        },
        {
          kind: 'Text',
          text: 'Теперь вы знаете главное. Переходите к упражнениям и тренируйтесь. У вас всё получится!',
        },
      ],
    },
    {
      nav: 'Тест',
      blocks: [{ kind: 'Test', test: articlesTest }],
    },
  ],
};
