## Integration instructions for Claude

Edit app source only during the later integration pass, not during this research handoff.

During integration:

- Seed these rows with `language_code = 'en'`, `content_type = 'quote'`, and `review_status = 'published'`.
- Keep each `book`, `chapter`, `verse`, `practicePath`, `productPillar`, and `moodTag` identical to the Tamil pack in `docs/content/CONTENT-RESEARCH-OUTPUT.md`.
- Parameterize `scripts/seed-content.ts` by language so `--lang ta` validates against `data/tamil-ov-nt.json` and `--lang en` validates against the KJV source file Claude adds.
- Add a KJV validation source file containing at least these 50 English verses, then run the dry-run validator until all 50 English quotes pass.
- Run:

```bash
npx tsx scripts/seed-content.ts --lang en
npm run format
npx tsc --noEmit
npm run lint
```

Do not run `--execute` unless Lawrence explicitly asks and provides the required service-role credential. Do not alter Tamil content, `vow.body`, or any app copy as part of this English pack.

## KJV source

KJV text source used for this handoff:

- Project Gutenberg eBook #10, *The King James Version of the Bible*, UTF-8 text: https://www.gutenberg.org/cache/epub/10/pg10.txt
- Project page: https://www.gutenberg.org/ebooks/10

The 50 verse strings below were extracted from that Project Gutenberg KJV text and normalized as single-line verse strings for seeding. Punctuation and wording follow that source, including its curly apostrophes in `man’s` and `Father’s`.

## Task 1 — 50 quotes

