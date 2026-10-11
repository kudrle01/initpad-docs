# InitPad Docs

Uživatelská nápověda veřejné edice [InitPadu](https://github.com/kudrle01/initpad).
Statická stránka bez build kroku: vše, co se zveřejňuje, je ve složce `public/`.

## Úprava a náhled

```bash
python3 -m http.server 4178 --bind 127.0.0.1 --directory public
```

Stránka je pak na `http://localhost:4178`.

## Nasazení

Cloudflare nasazuje větev `main` po každém pushi jako Worker, který jen
servíruje statické soubory. Co a odkud se nasazuje, určuje `wrangler.jsonc`.
Nastavení projektu v Cloudflare:

| Položka        | Hodnota                |
| -------------- | ---------------------- |
| Project name   | `initpad-docs`         |
| Build command  | prázdné                |
| Deploy command | `npx wrangler deploy`  |
| Root directory | `/`                    |

Název projektu se musí shodovat s `name` ve `wrangler.jsonc`, jinak nasazení
selže.

Soubor `public/_headers` nastavuje bezpečnostní hlavičky. Stránka nenačítá
žádné skripty ani zdroje z jiných adres; kdo je přidá, musí upravit i
`Content-Security-Policy`.

## Pravidla obsahu

- Nápověda popisuje vydanou verzi platformy. Verze je uvedena v podtitulu a v
  patičce; chování, které platí až od novější verze, to musí mít u sebe napsané.
- Názvy tlačítek odpovídají českému slovníku aplikace
  (`apps/web/src/i18n/cs.ts` v repozitáři platformy).
- Po každém vydání platformy, které mění uživatelské rozhraní nebo chování, se
  nápověda projde a podtitul i patička se aktualizují.
