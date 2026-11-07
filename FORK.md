# Fork de OpenAgents para Openews

Este repo (`gastonzarate/openagents`) es nuestro fork de
[openagents-org/openagents](https://github.com/openagents-org/openagents): la
plataforma sobre la que corre la redacción de Openews (repo `openews`, que lo usa
en `vendor/openagents`). Acá se desarrolla el producto.

## Ramas

| Rama | Para qué | Reglas |
|---|---|---|
| `main` | **Rama principal del producto.** Lo que corre en Openews | Solo entra por PR. Siempre verde: tests y `tsc` |
| `feat/*`, `fix/*`, `chore/*` | Un cambio cada una | Salen de `main` y vuelven a `main` por PR |
| `sync/upstream-AAAA-MM-DD` | Traer lo nuevo de upstream | Merge de `upstream/develop` en una rama desde `main`, PR a `main` |
| `develop` | Espejo local de `upstream/develop` | No se commitea encima |
| `upstream/<tema>` | Aportes para mandar a openagents-org | Salen de `upstream/develop`, PR al repo original |

## Remotos

```sh
git remote -v
# origin    git@github.com:gastonzarate/openagents.git   (nuestro fork)
# upstream  https://github.com/openagents-org/openagents (solo lectura: push deshabilitado)
```

## Flujo de trabajo

```sh
git switch main && git pull
git switch -c feat/mi-cambio
# ... commits chicos, mensajes estilo Conventional Commits:
#     feat(scope): ..., fix(scope): ..., chore: ..., test: ..., docs: ...
git push -u origin feat/mi-cambio
gh pr create --base main --repo gastonzarate/openagents
```

Antes de abrir la PR:

```sh
(cd workspace/frontend && npx tsc --noEmit -p . && npx vitest run)
(cd packages/agent-connector && npm test)
```

## Sincronizar con upstream

Merge, no rebase: `main` está publicada y otros clones dependen de su historia.

```sh
git fetch upstream
git switch -c sync/upstream-$(date +%F) main
git merge upstream/develop      # resolver conflictos, correr los tests
git push -u origin HEAD && gh pr create --base main --repo gastonzarate/openagents
```

## Aportar algo a upstream

Lo que sirve a cualquiera (no solo a Openews) se manda también al repo original,
desde una rama basada en `upstream/develop`, con `git cherry-pick` de los commits
de `main`. Ejemplo: el adaptador de Kiro (PR #907, mergeada).

## Diferencias con upstream

Mantener esta lista al día: es lo que hay que cuidar en cada sync.

| Cambio | Archivos | ¿Para upstream? |
|---|---|---|
| Vista opcional "Agent map" en el dashboard (iframe a `NEXT_PUBLIC_AGENT_MAP_URL`; oculta si no está) | `workspace/frontend/components/agent-map/`, `components/layout/*`, `lib/i18n/messages/*` | Posible, es genérica |
| Kiro: no retomar una sesión si cambió el perfil o el prompt del agente | `packages/agent-connector/src/adapters/kiro.js`, `test/kiro.test.js` | Sí (es un bug del adaptador) |

## Tests que fallan también en upstream

Al crear `main` (upstream `66b1a313`) fallan, con o sin nuestros cambios:
`components/connect/device-expansion.test.ts`, `components/chat/yumi-agent-location.test.ts`
(frontend) y 4 de `packages/agent-connector` (preflight de OpenCode y detección de
sesión de Claude Code: dependen de credenciales instaladas en la máquina).
