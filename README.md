# InitPad Docs

Uživatelská nápověda [InitPadu](https://github.com/kudrle01/initpad), veřejné
edice s GitHubem i self-hosted instalace, v češtině a angličtině. Statické stránky bez build kroku: vše, co se zveřejňuje,
je ve složce `public/`.

| Cesta        | Obsah                                                     |
| ------------ | --------------------------------------------------------- |
| `/cs/`       | česká nápověda (`public/cs/index.html`)                   |
| `/en/`       | anglická nápověda (`public/en/index.html`)                |
| `/`          | přesměruje podle jazyka prohlížeče, výchozí je angličtina |
| `/guide.css` | společné styly obou jazyků                                |
| `/brand/`    | symbol InitPadu a ikony stránky                           |

## Odkazy z aplikace

InitPad odkazuje na nápovědu adresou `<INITPAD_DOCS_URL>/<jazyk>/#<kapitola>`.
Kotvy kapitol jsou proto v obou jazycích stejné, anglické a stálé. Přejmenovat
nebo odebrat je lze jen spolu s typem `HelpTopic` v
`apps/web/src/lib/help.ts` v repozitáři platformy:

`getting-started`, `sign-in`, `github`, `servers`, `new-project`, `import`,
`deployments`, `variables`, `team`, `rename-delete`, `troubleshooting`,
`limitations`, `self-hosted`.

Kotvu `self-hosted` přidává platforma ve verzi 0.2.36. Podkapitoly
(`h3`) mají vlastní kotvy, které jsou rovněž v obou jazycích stejné.

## Úprava a náhled

```bash
python3 -m http.server 4178 --bind 127.0.0.1 --directory public
```

Stránky jsou pak na `http://localhost:4178/cs/` a `http://localhost:4178/en/`.
Přesměrování z kořene dělá Worker, ten vyzkoušíte přes
`npx wrangler dev`.

## Nasazení

Cloudflare nasazuje větev `main` po každém pushi jako Worker. Soubory z
`public/` servíruje přímo, `src/index.js` odpovídá jen na adresy bez souboru, v
praxi na `/`. Co a odkud se nasazuje, určuje `wrangler.jsonc`.
Nastavení projektu v Cloudflare:

| Položka        | Hodnota                |
| -------------- | ---------------------- |
| Project name   | `initpad-docs`         |
| Build command  | prázdné                |
| Deploy command | `npx wrangler deploy`  |
| Root directory | `/`                    |

Název projektu se musí shodovat s `name` ve `wrangler.jsonc`, jinak nasazení
selže.

Soubor `public/_headers` nastavuje bezpečnostní hlavičky. Stránky nenačítají
žádné zdroje z jiných adres a styly berou jen ze souboru `guide.css`, ne
z atributů `style` nebo bloků `<style>`. Jediný skript je malý inline skript
na konci obou stránek, který přepínači jazyka přidá aktuální `#kotvu`.
`Content-Security-Policy` ho povoluje přes jeho otisk SHA-256 (`script-src
'sha256-…'`). Kdo skript změní, musí přepočítat otisk, například:

```bash
python3 -c "import re,hashlib,base64;s=re.search(r'<script>(.*?)</script>',open('public/cs/index.html').read(),re.S).group(1);print(base64.b64encode(hashlib.sha256(s.encode()).digest()).decode())"
```

Obě jazykové verze musí obsahovat skript znak po znaku stejný.

## Pravidla obsahu

- Nápověda popisuje vydanou verzi platformy. Verze je uvedena v podtitulu a v
  patičce; chování, které platí až od novější verze, to musí mít u sebe napsané.
- Obě jazykové verze mají stejné kapitoly ve stejném pořadí. Změna obsahu se
  dělá v obou souborech najednou.
- Názvy tlačítek odpovídají textům aplikace: v češtině slovníku
  `apps/web/src/i18n/cs.ts` v repozitáři platformy, v angličtině jeho klíčům,
  tedy anglickým textům ve zdrojovém kódu.
- Po každém vydání platformy, které mění uživatelské rozhraní nebo chování, se
  nápověda projde a podtitul i patička se v obou jazycích aktualizují.
- Symbol a favicon jsou kopie exportů z `docs/brand` v repozitáři platformy a
  barvy (`--green`, krémová, espresso, akcent) odpovídají tamním barvám značky.
  Symbol se nepřekresluje ani nevektorizuje; při změně značky se soubory v
  `public/brand/` a `public/favicon.ico` znovu zkopírují.
