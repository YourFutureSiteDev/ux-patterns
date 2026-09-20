# Settings System

> Your settings page is harmless until the last section. Settings is a system.

Rebuilt from the @designmotionhq reel. Source: [designmotionhq.com/patterns/settings-system](https://www.designmotionhq.com/patterns/settings-system) · [Instagram](https://www.instagram.com/reel/DbX0IKMtBKr/) (109K views). Category: forms.

## The rule

Match each setting's apply model to its stakes, group by task, make it searchable, mark what changed with a per-setting reset, and wall off the destructive actions behind typing the resource name.

## Key insights

- Match the apply model to the blast radius. Light toggles commit instantly with a saved confirmation, while identity fields like email demand an explicit Save/Cancel that a real click completes.
- Group by task, not org chart. A flat list of twenty rows becomes three scannable sections the moment it mirrors user intent instead of your data model.
- Make it searchable. Power users never scroll, they search, and one query beats digging through six nested menus.
- Give every changed value a modified indicator plus a per-setting reset, so someone can revert one override without nuking the rest.
- Quarantine destructive actions. Put delete behind a visual wall at the bottom of the page, and gate it behind typing the exact resource name so a stray click can't fire it.
- Collapse advanced options behind an expandable section, keeping the common path short while the depth stays one click away.

## Do / Don't

- **Do:** match a setting's apply model to its stakes: instant for low-risk toggles, explicit save for identity.
- **Do:** require typing the resource name before an irreversible delete goes through.
- **Do:** surface a reset affordance next to any value the user has changed.
- **Don't:** pour every option into one flat list ordered by your schema.
- **Don't:** let irreversible actions fire on a single unguarded click.
- **Don't:** bury settings in nested menus when a search box would find them instantly.

## Scenes (demo.html)

| # | t | Scene | What it shows |
|---|---|---|---|
| 1 | 0s | Most of it is harmless. | Settings page scrolls past Preferences, Account, Security, Workspace to a red Danger zone. |
| 2 | 3s | Apply model | Preferences toggles "Applies instantly"; Account email edit shows "You have unsaved changes" with Cancel / Save. |
| 3 | 12s | Structure | "one flat list" of Setting 9 to 18, then "grouped by task": Notifications, Billing, Advanced (Webhook signing, API version, Data export). Stripe-style tabs. |
| 4 | 21s | Search | Full list, then "digest" filters to Email digest with breadcrumb, "39 settings hidden", "Enter opens it". |
| 5 | 30s | Modified state | Appearance: Theme and Font size dotted and resettable, "2 modified", settings.json diff bars. |
| 6 | 39s | Danger zone | Danger zone pinned last, then "Delete acme-workspace?" modal with the name typed 14/14 before "Delete forever" arms. |
| 7 | 48s | Outro | Settings is a system: five rules, @designmotionhq, Follow. |

## Use the component

```html
<link rel="stylesheet" href="pattern.css">
<div class="ss">
  <button class="ss-toggle" id="dark"></button>
  <div class="ss-input"><input id="email" value="sarah@acme.co"></div>
  <div class="ss-unsaved" id="bar">You have unsaved changes<span class="spacer"></span><button class="ss-btn ss-btn--ghost" id="cancel">Cancel</button><button class="ss-btn ss-btn--teal" id="save">Save</button></div>
  <div class="ss-modal"><div class="ss-input"><input id="confirm"></div><button class="ss-btn ss-btn--delete" id="forever">Delete forever</button></div>
</div>
<script type="module">
  import { InstantToggle, ExplicitForm, SettingsSearch, ModifiedSettings, DangerConfirm, Collapsible } from './pattern.js';
  InstantToggle(dark, { commit: on => fetch('/api/prefs', { method: 'PATCH', body: JSON.stringify({ dark: on }) }) });
  ExplicitForm({ input: email, bar, save, cancel, commit: v => fetch('/api/account', { method: 'PATCH', body: JSON.stringify({ email: v }) }) });
  DangerConfirm({ input: confirm, name: 'acme-workspace', button: forever, onConfirm: () => fetch('/api/workspace', { method: 'DELETE' }) });
</script>
```

`InstantToggle` commits on click and fires `ss:saved`. `ExplicitForm` stages edits, shows the unsaved bar, and only Save commits. `SettingsSearch` filters rows, highlights the match and opens the first hit on Enter (`ss:filter` reports hidden count). `ModifiedSettings` dots changed rows, shows reset buttons and counts "N modified". `DangerConfirm` arms the delete button only when the typed name matches exactly. `Collapsible` runs the Advanced section.

## Where it belongs

Any settings, preferences or account page. Toggles and selects apply instantly; email, password, billing and ownership go behind explicit Save; delete, transfer and export-everything live in the danger zone at the bottom.
