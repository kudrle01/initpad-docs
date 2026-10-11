# InitPad Docs

Uživatelská nápověda veřejné edice [InitPadu](https://github.com/kudrle01/initpad)
v češtině a angličtině. Statické stránky bez build kroku: vše, co se zveřejňuje,
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
`limitations`.

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
žádné skripty ani zdroje z jiných adres a styly berou jen ze souboru
`guide.css`, ne z atributů `style` nebo bloků `<style>`. Kdo to změní, musí
upravit i `Content-Security-Policy`.

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
