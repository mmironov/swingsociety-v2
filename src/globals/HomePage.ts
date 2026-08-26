import type { GlobalConfig } from 'payload'
import { revalidateGlobalHooks } from '../hooks/revalidate'
import { anyone, editors } from '../access'
import { linkField } from '../fields/link'

/** Every section carries the same small "kicker + heading + intro" trio. */
const sectionHeader = ({
  kicker,
  heading,
  withIntro = true,
}: {
  kicker: string
  heading: string
  withIntro?: boolean
}) => [
  { name: 'kicker', type: 'text' as const, label: 'Надзаглавие', localized: true, defaultValue: kicker },
  {
    name: 'heading',
    type: 'textarea' as const,
    label: 'Заглавие',
    localized: true,
    defaultValue: heading,
    admin: { description: 'Нов ред в текста става нов ред на сайта.' },
  },
  ...(withIntro
    ? [
        {
          name: 'intro',
          type: 'textarea' as const,
          label: 'Въвеждащ текст',
          localized: true,
        },
      ]
    : []),
]

const enabled = (label = 'Показвай тази секция') => ({
  name: 'enabled' as const,
  type: 'checkbox' as const,
  label,
  defaultValue: true,
})

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Начална страница',
  admin: {
    group: 'Съдържание',
    description: 'Всяка секция от началната страница, в реда, в който се показва.',
    livePreview: {
      url: ({ locale }) => `${process.env.NEXT_PUBLIC_SERVER_URL ?? ''}/${locale?.code ?? 'bg'}`,
    },
  },
  access: { read: anyone, update: editors },
  versions: { drafts: false, max: 25 },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // ── Hero ──────────────────────────────────────────────────────────
        {
          label: 'Начало',
          fields: [
            {
              name: 'hero',
              type: 'group',
              label: 'Първият екран',
              fields: [
                {
                  name: 'offerHeading',
                  type: 'text',
                  label: 'Голямото заглавие',
                  localized: true,
                  defaultValue: 'Суинг танци за начинаещи',
                  admin: {
                    description:
                      'Какво продаваме, с думите, които хората търсят. Това е и заглавието, което Google чете първо. Пренася се само, без нови редове.',
                  },
                },
                {
                  name: 'heading',
                  type: 'textarea',
                  label: 'Малкият надпис над заглавието',
                  localized: true,
                  required: true,
                  defaultValue: 'Научи се да танцуваш',
                  admin: {
                    description:
                      'Кратък ред над голямото заглавие — задава тона, без да поема ролята му.',
                  },
                },
                {
                  name: 'intro',
                  type: 'textarea',
                  label: 'Текст под заглавието',
                  localized: true,
                },
                {
                  name: 'photo',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Голямата снимка',
                },
                linkField({ name: 'primaryCta', label: 'Основен бутон' }),
                linkField({ name: 'secondaryCta', label: 'Втори бутон' }),
              ],
            },
          ],
        },
        // ── The two cards under the hero ──────────────────────────────────
        {
          label: 'Двете карти',
          fields: [
            {
              name: 'courseCard',
              type: 'group',
              label: 'Карта „Следваща група“',
              fields: [
                { ...enabled('Показвай картата') },
                {
                  name: 'badge',
                  type: 'text',
                  label: 'Етикет',
                  localized: true,
                  defaultValue: 'Следваща група',
                },
                {
                  name: 'course',
                  type: 'relationship',
                  relationTo: 'courses',
                  label: 'Кой курс',
                  admin: {
                    description:
                      'Заглавието, описанието и етикетите се вземат от избрания курс. Промениш ли курса, картата се обновява.',
                  },
                },
                {
                  name: 'linkLabel',
                  type: 'text',
                  label: 'Текст на връзката',
                  localized: true,
                  defaultValue: 'Виж курса',
                },
              ],
            },
            {
              name: 'festivalCard',
              type: 'group',
              label: 'Карта „Фестивал“',
              fields: [
                { ...enabled('Показвай картата') },
                { name: 'badge', type: 'text', label: 'Етикет', localized: true, defaultValue: 'Фестивал' },
                { name: 'dates', type: 'text', label: 'Дати и град', localized: true },
                {
                  name: 'heading',
                  type: 'textarea',
                  label: 'Заглавие',
                  localized: true,
                  admin: { description: 'Нов ред в текста става нов ред на сайта.' },
                },
                { name: 'body', type: 'textarea', label: 'Текст', localized: true },
                { name: 'logo', type: 'upload', relationTo: 'media', label: 'Лого на фестивала' },
                linkField({ name: 'link', label: 'Връзка' }),
              ],
            },
          ],
        },
        // ── Beginners ─────────────────────────────────────────────────────
        {
          label: 'Начинаещи',
          fields: [
            {
              name: 'beginners',
              type: 'group',
              label: 'Секция „Начинаещи“',
              fields: [
                enabled(),
                ...sectionHeader({ kicker: 'Начинаещи', heading: 'Влез в група за начинаещи' }),
                {
                  name: 'groups',
                  type: 'relationship',
                  relationTo: 'courses',
                  hasMany: true,
                  label: 'Кои групи да се показват',
                  admin: {
                    description:
                      'По една карта за всяка група — начало, ден, час, цена и зала идват от курса. Редът тук е редът на картите. Когато отвориш нова група, добави я тук.',
                  },
                },
                {
                  name: 'course',
                  type: 'relationship',
                  relationTo: 'courses',
                  label: 'Курсът в таблицата (старо поле)',
                  /**
                   * Superseded by `groups`, which shows every open group rather than
                   * one. Kept until the value has been copied across and verified in
                   * both environments; hidden so nobody edits a field that no longer
                   * renders.
                   */
                  admin: { hidden: true },
                },
                {
                  name: 'courseLinkLabel',
                  type: 'text',
                  label: 'Текст на втория бутон',
                  localized: true,
                  defaultValue: 'Виж курса',
                  admin: { description: 'Води към страницата с подробности за курса.' },
                },
                {
                  name: 'reassuranceHeading',
                  type: 'text',
                  label: 'Заглавие на списъка отдясно',
                  localized: true,
                  defaultValue: 'Без притеснения',
                },
                {
                  name: 'reassurances',
                  type: 'array',
                  label: 'Точки с отметка',
                  labels: { singular: 'Точка', plural: 'Точки' },
                  fields: [{ name: 'text', type: 'text', label: 'Текст', localized: true, required: true }],
                },
                {
                  name: 'signup',
                  type: 'group',
                  label: 'Формата за имейл',
                  fields: [
                    enabled('Показвай формата'),
                    {
                      name: 'heading',
                      type: 'text',
                      label: 'Заглавие',
                      localized: true,
                      defaultValue: 'Още не е моментът?',
                    },
                    { name: 'body', type: 'textarea', label: 'Текст', localized: true },
                    {
                      name: 'placeholder',
                      type: 'text',
                      label: 'Текст в полето',
                      localized: true,
                      defaultValue: 'твоят имейл',
                    },
                    {
                      name: 'buttonLabel',
                      type: 'text',
                      label: 'Текст на бутона',
                      localized: true,
                      defaultValue: 'Кажи ми кога започва',
                    },
                    {
                      name: 'successMessage',
                      type: 'text',
                      label: 'Съобщение след записване',
                      localized: true,
                      defaultValue: 'Готово — ще ти пишем.',
                    },
                  ],
                },
              ],
            },
          ],
        },
        // ── Reviews + video ───────────────────────────────────────────────
        {
          label: 'Отзиви и видео',
          fields: [
            {
              name: 'reviews',
              type: 'group',
              label: 'Секция „Отзиви“',
              fields: [
                enabled(),
                ...sectionHeader({
                  kicker: 'Отзиви',
                  heading: 'Какво казват танцуващите',
                  withIntro: false,
                }),
                linkField({ name: 'allLink', label: 'Бутон „Виж всички отзиви“' }),
                {
                  name: 'placeholderNote',
                  type: 'text',
                  label: 'Текст, докато няма отзиви',
                  localized: true,
                  defaultValue: 'Място за отзив.',
                  admin: {
                    description:
                      'Показва се в трите празни плочки, докато не добавиш истински отзиви в „Отзиви“.',
                  },
                },
              ],
            },
            {
              name: 'videoStrip',
              type: 'group',
              label: 'Секция „Видео“',
              fields: [
                enabled(),
                ...sectionHeader({
                  kicker: 'Видео',
                  heading: 'Как изглежда отвътре',
                  withIntro: false,
                }),
                linkField({ name: 'handleLink', label: 'Бутон с профила' }),
                {
                  name: 'items',
                  type: 'array',
                  label: 'Плочки',
                  labels: { singular: 'Плочка', plural: 'Плочки' },
                  maxRows: 4,
                  fields: [
                    { name: 'title', type: 'text', label: 'Надпис', localized: true, required: true },
                    {
                      name: 'video',
                      type: 'upload',
                      relationTo: 'media',
                      label: 'Видео файл',
                      admin: {
                        description:
                          'Качено mp4. Плочката се пуска на място при клик — нищо не се изтегля, докато посетителят не го поиска. Оставиш ли празно, плочката води към връзката отдолу.',
                      },
                    },
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                      label: 'Кадър преди пускане',
                      admin: { description: 'Снимката, която се вижда, преди видеото да е пуснато.' },
                    },
                    {
                      name: 'url',
                      type: 'text',
                      label: 'Връзка (когато няма качено видео)',
                      admin: { description: 'напр. към клипа в Instagram.' },
                    },
                  ],
                },
                { name: 'note', type: 'text', label: 'Бележка под плочките', localized: true },
              ],
            },
          ],
        },
        // ── Dances ────────────────────────────────────────────────────────
        {
          label: 'Танци',
          fields: [
            {
              name: 'dances',
              type: 'group',
              label: 'Секция „Танци“ (преместено в отделна страница)',
              /**
               * Moved to its own page. The fields stay in the schema until the
               * content has been copied into the new global and verified in every
               * environment — dropping a column is not something to do in the same
               * change that fills its replacement. Hidden so nobody edits content
               * that no longer renders anywhere.
               */
              admin: { hidden: true },
              fields: [
                enabled(),
                ...sectionHeader({ kicker: 'Танци', heading: 'Три езика на суинга' }),
                linkField({ name: 'introLink', label: 'Връзка в края на въвеждащия текст' }),
                {
                  name: 'items',
                  type: 'relationship',
                  relationTo: 'pages',
                  hasMany: true,
                  label: 'Кои страници',
                  admin: {
                    description:
                      'Всяка карта показва заглавието, водещия параграф и голямата снимка на избраната страница. Редът тук е редът на картите.',
                  },
                },
                {
                  name: 'linkLabel',
                  type: 'text',
                  label: 'Текст на връзката в картите',
                  localized: true,
                  defaultValue: 'Виж повече',
                },
              ],
            },
          ],
        },
        // ── FAQ ───────────────────────────────────────────────────────────
        {
          label: 'Въпроси',
          fields: [
            {
              name: 'faq',
              type: 'group',
              label: 'Секция „Въпроси“ (преместено в отделна страница)',
              /**
               * Moved to its own page. The fields stay in the schema until the
               * content has been copied into the new global and verified in every
               * environment — dropping a column is not something to do in the same
               * change that fills its replacement. Hidden so nobody edits content
               * that no longer renders anywhere.
               */
              admin: { hidden: true },
              fields: [
                enabled(),
                ...sectionHeader({
                  kicker: 'Въпроси',
                  heading: 'Преди първия час',
                  withIntro: false,
                }),
                {
                  name: 'items',
                  type: 'array',
                  label: 'Въпроси',
                  labels: { singular: 'Въпрос', plural: 'Въпроси' },
                  fields: [
                    { name: 'question', type: 'text', label: 'Въпрос', localized: true, required: true },
                    { name: 'answer', type: 'textarea', label: 'Отговор', localized: true, required: true },
                    linkField({ name: 'link', label: 'Връзка след отговора', withLabel: true }),
                  ],
                },
              ],
            },
          ],
        },
        // ── Events ────────────────────────────────────────────────────────
        {
          label: 'Събития',
          fields: [
            {
              name: 'events',
              type: 'group',
              label: 'Секция „Предстоящи събития“',
              fields: [
                enabled(),
                ...sectionHeader({
                  kicker: 'За текущите ученици',
                  heading: 'Предстоящи събития',
                }),
                linkField({ name: 'allLink', label: 'Връзка „Целият график“' }),
                {
                  name: 'limit',
                  type: 'number',
                  label: 'Колко събития да се показват',
                  defaultValue: 3,
                  min: 1,
                  max: 8,
                },
              ],
            },
          ],
        },
        // ── Team + about ──────────────────────────────────────────────────
        {
          label: 'Екип и за нас',
          fields: [
            {
              name: 'team',
              type: 'group',
              label: 'Секция „Екип“ (преместено в отделна страница)',
              /**
               * Moved to its own page. The fields stay in the schema until the
               * content has been copied into the new global and verified in every
               * environment — dropping a column is not something to do in the same
               * change that fills its replacement. Hidden so nobody edits content
               * that no longer renders anywhere.
               */
              admin: { hidden: true },
              fields: [
                enabled(),
                ...sectionHeader({ kicker: 'Екип', heading: 'Хората, които водят' }),
              ],
            },
            {
              name: 'about',
              type: 'group',
              label: 'Секция „За нас“',
              fields: [
                enabled(),
                ...sectionHeader({ kicker: 'За нас', heading: 'Няколко неща в едно', withIntro: false }),
                {
                  name: 'paragraphs',
                  type: 'array',
                  label: 'Параграфи',
                  labels: { singular: 'Параграф', plural: 'Параграфи' },
                  fields: [{ name: 'text', type: 'textarea', label: 'Текст', localized: true, required: true }],
                },
                { name: 'image', type: 'upload', relationTo: 'media', label: 'Снимка' },
              ],
            },
          ],
        },
        // ── Contact + footer ──────────────────────────────────────────────
        {
          label: 'Контакти и футър',
          fields: [
            {
              name: 'contact',
              type: 'group',
              label: 'Секция „Контакти“',
              fields: [
                enabled(),
                ...sectionHeader({ kicker: 'Контакти', heading: 'Пиши ни' }),
              ],
            },
            {
              name: 'footerCta',
              type: 'group',
              label: 'Голямото заглавие във футъра',
              fields: [
                {
                  name: 'heading',
                  type: 'textarea',
                  label: 'Заглавие',
                  localized: true,
                  defaultValue: 'Първият час е най-трудният. После е само танц.',
                },
                linkField({ name: 'cta', label: 'Бутон', defaultLabel: 'Запиши се за начинаещи' }),
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: revalidateGlobalHooks,
}
