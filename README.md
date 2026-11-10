# Sa Iisang Bubong

<<<<<<< HEAD
A presentation website about coming together, living together, and the freedom to begin again. The illustrated scenes and dialogue are made for the group’s DEMO 1 presentation. Mika and Eli use free CC0 pixel-art sprites by cyanowl, adapted with distinct hair and clothing colors. It preserves all 17 supplied recordings and their narrative order.

## Publish on GitHub Pages

1. Extract this ZIP.
2. Upload the **contents of `sa-iisang-bubong/`** to your repository. Put `index.html` at the repository root, with `mp3/`, `cuts/`, `lyrics/`, and `assets/` beside it.
3. Commit to `main`.
4. In **Settings → Pages**, choose **Deploy from a branch**, then `main` and `/(root)`.

No build tools, packages, API keys, account system, or importing are required. All paths are relative, including audio paths, so repository subpaths work. The MP3s are included byte-for-byte as supplied. To rehearse locally, serve this directory with `python3 -m http.server 8000`, then open http://localhost:8000. Core content, animation, charts, and MP3 playback work without external services; optional Google Fonts and YouTube links need the internet.

## Four presentation chapters

1. **Our topic** introduces the topic, explains why the group chose it, states the group’s position on divorce as an option, and frames a demographic question.
2. **Story & song cuts** tells Mika and Eli’s fictional story in six illustrated chapters. Each chapter moves from dialogue to the group’s selected passages, then opens the interpretation after a cut finishes. Read with the next-dialogue arrow or let **Start story** advance the dialogue at a reading pace based on the length of each line. When the dialogue ends, **Play this cut** starts the matching passage. Playback stops at its last chosen line, leaving room to discuss the meaning. **Next song cut** plays the next passage; **Next story chapter** returns to the next narrated moment. Chapter buttons and song-cut buttons let the presenter jump directly to a moment. All 13 selected passages appear in the group’s playlist order. The story finishes with a link to the closing data.
3. **Full playlist** is a separate page containing all 17 recordings. It retains artist, release year, runtime, source, interpretation, demographic connection, original group notes, reflection question, and a bridge to the next song. This page plays only full MP3 recordings. Tap a row to play or pause the complete song, use Play all to start at the first track, or use the player to seek anywhere in the full recording. Playback moves to the next complete song when one finishes. The spliced audio, lyric lines, and line-by-line controls live only in Story & song cuts; a separate link opens the matching story passage. Switching between the story cuts and full playlist clears the previous audio source so a clip cannot resume from the full-song player. Interpretations remain under 100 words. Search works by title, artist, contributor, or chapter word.
4. **Closing data** includes three population-data views, eight interactive demographic concepts linked to songs, an interactive household example, the overall reflection, scoped legal context, and APA-style references.

## The narrative

Mika, 24, is a contract designer; Eli, 25, works rotating support shifts and helps his brother. After three years together, they move into a rental near work for affection, ordinary time together, and shared costs. They stay unmarried and initially leave marriage and parenthood open.

Everyday work reveals an uneven division of care. They try a shared calendar, fairer chores, a budget, and weekly conversations. Later they discover different plans: Mika is considering work in Iloilo and remains unsure about children; Eli wants a family in Metro Manila near his work and brother. After several months of trying to repair the relationship, they recognize that neither can promise the other’s future. They separate at the end of the lease, settle practical responsibilities, and return to different support networks.

The six chapters contain **36 dialogue moments** with matching visual captions. They show the reasons for moving in, the repair attempts, the decision, and the practical and emotional aftermath. They do not depict a sudden breakup after one argument. The case is fictional and does not represent an entire generation. Because the characters never marry, their breakup is not a legal divorce; the final question connects their experience to the wider discussion of choices for married couples.

The full script is in **STORY.md**. Research context and population evidence remain on the closing page: Kuang’s 2025 analysis of 2016 focus groups and the 2021 YAFS key findings are clearly separated from the invented characters’ details. The PSA census views and APA references remain available there.

## Selected passages and timing

The group’s draft supplied passages for **13 songs**, comprising **55 displayed lines**. The displayed words are preserved. The passages have been aligned against the supplied recordings and prepared as separate WAV files in `cuts/`. **Unti-Unti** uses recording-specific timings: its first chosen line starts around 1:26.68, rather than the old 1:20 cue.

