# Updating the site

A short guide for anyone who writes content on the Swing Society site. No
programming needed — everything happens in a browser.

Log in at **/admin** with the email and password you were given.

> **A note on the labels.** The panel's field and section names are in Bulgarian,
> because that is the language the school edits in. This guide quotes them exactly
> as they appear on screen, with an English gloss in brackets the first time. If
> you'd rather see Payload's own buttons (Save, Create New, Publish) in English,
> change the language in your account settings — the field names stay Bulgarian.
>
> Има и българска версия на това упътване: [CMS.bg.md](CMS.bg.md).

---

## The two languages

Top right there is a switcher — **Locale: Български / English**. It changes the
language of the *content you are editing*, not the language of the panel.

Every text field holds a Bulgarian and an English value. The rule is simple:

> **Write Bulgarian first. Leave the English field empty until you have time to
> translate it — a visitor on the English site then sees the Bulgarian text.**

So the site never shows a blank. Translate gradually; there is no rush.

⚠️ Switching locale with unsaved changes loses them. Save first.

---

## Where to change what

| You want to change | Go to |
| ------------------ | ----- |
| Section texts on the home page | **Начална страница** (Home page) |
| Dates, times and prices of groups | **Курсове и групи** (Courses and groups) |
| Parties and festivals | **Събития** (Events) |
| The people in the Team section | **Екип** (Team) |
| Google reviews | **Отзиви** (Reviews) |
| The course and dance pages | **Страници** (Pages) |
| Texts on the schedule page | **Страница „График“** (Schedule page) |
| Phone, email, logo, menu, the "Sign up" button | **Настройки на сайта** (Site settings) |
| Photos and videos | **Файлове и снимки** (Files and photos) |
| Who left an email for the next group | **Записани имейли** (Subscribed emails) |

Changes appear on the site within a few seconds of pressing **Save**. There is
nothing else to do.

---

## The most common tasks

### Announcing a new group

1. **Курсове и групи** → open the group.
2. Tab **Кога и къде** (When and where): fill in **Начална дата** (Start date),
   **Ден от седмицата** (Day of the week), **Час** (Time) and **Цена** (Price).
3. **Save**.

While **Начална дата** is empty the site shows the text from **Бележка вместо
дата** (Note instead of a date) — by default "уточнява се" (to be confirmed). Set
a real date and it replaces the note automatically.

That one group appears in three places — the card on the home page, the Beginners
section, and the schedule table. You write it once.

### Closing registration

**Настройки на сайта** → tab **Записване** (Registration) → untick **Записването
е отворено** (Registration is open). The label on the card changes to "Скоро"
(Coming soon).

For a single group instead: **Курсове и групи** → **Записване** → **Състояние на
записването** (Registration status).

### Adding a party or festival

**Събития** → **Create New**.

- **Начало** (Start) and **Край** (End) — fill these in and the date in the
  schedule becomes an "Add to calendar" link that opens Google Calendar with the
  event ready. Worth doing.
- No date yet? Leave them empty and write in **Бележка вместо дата**.
- **Как да се изпише датата** (How to write the date) — for multi-day events,
  e.g. "25—27 септ. 2026".
- **Вид** (Type) sets the colour of the tag.
- **Показвай на началната страница** (Show on the home page) — the home page shows
  the next three.

Past events drop off the site by themselves. You don't need to delete them.

### Adding a Google review

**Отзиви** → **Create New**. Copy the text **word for word** — don't paraphrase it
and don't correct it.

Until there is at least one review, the site shows three empty tiles with a dashed
border. The first real review replaces them.

### Uploading a teacher's photo

**Екип** → open the person → **Снимка** (Photo) → **Create New** and upload the
file.

Portrait shape works best (taller than wide). Upload the original — the phone and
desktop sizes are generated automatically.

Without a photo the site shows a tile with the first letter of the name. It looks
good, so don't upload a poor photo just to fill the space.

### Adding a video

Three places:

