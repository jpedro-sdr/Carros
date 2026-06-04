# Carros

Marketplace MVP para conectar vendedores e compradores de carros. Dados no [Supabase](https://krgnbftsobecdcrglmkj.supabase.co); deploy estático no **GitHub Pages**.

## Funcionalidades

- Publicar anúncio (aberto a qualquer pessoa) com até **10 fotos**
- Busca e filtros: região, cidade, marca, modelo, ano, preço
- Manifestar interesse (e-mail + telefone)
- **Admin privado** (`/admin`): lista interesses + dados do vendedor para contato manual

## Stack

- Next.js 15 + Tailwind CSS 4
- Supabase (Postgres, Storage, Edge Function `admin-interests`)

## Configuração local

1. Copie `.env.example` para `.env.local` e preencha:

```env
NEXT_PUBLIC_SUPABASE_URL=https://krgnbftsobecdcrglmkj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_ou_publishable
```

2. No Supabase → **Edge Functions** → Secrets, crie:

```
ADMIN_SECRET=um_segredo_longo_aleatorio
```

Use o **mesmo valor** ao abrir `/admin` no site.

3. Instale e rode:

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

### Erro `Cannot find module '../chunks/ssr/[turbopack]_runtime.js'`

Isso costuma ser cache `.next` misturando **Turbopack** com build normal. Corrija assim:

```bash
# Pare o servidor (Ctrl+C), depois:
Remove-Item -Recurse -Force .next   # PowerShell
npm run dev                         # usa webpack (estável)
```

Use `npm run dev:turbo` só se quiser Turbopack — sempre apague `.next` ao alternar.

### Testes E2E (todas as rotas)

```bash
npm run test:e2e
```

Cobre `/`, `/anuncios`, `/publicar`, `/admin`, `/anuncios/ver` e navegação entre páginas.

## GitHub — repositório e deploy

### 1. Secrets do repositório

Em **Settings → Secrets and variables → Actions**, adicione:

| Secret | Valor |
|--------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://krgnbftsobecdcrglmkj.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anon ou publishable (Dashboard → API) |

### 2. GitHub Pages

Em **Settings → Pages → Build and deployment**, escolha **GitHub Actions**.

Após o push em `main` e o workflow **Deploy GitHub Pages** concluir, o site público fica em:

**https://jpedro-sdr.github.io/Carros/**

Confira em: repositório → **Actions** → workflow verde → aba **Deployments**.

(ajuste se o nome do repositório for outro — o `basePath` no CI é `/Carros`.)

### 3. Workflows

- `ci.yml` — lint + build em PR/push
- `deploy-pages.yml` — publica em GitHub Pages

## Supabase

- Projeto: **Carros** (`krgnbftsobecdcrglmkj`)
- Tabelas: `listings`, `listing_photos`, `interests`
- Bucket: `listing-photos` (público leitura)
- Edge Function: `admin-interests` (header `x-admin-secret`)

## Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Home |
| `/anuncios` | Listagem + filtros |
| `/anuncios/ver?id=` | Detalhe + interesse |
| `/publicar` | Novo anúncio |
| `/admin` | Interesses (privado) |

## O que mais você pode precisar

- **ADMIN_SECRET** no Supabase (obrigatório para admin)
- **Secrets no GitHub** (obrigatório para deploy)
- Opcional depois: domínio customizado, Auth para vendedores, região `sa-east-1` no Supabase

## Licença

MIT
