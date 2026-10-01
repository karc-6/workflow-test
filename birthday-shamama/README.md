# Shamama — A Retrospective

A standalone, offline birthday website — a private exhibition, all on
one slide. Pure HTML, CSS and vanilla JavaScript. No build step, no
install, no backend, and nothing to scroll past — the entrance is the
whole page, and the other four rooms open over it as panels.

```
birthday-shamama/
├── index.html
├── css/style.css
├── js/script.js
├── images/        ← photo1.jpg … photo10.jpg (placeholders already inside)
├── videos/        ← video1.mp4, video2.mp4, video3.mp4 (you add these)
└── audio/         ← birthday-song.mp3 (you add this)
```

## 1. Open it in VS Code

1. Open the `birthday-shamama` folder in VS Code (`File → Open Folder…`).
2. Install the **Live Server** extension (search "Live Server" by Ritwick
   Dey in the Extensions panel).
3. Right-click `index.html` → **Open with Live Server**. It reloads
   automatically every time you save a file.

You can also just double-click `index.html` to open it straight in a
browser — every path is relative, so no server is required at all.

## 2. One slide, four rooms

Everything is reachable from the entrance: the top nav, the roman-numeral
rail on the right, and the row of "doors" under the message all open the
same four rooms, as a panel over the slide rather than a new page. Escape,
the "close" button, or clicking outside the panel all return to the
entrance; the page itself never scrolls, only the inside of a panel does
when its content is tall (the Collection wall, for instance).

| Room | Section id | What it is |
|---|---|---|
| I | `#entrance` | The one slide — her name, the message, the doors to every other room |
| II | `#collection` | Panel: the gallery wall — photos and videos |
| III | `#guestbook` | Panel: **Her Name** — her memories orbit; catch seven and set each into a letter |
| IV | `#correspondence` | Panel: three letters, opened by "breaking the seal" |
| V | `#reveal` | Panel: the final room, behind the "Unveil It" button |

## 3. Add Shamama's real photos

Drop her photos into `images/`, named exactly:

```
photo1.jpg  photo2.jpg  photo3.jpg … photo10.jpg
```

They replace the placeholder plates automatically — nothing in the code
needs to change. `.jpg`, `.png` and `.webp` all work; if you use a
different extension, update the matching filename in `js/script.js`
(see below).

## 4. Edit photos, videos, captions and the gallery hang

Open `js/script.js` and find the `PHOTOS` and `VIDEOS` arrays near the
top:

```js
const PHOTOS = [
  { file: "photo1.jpg", caption: "My favourite human" },
  { file: "photo2.jpg", caption: "Always silly" },
  // ...
];
```

Edit a `caption`, add a new `{ file: ..., caption: ... }` line, or
delete one you don't need.

Just below that is `WALL_LAYOUT` — this is what actually decides the
order and size of frames on the gallery wall in Room II:

```js
const WALL_LAYOUT = [
  { media: PHOTOS[0], size: "wide" },
  { media: VIDEOS[0], size: "feature" },
  { media: PHOTOS[1], size: "square" },
  // ...
];
```

`size` can be `"wide"`, `"feature"`, `"portrait"` or `"square"` — that's
what gives the wall its asymmetric, hand-hung look. Reorder the lines,
swap which photo goes where, or change a size to rebalance the wall.

## 5. Add the 3 videos

Drop three short clips into `videos/`, named `video1.mp4`, `video2.mp4`,
`video3.mp4`. Until they're added, clicking a video frame shows a
gentle "add this file" message instead of a broken player.

## 6. Add the birthday song

Drop an MP3 into `audio/birthday-song.mp3`. The player in the
bottom-right corner picks it up automatically — nothing autoplays,
Shamama has to press play herself. To rename the song title shown
there, change `SONG_TITLE` near the top of `js/script.js`.

## 7. Her Name room, the floating memories, and the letters

**Her Name (Room III).** Every photo and video in `PHOTOS` / `VIDEOS`
(section 4) orbits her name as a small card. Drag one into a letter — or
just tap it and it flies to the next empty one — and the letter develops
into that photograph, or plays that video. Seven memories later the name
is made of her. Click a finished letter to send its memory back into
orbit. The spelled name is the `NAME` constant near the top of
`js/script.js`; the room's heading and hint are in `index.html`.