**Play this cut** plays the prepared passage from its beginning. It no longer seeks into the full MP3 for story playback. The WAV files preserve the recordings’ original stereo sample rates and end at the selected passage boundary, so the audio stops naturally. The separate moments in **2 MINUS 1** are already joined into one cut. Clicking a line seeks to its position within that short audio file, and highlighting follows the same clip-relative timeline. The full original MP3 remains available on the separate playlist page.

`presentation-data.js` contains both the original-recording times (`start`, `end`, `lines`, and optional `segments`) and the prepared-file times (`clipFile`, `clipDuration`, and `clipLines`). LRC sidecars retain the original-recording line times. Old browser timing trims are ignored. Changed scripts and cut URLs carry a timing version so an earlier cached cue does not keep applying. These are line cues with a short consonant lead-in, rather than a word-by-word karaoke score.

Video versions can differ from the MP3. Starting a published lyric video pauses the local recording, and closing it removes the iframe.
**Hallelujah**, **Bye Bye Bye**, and the two distinct **Paalam** songs still have no group-selected passage. These remain in the full playlist and under **Also in this chapter** in the story. They can play their complete recordings or open the existing published lyric sources. No invented group lyric choices or additional full copyrighted lyrics have been added.

## Data and interpretation

The PSA graphs use the 2015 and 2020 census releases and clearly label household population aged 10 and over as their denominator. The views compare common-law/live-in and divorced/separated/annulled shares, compare within-sex shares and composition in 2020, and show the full marital-status snapshot with a year switch. Axes start at zero. The combined category cannot isolate divorce or establish an annual divorce rate, individual transitions, causes, or the group experiencing the most harm. These are historical figures, not 2026 estimates.

The household scenario is explicitly hypothetical: two partners and four relatives start in three households. If the partners maintain separate homes, there are four households; if both join their relatives’ existing homes, there are two. There are six people in either case. This illustrates household reorganization rather than predicting a population outcome.

Concepts and legal examples retain their source links. The policy position belongs to the group; it is not presented as a conclusion proved by the songs or census data.

## Presentation controls

- Use the four header chapters or the next-chapter links.
- **Present** reduces surrounding space and requests fullscreen where supported.
- In the story, **Space** pauses/resumes; **Right Arrow** advances dialogue or continues to the next cut. **Left Arrow** returns to the previous dialogue, or to the previous chapter when already at its beginning. Inputs and focused controls keep their usual keys.
- Numbered moment buttons jump to any line of the chapter. **Previous dialogue** goes back one moment. **Read the whole conversation** opens the chapter transcript.
- Tapping a displayed lyric starts at that line. Each cut stops at its selected end, and **Replay this cut** starts it again. Player previous/next controls move between cuts while a story cut is selected.
- Mobile layouts stack the story and lyric stage. Completing dialogue moves the selected cut into view; continuing to a new chapter returns to the story.
- Concept and data tabs support Arrow keys, Home, and End.
- Playback has seek, volume/mute, previous/next song, and close controls.
- **Pause movement** freezes the character animation; **Replay movement** restarts the scene’s movement. Characters have ink-and-pastel 2D shapes, visible facial features, articulated arms and legs, and distinct outfits. Scenes show commuting, shared work, a job offer, the decision to separate, the final bills, and separate homes. Eli leaves once, after the packing conversation reaches its final beat.
- Dialogue changes preserve the scene’s animation clock. Hidden tabs stop the drawing loop. Reduced-motion preference shows a settled scene without movement.

## Adding more songs later

Keep adding the group’s recordings to `mp3/`, using stable filenames. Add an entry to the `tracks` array in `catalog.js`; counts, duration, sequence numbers, song search, references, and previous/next selection follow the catalog. It does not automatically discover unlisted MP3 files. Add the selected words to that entry and put original-recording line times in `presentation-data.js` under the same stable track ID. Add the prepared passage audio to `cuts/` and its `clipFile`, `clipDuration`, and `clipLines` to the cue. `lyrics/` retains readable timestamped sidecars. Add concept links using the same ID in `concepts.js`.