```ts
const SAMPLE_QUOTES: SeedQuote[] = [
  {
    book: 'Matthew',
    chapter: 4,
    verse: 4,
    scriptureText:
      'But he answered and said, It is written, Man shall not live by bread alone, but by every word that proceedeth out of the mouth of God.',
    practicePath: 'body',
    productPillar: 'word',
    moodTag: 'tempted',
  },
  {
    book: 'Matthew',
    chapter: 4,
    verse: 7,
    scriptureText: 'Jesus said unto him, It is written again, Thou shalt not tempt the Lord thy God.',
    practicePath: 'body',
    productPillar: 'integrity',
    moodTag: 'tempted',
  },
  {
    book: 'Matthew',
    chapter: 4,
    verse: 10,
    scriptureText:
      'Then saith Jesus unto him, Get thee hence, Satan: for it is written, Thou shalt worship the Lord thy God, and him only shalt thou serve.',
    practicePath: 'soul',
    productPillar: 'integrity',
    moodTag: 'tempted',
  },
  {
    book: 'Matthew',
    chapter: 5,
    verse: 3,
    scriptureText: 'Blessed are the poor in spirit: for theirs is the kingdom of heaven.',
    practicePath: 'soul',
    productPillar: 'hope_faith_love',
    moodTag: 'none',
  },
  {
    book: 'Matthew',
    chapter: 5,
    verse: 4,
    scriptureText: 'Blessed are they that mourn: for they shall be comforted.',
    practicePath: 'mind',
    productPillar: 'hope_faith_love',
    moodTag: 'grieving',
  },
  {
    book: 'Matthew',
    chapter: 5,
    verse: 9,
    scriptureText: 'Blessed are the peacemakers: for they shall be called the children of God.',
    practicePath: 'body',
    productPillar: 'walk',
    moodTag: 'angry',
  },
  {
    book: 'Matthew',
    chapter: 5,
    verse: 24,
    scriptureText:
      'Leave there thy gift before the altar, and go thy way; first be reconciled to thy brother, and then come and offer thy gift.',
    practicePath: 'body',
    productPillar: 'integrity',
    moodTag: 'angry',
  },
  {
    book: 'Matthew',
    chapter: 5,
    verse: 28,
    scriptureText:
      'But I say unto you, That whosoever looketh on a woman to lust after her hath committed adultery with her already in his heart.',
    practicePath: 'body',
    productPillar: 'integrity',
    moodTag: 'tempted',
  },
  {
    book: 'Matthew',
    chapter: 5,
    verse: 44,
    scriptureText:
      'But I say unto you, Love your enemies, bless them that curse you, do good to them that hate you, and pray for them which despitefully use you, and persecute you;',
    practicePath: 'body',
    productPillar: 'walk',
    moodTag: 'angry',
  },
  {
    book: 'Matthew',
    chapter: 6,
    verse: 14,
    scriptureText: 'For if ye forgive men their trespasses, your heavenly Father will also forgive you:',
    practicePath: 'body',
    productPillar: 'integrity',
    moodTag: 'angry',
  },
  {
    book: 'Matthew',
    chapter: 6,
    verse: 25,
    scriptureText:
      'Therefore I say unto you, Take no thought for your life, what ye shall eat, or what ye shall drink; nor yet for your body, what ye shall put on. Is not the life more than meat, and the body than raiment?',
    practicePath: 'mind',
    productPillar: 'hope_faith_love',
    moodTag: 'anxious',
  },
  {
    book: 'Matthew',
    chapter: 6,
    verse: 33,
    scriptureText:
      'But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.',
    practicePath: 'soul',
    productPillar: 'walk',
    moodTag: 'anxious',
  },
  {
    book: 'Matthew',
    chapter: 6,
    verse: 34,
    scriptureText:
      'Take therefore no thought for the morrow: for the morrow shall take thought for the things of itself. Sufficient unto the day is the evil thereof.',
    practicePath: 'mind',
    productPillar: 'hope_faith_love',
    moodTag: 'anxious',
  },
  {
    book: 'Matthew',
    chapter: 7,
    verse: 12,
    scriptureText:
      'Therefore all things whatsoever ye would that men should do to you, do ye even so to them: for this is the law and the prophets.',
    practicePath: 'body',
    productPillar: 'integrity',
    moodTag: 'angry',
  },
  {
    book: 'Matthew',
    chapter: 10,
    verse: 31,
    scriptureText: 'Fear ye not therefore, ye are of more value than many sparrows.',
    practicePath: 'mind',
    productPillar: 'hope_faith_love',
    moodTag: 'anxious',
  },
  {
    book: 'Matthew',
    chapter: 11,
    verse: 28,
    scriptureText: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.',
    practicePath: 'mind',
    productPillar: 'hope_faith_love',
    moodTag: 'grieving',
  },
  {
    book: 'Matthew',
    chapter: 11,
    verse: 29,
    scriptureText:
      'Take my yoke upon you, and learn of me; for I am meek and lowly in heart: and ye shall find rest unto your souls.',
    practicePath: 'soul',
    productPillar: 'walk',
    moodTag: 'grieving',
  },
  {
    book: 'Matthew',
    chapter: 16,
    verse: 24,
    scriptureText:
      'Then said Jesus unto his disciples, If any man will come after me, let him deny himself, and take up his cross, and follow me.',
    practicePath: 'body',
    productPillar: 'walk',
    moodTag: 'tempted',
  },
  {
    book: 'Matthew',
    chapter: 19,
    verse: 26,
    scriptureText:
      'But Jesus beheld them, and said unto them, With men this is impossible; but with God all things are possible.',
    practicePath: 'mind',
    productPillar: 'hope_faith_love',
    moodTag: 'anxious',
  },
  {
    book: 'Matthew',
    chapter: 26,
    verse: 41,
    scriptureText:
      'Watch and pray, that ye enter not into temptation: the spirit indeed is willing, but the flesh is weak.',
    practicePath: 'body',
    productPillar: 'integrity',
    moodTag: 'tempted',
  },
  {
    book: 'Matthew',
    chapter: 28,
    verse: 20,
    scriptureText:
      'Teaching them to observe all things whatsoever I have commanded you: and, lo, I am with you alway, even unto the end of the world. Amen.',
    practicePath: 'soul',
    productPillar: 'walk',
    moodTag: 'lonely',
  },
  {
    book: 'Mark',
    chapter: 4,
    verse: 40,
    scriptureText: 'And he said unto them, Why are ye so fearful? how is it that ye have no faith?',
    practicePath: 'mind',
    productPillar: 'hope_faith_love',
    moodTag: 'anxious',
  },
  {
    book: 'Mark',
    chapter: 9,
    verse: 23,
    scriptureText:
      'Jesus said unto him, If thou canst believe, all things are possible to him that believeth.',
    practicePath: 'mind',
    productPillar: 'hope_faith_love',
    moodTag: 'anxious',
  },
  {
    book: 'Mark',
    chapter: 10,
    verse: 14,
    scriptureText:
      'But when Jesus saw it, he was much displeased, and said unto them, Suffer the little children to come unto me, and forbid them not: for of such is the kingdom of God.',
    practicePath: 'soul',
    productPillar: 'hope_faith_love',
    moodTag: 'lonely',
  },
  {
    book: 'Mark',
    chapter: 10,
    verse: 27,
    scriptureText:
      'And Jesus looking upon them saith, With men it is impossible, but not with God: for with God all things are possible.',
    practicePath: 'mind',
    productPillar: 'hope_faith_love',
    moodTag: 'anxious',
  },
  {
    book: 'Mark',
    chapter: 11,
    verse: 24,
    scriptureText:
      'Therefore I say unto you, What things soever ye desire, when ye pray, believe that ye receive them, and ye shall have them.',
    practicePath: 'soul',
    productPillar: 'hope_faith_love',
    moodTag: 'anxious',
  },
  {
    book: 'Mark',
    chapter: 11,
    verse: 25,
    scriptureText:
      'And when ye stand praying, forgive, if ye have ought against any: that your Father also which is in heaven may forgive you your trespasses.',
    practicePath: 'body',
    productPillar: 'integrity',
    moodTag: 'angry',
  },
  {
    book: 'Luke',
    chapter: 7,
    verse: 13,
    scriptureText: 'And when the Lord saw her, he had compassion on her, and said unto her, Weep not.',
    practicePath: 'mind',
    productPillar: 'hope_faith_love',
    moodTag: 'grieving',
  },
  {
    book: 'Luke',
    chapter: 12,
    verse: 15,
    scriptureText:
      'And he said unto them, Take heed, and beware of covetousness: for a man’s life consisteth not in the abundance of the things which he possesseth.',
    practicePath: 'body',
    productPillar: 'integrity',
    moodTag: 'tempted',
  },
  {
    book: 'Luke',
    chapter: 12,
    verse: 32,
    scriptureText: 'Fear not, little flock; for it is your Father’s good pleasure to give you the kingdom.',
    practicePath: 'mind',
    productPillar: 'hope_faith_love',
    moodTag: 'lonely',
  },
  {
    book: 'Luke',
    chapter: 21,
    verse: 19,
    scriptureText: 'In your patience possess ye your souls.',
    practicePath: 'mind',
    productPillar: 'walk',
    moodTag: 'tempted',
  },
  {
    book: 'Luke',
    chapter: 22,
    verse: 40,
    scriptureText:
      'And when he was at the place, he said unto them, Pray that ye enter not into temptation.',
    practicePath: 'body',
    productPillar: 'integrity',
    moodTag: 'tempted',
  },
  {
    book: 'Luke',
    chapter: 23,
    verse: 43,
    scriptureText:
      'And Jesus said unto him, Verily I say unto thee, To day shalt thou be with me in paradise.',
    practicePath: 'soul',
    productPillar: 'hope_faith_love',
    moodTag: 'grieving',
  },
  {
    book: 'John',
    chapter: 4,
    verse: 14,
    scriptureText:
      'But whosoever drinketh of the water that I shall give him shall never thirst; but the water that I shall give him shall be in him a well of water springing up into everlasting life.',
    practicePath: 'soul',
    productPillar: 'hope_faith_love',
    moodTag: 'none',
  },
  {
    book: 'John',
    chapter: 5,
    verse: 24,
    scriptureText:
      'Verily, verily, I say unto you, He that heareth my word, and believeth on him that sent me, hath everlasting life, and shall not come into condemnation; but is passed from death unto life.',
    practicePath: 'soul',
    productPillar: 'hope_faith_love',
    moodTag: 'grieving',
  },
  {
    book: 'John',
    chapter: 6,
    verse: 35,
    scriptureText:
      'And Jesus said unto them, I am the bread of life: he that cometh to me shall never hunger; and he that believeth on me shall never thirst.',
    practicePath: 'body',
    productPillar: 'hope_faith_love',
    moodTag: 'lonely',
  },
  {
    book: 'John',
    chapter: 6,
    verse: 37,
    scriptureText:
      'All that the Father giveth me shall come to me; and him that cometh to me I will in no wise cast out.',
    practicePath: 'soul',
    productPillar: 'hope_faith_love',
    moodTag: 'lonely',
  },
  {
    book: 'John',
    chapter: 8,
    verse: 12,
    scriptureText:
      'Then spake Jesus again unto them, saying, I am the light of the world: he that followeth me shall not walk in darkness, but shall have the light of life.',
    practicePath: 'soul',
    productPillar: 'word',
    moodTag: 'none',
  },
  {
    book: 'John',
    chapter: 10,
    verse: 11,
    scriptureText: 'I am the good shepherd: the good shepherd giveth his life for the sheep.',
    practicePath: 'soul',
    productPillar: 'hope_faith_love',
    moodTag: 'grieving',
  },
  {
    book: 'John',
    chapter: 10,
    verse: 27,
    scriptureText: 'My sheep hear my voice, and I know them, and they follow me:',
    practicePath: 'soul',
    productPillar: 'walk',
    moodTag: 'lonely',
  },
  {
    book: 'John',
    chapter: 11,
    verse: 25,
    scriptureText:
      'Jesus said unto her, I am the resurrection, and the life: he that believeth in me, though he were dead, yet shall he live:',
    practicePath: 'soul',
    productPillar: 'hope_faith_love',
    moodTag: 'grieving',
  },
  {
    book: 'John',
    chapter: 14,
    verse: 1,
    scriptureText: 'Let not your heart be troubled: ye believe in God, believe also in me.',
    practicePath: 'mind',
    productPillar: 'hope_faith_love',
    moodTag: 'anxious',
  },
  {
    book: 'John',
    chapter: 14,
    verse: 6,
    scriptureText:
      'Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.',
    practicePath: 'soul',
    productPillar: 'word',
    moodTag: 'none',
  },
  {
    book: 'John',
    chapter: 14,
    verse: 15,
    scriptureText: 'If ye love me, keep my commandments.',
    practicePath: 'body',
    productPillar: 'integrity',
    moodTag: 'tempted',
  },
  {
    book: 'John',
    chapter: 14,
    verse: 18,
    scriptureText: 'I will not leave you comfortless: I will come to you.',
    practicePath: 'soul',
    productPillar: 'hope_faith_love',
    moodTag: 'lonely',
  },
  {
    book: 'John',
    chapter: 14,
    verse: 27,
    scriptureText:
      'Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.',
    practicePath: 'mind',
    productPillar: 'hope_faith_love',
    moodTag: 'anxious',
  },
  {
    book: 'John',
    chapter: 15,
    verse: 5,
    scriptureText:
      'I am the vine, ye are the branches: He that abideth in me, and I in him, the same bringeth forth much fruit: for without me ye can do nothing.',
    practicePath: 'soul',
    productPillar: 'walk',
    moodTag: 'lonely',
  },
  {
    book: 'John',
    chapter: 15,
    verse: 12,
    scriptureText: 'This is my commandment, That ye love one another, as I have loved you.',
    practicePath: 'body',
    productPillar: 'walk',
    moodTag: 'angry',
  },
  {
    book: 'John',
    chapter: 16,
    verse: 22,
    scriptureText:
      'And ye now therefore have sorrow: but I will see you again, and your heart shall rejoice, and your joy no man taketh from you.',
    practicePath: 'mind',
    productPillar: 'hope_faith_love',
    moodTag: 'grieving',
  },
  {
    book: 'John',
    chapter: 16,
    verse: 33,
    scriptureText:
      'These things I have spoken unto you, that in me ye might have peace. In the world ye shall have tribulation: but be of good cheer; I have overcome the world.',
    practicePath: 'mind',
    productPillar: 'hope_faith_love',
    moodTag: 'anxious',
  },
];
```