- **Начална страница** → **Отзиви и видео** (Reviews and video) → the tiles in the
  Video section. Each tile has **Видео файл** (Video file — an uploaded mp4) and
  **Кадър преди пускане** (Poster frame). The clip plays in place on click —
  nothing downloads until a visitor asks for it. With no file uploaded, the tile
  simply links to the **Връзка** (Link) below it, e.g. to Instagram.
- **Inside a page** → the **Видео** block → **YouTube / Vimeo (връзка)** and paste
  the ordinary YouTube address. It becomes a player by itself.
- The same block with **Качен файл** (Uploaded file) — for short clips you want
  hosted on the site.

Choose **Още няма видео** (No video yet) and a placeholder with a dashed border
appears.

⚠️ **The format matters.** Phones record `.mov`, which some browsers won't play.
Upload **mp4**. If all you have is `.mov`, pass the file to whoever maintains the
site — there is a ready command that converts and shrinks it (76 MB becomes 9 MB
with no visible difference).

For clips longer than a minute or two, put them on **YouTube** and use the link —
the site stays light and the video adapts its quality to the viewer's connection.

### Writing a new page

**Страници** → **Create New**.

1. **Надзаглавие** (Kicker, e.g. "Курс"), **Заглавие** (Title), **Водещ параграф**
   (Lead paragraph).
2. **Голяма снимка или видео** (Large photo or video) — the image at the top.
3. **Блокове** (Blocks) — this is where the text is assembled. Drag them to
   reorder.
4. **Адрес (slug)** on the right — leave it empty and it is generated from the
   title.
5. **Save** stores a draft. **Publish** makes it live.

The blocks are: **Заглавие** (Heading), **Текст** (Text), **Списък** (List),
**Цитат** (Quote), **Снимка** (Image), **Видео** (Video). There are deliberately
no others — that is what keeps every page looking like part of the site.

### Putting a link in text

In a **Текст** block: select the word → press the link icon → choose **Internal
link** for a page on the site, or **Custom URL** for an external address.

Internal links survive a page being renamed. Use them rather than typing the
address by hand.

### Changing a button or a menu link

Every link on the site has the same set of settings:

- **Текст на бутона** (Button text) — what it says.
- **Вид на връзката** (Link type) — decides the rest:
  - **Външен адрес** (External address) — for swingbuzz.eu and social media
  - **Страница от сайта** (A page on the site) — pick from a list
  - **Секция от началната страница** (A section of the home page) — e.g.
    Beginners, Contact
  - **Графикът** (The schedule)
  - **Без връзка** (No link) — the button simply doesn't appear

The menu is reordered by dragging, in **Настройки на сайта** → **Меню** (Menu).

### Hiding a whole section

Every section in **Начална страница** has a **Показвай тази секция** (Show this
section) tickbox. Untick it and the section disappears — the content stays, so you
can bring it back later.

---

## Worth knowing

**A new line in a heading.** In the large heading fields, pressing Enter creates a
real line break on the site. The big heading on the home page is designed for
three short lines.

**Addresses are a promise.** Change the slug of a published page and everyone who
shared the old address lands on a 404. Don't touch it without a reason.

**Photo description (alt).** Write what can be seen. It is read by blind visitors
and by Google. Leave it empty only for purely decorative images.

**If a photo is badly cropped.** The site crops photos to different shapes — a
square in the Team grid, a wide band in the cards, wider still on the pages. Every
photo has a **фокусна точка** (focal point): open it in **Файлове и снимки** and
move the circle onto the face. From then on every crop centres on it — you change
nothing else. This matters most for full-length photos: without a focal point the
crop lands on the waist and the head falls outside the frame.

**Versions.** Every page has a **Versions** button at the top — the history of
changes, and you can restore an older one.

**Live preview.** The eye icon shows how the page looks while you write.

**SEO.** Every page has an **SEO** tab — a title and description for Google. Leave
them empty and the page title and lead paragraph are used instead. That is enough
in most cases.

**Subscribed emails** from the "Tell me when it starts" form are in **Записани
имейли**. Write to those people when you announce a new group — they asked you to.