Do not replace Silent Sanctuary’s Paalam with Moira and Ben&Ben’s Paalam; they are separate tracks. The story remains six thematic stages even as the music collection grows. Add the stable song ID to a scene’s `tracks` array in `presentation-data.js` to choose its place in the story. New unassigned songs use their zero-based `storyScene` setting, or their `roomState`, as a fallback. A song joins the playable story cuts once it has both selected lyric text and a matching cue. Counts and cut durations update automatically.

The assignment guide recommends **6–8 songs and around 20–30 minutes**. The current 17-song full collection runs **65:57**. The site preserves every choice and discloses the difference. Playing selected passages supports a shorter class presentation, but does not make a 17-song collection meet the recommended song count.

## Files

- `index.html`, `styles.css`, `app.js`: presentation and interactions.
- `story-world.js`: pastel canvas scenery and complete-frame sprite animation.
- `STORY.md`: the full fictional case script and music transitions.
- `catalog.js`: the group’s growing song collection and song references.
- `presentation-data.js`: story dialogue, soundtrack choices, and passage timings.
- `concepts.js`, `laws.js`: concept notebook, scoped legal appendix, references.
- `mp3/`: all supplied recordings.
- `lyrics/`: group-supplied selected passages with original-recording timestamps.
- `cuts/`: prepared stereo WAV passages used only by Story & song cuts.

The website has no import/export interface, backend, visitor uploads, or playlist-management workflow.

The visual direction uses cyanowl’s CC0 character sprites, matching monochrome pixel portraits, paper texture, and pastel game backgrounds. Complete source animation frames keep the neck, arms, and body connected. The local atlases are in `assets/sprites/`; the original source layers and an optional Pillow preparation script are included. The website needs no external image service or Python. See `assets/ARTWORK.md` for source links and credits.

## Story background music and clean scenery

The story includes an original instrumental loop at `assets/audio/story-ambience.mp3`. **Start story**, a chapter selection, or a dialogue control starts the music after a user interaction. **Pause story** pauses it. The story has separate **Music on/off** and **Volume** controls; those preferences are remembered in the browser. The music pauses during selected lyric clips and resumes after they finish. It stops outside the story and pauses while the browser tab is hidden. It never mixes with a full playlist recording.

The commute, room, and separate-home artwork has no floating labels, character-name labels, box text, or tiny written notes. Simple visual marks on props preserve their appearance. Story captions, dialogue, and chapter information remain outside the illustrations.

## November 9 additions

True Love Waits by Radiohead is included as the seventeenth recording, placed between Unti-Unti and Don’t Think Twice, It’s All Right. Reeyann’s six selected lines from the updated group PDF are retained as written and included as a prepared story cut in chapter 4. Line starts use the 2016 studio version’s synchronized lyric cues; the passage ends before the next verse. The native cut has the original lead vocal. The newly uploaded Paths MP3 is byte-for-byte identical to the existing recording, so the playlist keeps one Paths entry and its existing matched cut. All other songs, scenes, and recordings are preserved.
=======
A complete, buildless DEMO 1 presentation: one shared roof, changing unions, and the freedom to begin again.

## Put it on GitHub Pages

Upload the contents of this folder so `index.html` is at the repository root, alongside `app.js`, `styles.css`, `revision.css`, and the media folders. In GitHub, choose Settings → Pages → Deploy from a branch → main → /(root). Keep `.nojekyll`.

No installation, build, API key, Apple Music login, or visitor file-management workflow is needed. All media paths are relative, including on a repository subpath. For local rehearsal, run `python3 -m http.server 8000` in this folder and open http://localhost:8000. The packaged recordings, story, native lyric cuts, and charts work locally; Google Fonts and published YouTube videos need the internet.

## Final eight songs

