import { spawnSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA = join(__dirname, '../data/tamil-ov-nt.json');
const OUT = join(__dirname, '../assets/db/scripture.db');

if (!existsSync(DATA)) {
  console.error(`ERROR: Source data not found at ${DATA}`);
  console.error('Obtain data/tamil-ov-nt.json before running this script.');
  process.exit(1);
}

mkdirSync(join(__dirname, '../assets/db'), { recursive: true });

const pythonScript = `
import sqlite3, json, os, sys

data_path, out_path = sys.argv[1], sys.argv[2]
verses = json.load(open(data_path, encoding='utf-8'))

if os.path.exists(out_path):
    os.remove(out_path)

db = sqlite3.connect(out_path)
db.execute('PRAGMA journal_mode=WAL')
db.executescript("""
    CREATE TABLE scripture (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        book          TEXT    NOT NULL,
        chapter       INTEGER NOT NULL,
        verse         INTEGER NOT NULL,
        text          TEXT    NOT NULL,
        language_code TEXT    NOT NULL DEFAULT 'ta'
    );
    CREATE INDEX idx_scripture_lookup ON scripture(book, chapter, verse);
    CREATE VIRTUAL TABLE scripture_fts USING fts5(
        text,
        content='scripture',
        content_rowid='id'
    );
""")
db.executemany(
    'INSERT INTO scripture (book, chapter, verse, text, language_code) VALUES (?,?,?,?,?)',
    [(v['book'], v['chapter'], v['verse'], v['text'], 'ta') for v in verses]
)
db.execute("INSERT INTO scripture_fts(scripture_fts) VALUES('rebuild')")
db.commit()
db.execute('PRAGMA journal_mode=DELETE')
db.close()

size_kb = round(os.stat(out_path).st_size / 1024)
print(f"\\u2705 Seeded {len(verses)} verses -> {out_path} ({size_kb} KB)")
`;

const result = spawnSync('python3', ['-c', pythonScript, DATA, OUT], {
  encoding: 'utf-8',
  stdio: ['ignore', 'pipe', 'pipe'],
});

if (result.error) {
  console.error('Failed to spawn python3:', result.error.message);
  process.exit(1);
}

if (result.status !== 0) {
  const detail = result.signal ? `killed by signal ${result.signal}` : result.stderr.trim();
  console.error(detail);
  process.exit(result.status ?? 1);
}

console.log(result.stdout.trim());