**Floating background.** Faint, feathered copies of the same photos and
(on desktop) two of the videos drift up behind everything, entrance and
every room panel alike. Their transparency is set in `setupDrift()` in
`js/script.js` (`--o`, roughly 0.24–0.72 depending how close the copy
sits — raise or lower those ranges to taste). Videos are muted; missing
files are simply skipped. The "reduce motion" pill (and the OS setting)
freezes all of it.

**Letters (Room IV).** `LETTERS` is a list of `{ title, body }` entries —
edit the text directly.

## 8. Change the title wall message

This lives in `index.html` — search for `entrance__title` and edit the
text around it:

```html
<h1 class="entrance__title">Shamama</h1>
<p class="entrance__subtitle">a retrospective, in her honour</p>
...
<p class="entrance__message">To more laughter, brighter days, beautiful memories, and all the dreams you chase.</p>
```

The final message ("Happy Birthday, Shamama! ♡" / "You deserve all the
beautiful things life has to offer.") lives in the same file, in the
`#revealOverlay` block near the bottom of `<body>`.

## 9. Colors & fonts

All colors are CSS variables at the top of `css/style.css`, under
`:root { ... }` — `--ink`, `--brass`, `--ivory`, `--wine`, etc. Fonts
are loaded from Google Fonts in the `<head>` of `index.html` (Fraunces
for headings and letters, Archivo for everything else); swap the font
names there and in the `--font-*` variables in `style.css` if you'd
rather use something else.

## 10. Getting it onto GitHub, and publishing it

This folder is already a git repository (one commit, on branch `main`),
so it's ready to push — but you don't need to know git at all to get it
onto GitHub. Pick whichever of these feels easiest:

**Option A — GitHub Desktop (no commands, recommended if you're not
sure)**
1. Install [GitHub Desktop](https://desktop.github.com) and sign in.
2. `File → Add local repository…` and choose this `birthday-shamama`
   folder. GitHub Desktop will recognise it's already a repo.
3. Click **Publish repository** in the top bar (pick private if you'd
   like). That's it — it's on GitHub.

**Option B — drag-and-drop on github.com (also no commands)**
1. On [github.com](https://github.com), click the **+** in the top
   right → **New repository** → give it a name → **Create repository**
   (leave it empty — don't add a README there).
2. On the new repo's page, click **uploading an existing file**.
3. Open the `birthday-shamama` folder on your computer, select
   *everything inside it* (`index.html`, `css`, `js`, `images`,
   `videos`, `audio`, `README.md` — not the folder itself), and drag
   that selection onto the upload box. Don't drag the `.zip` file —
   unzip it first, or GitHub will just upload the zip as one file
   instead of a website.
4. Click **Commit changes**.

**Option C — the command line, if you're comfortable with it**
```
cd birthday-shamama
git remote add origin <the-URL-github-gave-you>
git push -u origin main
```

**Then, either way — turn it into a live link:**
1. In the repo, go to **Settings → Pages**.
2. Under "Build and deployment", set the source to **Deploy from a
   branch**, branch **main**, folder **/ (root)** → **Save**.
3. GitHub gives you a `https://<you>.github.io/<repo-name>/` link a
   minute or two later — that's the one to send Shamama.

## A few details already built in

- **One slide, always** — the entrance never scrolls away; every room is
  a panel that opens over it and gives it back exactly where you left it.
- **Reduce motion** — a small pill in the bottom-left corner turns off
  the ambient drift and flicker, and the site also respects the
  OS-level "reduce motion" setting automatically.
- **Keyboard support** — Tab reaches every door and room control, arrow
  keys move between photos in the lightbox, Escape closes whatever's
  open (a room, the lightbox, a video) one layer at a time.
- **Mobile** — the gallery wall, nav and every room panel reflow for
  small screens; no horizontal scrolling.
- **Missing files never look broken** — a photo, video or song that
  hasn't been added yet shows a soft placeholder or a friendly note
  instead of an error icon.

Happy birthday, Shamama. ♡