| # | Song | Artist | First release | Supplied recording |
| --- | --- | --- | --- | --- |
| 1 | Cornelia Street | Taylor Swift | 2019 | 4:48 |
| 2 | Vines | The Ridleys | 2024 | 3:17 |
| 3 | Hit the Wall | Gracie Abrams | 2026 | 3:17 |
| 4 | Unti-Unti | UDD (Up Dharma Down) | 2017 | 4:58 |
| 5 | True Love Waits | Radiohead | 2016 | 4:44 |
| 6 | Don’t Think Twice, It’s All Right | Bob Dylan | 1963 | 3:39 |
| 7 | The Apartment We Won’t Share | NIKI | 2022 | 2:30 |
| 8 | Paths | NIKI | 2024 | 3:10 |

Full recordings total **30:22**, about 30 minutes (22 seconds beyond the guide’s approximate 30-minute upper target). The skit contains **2:42** of selected music plus the time taken for dialogue and discussion. All eight interpretations contain 71–87 words and meet the 100-word maximum.

Unti-Unti was first released in 2017. The selected Viva lyric visuals identify the 2019 U D D album version; the supplied recording runs 4:58. The edition note and recording citation distinguish these dates.

## Four chapters

1. **Our topic:** the original title, theme, reasons for choosing it, and the group’s position on divorce as an option.
2. **Story & song cuts:** the revised six-part Mika and Eli script with Narrator 1, Narrator 2, Mika, and Eli. The full conversation is readable per scene and in the rehearsal-script dialog. Reading pace, manual next/previous controls, scene selection, motion controls, original background music, and matched song cuts support classroom use. The uploaded PDF is included at `documents/group-script.pdf`.
3. **Full playlist:** exactly eight complete recordings in a coherent story order, separate from the short skit cuts. Each has artist, year, runtime, source, interpretation, song evidence, demographic concepts, original group notes where supplied, a question, and a bridge to the next track. Search, Play all, next/previous, seek, volume, and published sing-along videos are available.
4. **Closing data:** verified census charts, qualitative research context, youth union-status figures, eight interactive demographic concepts with measurement explanations, a household scenario, overall reflection, scoped legal context, and APA references for research, recordings, and videos. Section shortcuts make the information easy to reach.

## Script and music

Spoken dialogue follows the updated group PDF. A repeated narrator paragraph in Part 2 appears once. Generic narrator lines are split between the two narrator roles. Music transitions follow the eight selected songs. `STORY.md` contains the rehearsal script.

Each of the eight songs has a group-supplied selected passage and a prepared stereo WAV in `cuts/`. These keep the original vocal. The native stage highlights each line against its clip timeline and stops at the end of the prepared file. Full MP3s remain separate. The published sing-alongs open in an embedded player with a direct YouTube fallback; official, fan, and live-performance sources are labeled. Vines uses an authorized performance whose full lyrics are in its description; on-screen lyrics were not verified.

## Evidence

Sources were reviewed November 9, 2026. `SOURCE_NOTES.md` records scope and link corrections. Historical PSA figures are explicitly labeled 2015 and 2020, with household population aged 10+ as their denominator. The divorced/separated/annulled category is combined; it is not an annual divorce rate or a measure of harm. The fictional case is not national evidence and is not a legal divorce: Mika and Eli never marry. YAFS covers ages 15–24, so Eli, 25, is outside its age range. Kuang’s focus groups do not establish how widespread a reason is. The group’s policy position remains distinct from both data and law. The current progress of the cited Senate proposal could not be confirmed; its filing and proposed status are labeled.

## Files and maintenance

- `index.html`, `app.js`, `styles.css`, `revision.css`: website and interactions.
- `catalog.js`: the final eight selections and their metadata; no public playlist editor.
- `presentation-data.js`, `STORY.md`, `documents/group-script.pdf`: dialogue, roles, six scenes, source script, and clip timing.
- `concepts.js`, `laws.js`, `SOURCE_NOTES.md`: academic context and checked source notes.
- `mp3/`, `cuts/`, `lyrics/`: exactly eight full songs, eight prepared passages, and eight selected-line sidecars.
- `story-world.js`, `assets/sprites/`: pixel scenes and local CC0 sprite assets; see `assets/ARTWORK.md`.
- `story-music.js`, `assets/audio/`: original story ambience, separate from song playback.

The ZIP contains only the eight submitted songs. There are no import/export controls. To revise a later version, edit the source catalog and matching scene IDs; keep stable file paths and adjust cue data when changing a recording.
>>>>>>> 0781108 (second commit)