| Reference | KJV text (short) | practicePath | productPillar | moodTag |
|---|---|---|---|---|
| Matthew 4:4 | Man shall not live by bread alone... | body | word | tempted |
| Matthew 4:7 | Thou shalt not tempt the Lord thy God. | body | integrity | tempted |
| Matthew 4:10 | Thou shalt worship the Lord thy God... | soul | integrity | tempted |
| Matthew 5:3 | Blessed are the poor in spirit... | soul | hope_faith_love | none |
| Matthew 5:4 | Blessed are they that mourn... | mind | hope_faith_love | grieving |
| Matthew 5:9 | Blessed are the peacemakers... | body | walk | angry |
| Matthew 5:24 | First be reconciled to thy brother... | body | integrity | angry |
| Matthew 5:28 | Whosoever looketh on a woman to lust... | body | integrity | tempted |
| Matthew 5:44 | Love your enemies... | body | walk | angry |
| Matthew 6:14 | If ye forgive men their trespasses... | body | integrity | angry |
| Matthew 6:25 | Take no thought for your life... | mind | hope_faith_love | anxious |
| Matthew 6:33 | Seek ye first the kingdom of God... | soul | walk | anxious |
| Matthew 6:34 | Take therefore no thought for the morrow... | mind | hope_faith_love | anxious |
| Matthew 7:12 | Whatsoever ye would that men should do to you... | body | integrity | angry |
| Matthew 10:31 | Fear ye not therefore... | mind | hope_faith_love | anxious |
| Matthew 11:28 | Come unto me... and I will give you rest. | mind | hope_faith_love | grieving |
| Matthew 11:29 | Take my yoke upon you... | soul | walk | grieving |
| Matthew 16:24 | Let him deny himself... and follow me. | body | walk | tempted |
| Matthew 19:26 | With God all things are possible. | mind | hope_faith_love | anxious |
| Matthew 26:41 | Watch and pray... | body | integrity | tempted |
| Matthew 28:20 | I am with you alway... | soul | walk | lonely |
| Mark 4:40 | Why are ye so fearful? | mind | hope_faith_love | anxious |
| Mark 9:23 | All things are possible to him that believeth. | mind | hope_faith_love | anxious |
| Mark 10:14 | Suffer the little children to come unto me... | soul | hope_faith_love | lonely |
| Mark 10:27 | With God all things are possible. | mind | hope_faith_love | anxious |
| Mark 11:24 | When ye pray, believe... | soul | hope_faith_love | anxious |
| Mark 11:25 | When ye stand praying, forgive... | body | integrity | angry |
| Luke 7:13 | Weep not. | mind | hope_faith_love | grieving |
| Luke 12:15 | Beware of covetousness... | body | integrity | tempted |
| Luke 12:32 | Fear not, little flock... | mind | hope_faith_love | lonely |
| Luke 21:19 | In your patience possess ye your souls. | mind | walk | tempted |
| Luke 22:40 | Pray that ye enter not into temptation. | body | integrity | tempted |
| Luke 23:43 | To day shalt thou be with me in paradise. | soul | hope_faith_love | grieving |
| John 4:14 | The water that I shall give him... | soul | hope_faith_love | none |
| John 5:24 | Hath everlasting life... | soul | hope_faith_love | grieving |
| John 6:35 | I am the bread of life... | body | hope_faith_love | lonely |
| John 6:37 | Him that cometh to me I will in no wise cast out. | soul | hope_faith_love | lonely |
| John 8:12 | I am the light of the world... | soul | word | none |
| John 10:11 | I am the good shepherd... | soul | hope_faith_love | grieving |
| John 10:27 | My sheep hear my voice... | soul | walk | lonely |
| John 11:25 | I am the resurrection, and the life... | soul | hope_faith_love | grieving |
| John 14:1 | Let not your heart be troubled... | mind | hope_faith_love | anxious |
| John 14:6 | I am the way, the truth, and the life... | soul | word | none |
| John 14:15 | If ye love me, keep my commandments. | body | integrity | tempted |
| John 14:18 | I will not leave you comfortless... | soul | hope_faith_love | lonely |
| John 14:27 | Peace I leave with you... | mind | hope_faith_love | anxious |
| John 15:5 | I am the vine, ye are the branches... | soul | walk | lonely |
| John 15:12 | Love one another, as I have loved you. | body | walk | angry |
| John 16:22 | Your heart shall rejoice... | mind | hope_faith_love | grieving |
| John 16:33 | Be of good cheer; I have overcome the world. | mind | hope_faith_love | anxious |

## Open questions

- The Project Gutenberg KJV UTF-8 text uses curly apostrophes in Luke 12:15 (`man’s`) and Luke 12:32 (`Father’s`). Keep these if the validation source is Project Gutenberg; convert only if Claude deliberately chooses a different KJV edition/source and validates against that exact file.
- Several KJV verses include narrative lead-ins as part of the single verse, matching the Tamil pack's single-verse schema: Matthew 16:24, Mark 10:14, Luke 7:13, John 6:35, John 8:12, John 11:25, and John 14:6. I preserved the full KJV verse rather than extracting only the spoken clause.
- Matthew 5:44 ends with a semicolon in this KJV source. Preserve it during integration.
- John 10:27 and John 11:25 end with colons in this KJV source. Preserve them during integration.
- Luke 23:43 uses `To day` as two words in this KJV source. Preserve that spelling during integration.
- I did not change any tags from the Tamil pack. If Matthew 5:28 or any other Tamil-pack reference is later removed, remove it in both language packs together to keep parity.
