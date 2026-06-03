---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish', 'step-12-complete']
workflow_completed: true
workflow_completion_date: '2026-04-25'
classification:
  projectType: mobile_app
  domain: general
  complexity: medium
  projectContext: greenfield
  customConcerns:
    - theological_accuracy
    - multilingual_i18n
    - audio_content_pipeline
    - donation_flow_with_pay_forward
    - app_store_religious_content_review
    - privacy_first_no_tracking
inputDocuments:
  - '_bmad-output/brainstorming/brainstorming-session-2026-04-24-0032.md'
  - '~/.claude/projects/-Users-lawrence-Desktop-projects-arokia/memory/project_arokia.md'
  - '~/.claude/projects/-Users-lawrence-Desktop-projects-arokia/memory/feedback_arokia_theology.md'
documentCounts:
  briefs: 0
  research: 0
  brainstorming: 1
  projectDocs: 0
  projectMemory: 2
projectType: 'greenfield'
workflowType: 'prd'
---

# Product Requirements Document — Arokia

**Author:** Lawrence
**Date:** 2026-04-24

## Executive Summary

Arokia is a Tamil-first Christian mobile application (React Native, iOS + Android) that helps Christians return to the authentic words of Jesus and live in mind-body-soul wholeness. The launch audience is **Tamil-speaking Christians of every age, walk of life, and Christian denomination** — young students, working professionals, mothers and fathers, elderly grandparents, urban diaspora and rural villagers, Catholic and Protestant and Pentecostal alike. The product is designed to meet each of them where they are: anxious working professionals on the commute, grandmothers who only press one button, mid-life parents stretched thin, young Christians integrating their faith roots into modern life, and pastors seeking quiet refuge from ministry burnout. The roadmap extends to Hindi, Telugu, and other Indian languages once Tamil product-market fit is established — at which point Arokia serves Christians across the Indian subcontinent and beyond.

The deeper problem Arokia addresses is not the absence of a Christian meditation app in Tamil — it is the drift of contemporary Christianity from Jesus's actual teachings amid an era of false teachers, prosperity-gospel showmanship, and engagement-farming Christian content. Arokia reframes the meditation-app category from "wellness through inner work" to "wholeness through Jesus's authentic words" — anchored in the New Testament with red-letter text (Jesus's direct quotes) as the primary content source. The product is donation-funded with no advertising, no paywalls, no push notifications, and a mandatory 10% pay-it-forward of every rupee donated to named Tamil Christian community causes.

> **Arokia** is a Tamil-first Christian app for wholeness — in mind, body, and soul — through the authentic words of Jesus. In a noisy age of false teachers and engagement-farming, Arokia is a quiet tool that returns you to Scripture, not to itself.

### What Makes This Special

Arokia inverts the standard Christian-app playbook on every axis. Where competitors (Soultime, Amen, Relm, Good News Christian Meditation) optimize for engagement, English-first localization, paraphrased "Christian wisdom," and celebrity-pastor amplification, Arokia optimizes for **fidelity**: verbatim scripture with mandatory verse attribution, Tamil-first cultural identity, theological humility expressed in a binding Opening Vow (*"This app is not Jesus"*), and a refusal to amplify any voice except Scripture itself.

The core insight: most Christian-tech products treat language as a localization layer and theology as marketing copy. Arokia treats language as cultural identity (Tamil Shepherd's Voice, keerthanai instrumentation, Kaalai/Maalai Jabam rhythms) and treats theology as the architecture — four pillars (The Word · The Walk · Hope·Faith·Love · Integrity) that survive any language change. Ten signature features make the inversion visible: red-letter-first content, verbatim-only quotation, glass-wall donation budget, pay-it-forward 10%, no ads/notifications/paraphrasing, Tamil Lectio Divina silence, and WhatsApp voice delivery for offline-elderly users.

Why users choose Arokia over alternatives: Tamil Christians receive content that feels native rather than translated; theologically careful Christians receive verbatim scripture with no AI-generated Jesus impersonation; donors receive full transparency on every rupee allocated, including a 10% community commitment; mid-life women, elderly grandmothers, and Tamil migrants receive distinct modes built for their actual lives.

## Project Classification

**Project Type:** `mobile_app` — React Native cross-platform application targeting iOS and Android with offline-capable audio playback, intentionally no push notifications, and Apple App Store + Google Play Store distribution.

**Domain:** `general` (with custom non-regulatory concerns) — theological accuracy as mission-critical content review, multilingual i18n architecture (Tamil → Hindi → Telugu → others), audio content pipeline (ElevenLabs Tamil generation with Supabase storage caching), donation flow with automatic pay-it-forward 10% allocation, App Store religious-content review readiness, and privacy-first design with no third-party tracking or advertising.

**Complexity:** `medium` — low domain regulatory burden, but medium engineering complexity from i18n-from-day-one, audio pipeline, automated donation allocation, and multi-platform delivery on a solo-developer time and budget.

**Project Context:** `greenfield` — no existing codebase; full architectural design freedom; foundation-first engineering ethos with explicit goal of supporting long-term scale to additional Indian languages and future contributor onboarding.

## Success Criteria

### User Success

Arokia measures user success not through engagement (time-in-app, daily streaks, push notifications opened) but through **fidelity outcomes** — did the user encounter Jesus's authentic words, grow in mind-body-soul wholeness, and leave the app to live the Christian life it points them toward?

**User success indicators:**

- A Tamil Christian opens Arokia and completes the Opening Vow on first launch (acknowledgment rate ≥85%, indicating users accept the theological framing rather than dismiss it).
- Users who begin a meditation complete it (meditation completion rate ≥80%, indicating the content holds attention without manipulative design).
- A user taps the Bible-first hand-off link at the end of a meditation (≥30% of completed meditations result in scripture-link tap, indicating the app successfully points outward).
- A user encounters at least 10 distinct red-letter Jesus quotes in their first month (content exposure metric, more meaningful than session count).
- A user returns to Arokia weekly, not daily (target: 60-70% week-2 retention; deliberately not pushing for daily because that signals church/Bible substitution).
- A user marks "Attended worship this Sunday" in the optional tracker (target: 50% of weekly-active users; this is the only "engagement" metric Arokia celebrates).
- Users share Arokia content with family via WhatsApp (≥15% of monthly-active users share, indicating community trust).
- Tamil voice quality is rated ≥4.5/5 in feedback prompts (audio fidelity is the user's primary content interface).

### Business Success

For Arokia, "business success" means **mission sustainability + ministry impact**, not profit. The product is donation-funded with mandatory 10% pay-forward; success is measured by viability (does it cover its costs?) and outward generosity (did the app's existence fund Tamil Christian community work?).

**3-month success (post-launch):**

- App live on Apple App Store and Google Play Store.
- 500-1,000 monthly active Tamil Christian users.
- ₹3,000-10,000/month in donations — covers running costs (servers + AI + dev time).
- First named pay-it-forward beneficiary fully funded (≥₹3,000 disbursed transparently).
- 3+ Tamil Christian advisors actively engaged in content review and theological vetting.
- Zero theological-accuracy complaints requiring content withdrawal.

**12-month success:**

- 5,000-15,000 monthly active Tamil Christian users.
- ₹50,000-150,000/year in cumulative donations.
- ₹5,000-15,000 paid forward to Tamil Christian causes (rotating beneficiaries every quarter, all named transparently).
- 3-5 community-contributed Tamil voices live in production (beyond AI), including at least one female voice.
- 5+ Tamil pastors/theologians have formally reviewed content; advisory board of 3-5 named publicly.
- Architectural foundation validated for Hindi/Telugu addition — proven by a working prototype of the Hindi layer (not yet released to public).
- Zero ads served. Zero push notifications sent. Zero scripture paraphrased.

### Technical Success

- **Performance:** App boots in ≤2 seconds on mid-range Android devices (target: 4GB RAM, Android 11+).
- **Reliability:** Production crash rate ≤0.1% per session.
- **Offline-capability:** Audio playback works fully offline after first download; meditation library is fully usable without internet for a week of pre-cached content.
- **Audio quality:** Tamil ElevenLabs audio passes user testing (≥4.5/5 quality rating); real human voice migration path proven by v1.1.
- **App-store standing:** ≥4.5 stars on both Apple App Store and Google Play within 6 months.
- **Architectural extensibility:** Adding a new language (Hindi) requires content work + 1-2 weeks of localization, not architectural rewrite. Validated by Hindi prototype within 12 months.
- **Privacy:** Zero third-party trackers in production. Zero PII stored beyond email-for-donation-receipts. Razorpay handles all financial PII.
- **Theological enforcement (architectural):** 100% of scripture content stored with mandatory verse-reference field; UI cannot render scripture without rendering its source.
- **Donation accuracy:** Pay-it-forward 10% allocated atomically with each donation transaction; reconciled monthly with public glass-wall budget.

### Measurable Outcomes

| Outcome | Target (Month 3) | Target (Month 12) |
|---|---|---|
| Monthly Active Users (MAU) | 500-1,000 | 5,000-15,000 |
| Meditation completion rate | ≥75% | ≥80% |
| Bible-link tap-out rate | ≥25% | ≥30% |
| Week-2 retention | ≥50% | ≥60% |
| Monthly donations (₹) | 3k-10k | 50k-150k/yr cumulative |
| Pay-it-forward disbursed (₹) | ≥3k cumulative | ≥5k-15k cumulative |
| Crash rate | ≤0.5% | ≤0.1% |
| App-store rating | ≥4.0 | ≥4.5 |
| Production trackers/ads | 0 | 0 |
| Theological complaints upheld | 0 | 0 |

## Product Scope

### MVP Content Specification (60-75 day build)

- 50 Jesus quotes from the Gospels (red-letter) — Tamil audio (ElevenLabs) + Tamil text + verse reference.
- 15 meditations across the Triune Home Screen (5 × Mind / 5 × Body / 5 × Soul) — 5-7 min each, Tamil audio + keerthanai instrumentals.
- 5 anxiety-type scripture meditations (anxious / grieving / angry / lonely / tempted).
- 1 "Silence Between the Words" Lectio Divina track.

*MVP capabilities, infrastructure, and phased roadmap (v1.1 and v2+) are detailed in the Project Scoping section.*

### Permanent Non-Features

These are product commitments, not MVP trade-offs. They do not ship in any version:

- No push notifications.
- No advertising (ever).
- No paywall or subscription tiers.
- No engagement streaks for self-practice.
- No celebrity-pastor or influencer content.
- No AI-as-Jesus persona, paraphrase, or first-person "I, Jesus" voice.
- No third-party tracking SDKs (no Google Analytics, Mixpanel, Facebook SDK).
- No paraphrased scripture.
- No Sabbath app-lock.

## User Journeys

**Framing.** Arokia is for **all Tamil Christians** — every age, walk of life, and Christian denomination. The journeys below are representative slices across age (23 → 62), gender, denomination (Catholic, Protestant, Pentecostal, CSI Anglican, seminary student), region (Madurai, Chennai, Coimbatore, Bangalore), and life-situation (student, working professional, parent, caregiver, elder, founder, theologian-in-training). Together they exercise the core capabilities Arokia must deliver in v1. Other Tamil Christian audiences (kids, teens, Gulf migrants, persecuted Christians, pastors-in-burnout, bedridden) are real and valued — their dedicated journeys live in v1.1+ planning, not v1.

### Journey 1 — Selvi (62), Tamil Catholic Grandmother in Madurai

*Elderly user · One-button accessibility · No-account flow · Hardest UX target — if Selvi can use it, anyone can.*

**Opening Scene.** Selvi was widowed eight years ago. She lives alone in a one-bedroom flat near the Vandiyur tank in Madurai. Her daughter in Singapore sent her a smartphone last Diwali, gentled her into using WhatsApp, and worries she's lonely. Selvi grew up Tamil Catholic — every January she still rides to Velankanni for the Arokia Matha festival. Her eyes are failing; reading her old Tamil Bible takes longer than her patience holds. Most mornings she sits with chai and the silence and a quiet ache.

**Rising Action.** On a Thursday morning, her daughter sends her a WhatsApp link: *"Amma, try this app — it's in Tamil, and Lawrence (her cousin's son) made it."* Selvi taps the link. The app installs. It opens with a soft off-white screen. Tamil words appear — *"வருத்தப்பட்டுப் பாரஞ்சுமக்கிறவர்களே…"* — Matthew 11:28, Jesus's words. Below it, in plain Tamil: *"This app is not Jesus. We carry His words — we do not speak them."* She reads. She presses the [ ஆமென் — தொடங்கு ] button.

**Climax.** She arrives at a screen with three simple choices: 🧠 மனம் / 💪 உடல் / 🕊️ ஆத்மா. She doesn't understand the icons but the Tamil words she does. She taps "ஆத்மா" (Soul). One large button: *"இன்றைய வார்த்தை"* — "Today's Word." She taps. A warm Tamil voice — not too young, not too old — begins reading from the Gospel of John. She listens. Twelve minutes pass. She doesn't move.

**Resolution.** Every morning since, she presses the same one button. Sometimes she taps "மனம்" instead, when her chest feels tight. Once she tapped a small link at the end of a meditation — it offered to open the full chapter in her Tamil Bible app — and she read for twenty minutes. She has not yet figured out the donation page. She does not need to.

**Capabilities revealed:** First-launch onboarding with non-skip Opening Vow, Triune home navigation with one-tap-deep paths, Tamil-first audio with lockscreen control, Bible-first hand-off, large-tap-target accessibility ("Grandma's One-Button mode"), no-account-required flow.

### Journey 2 — Anand (34), Tamil Protestant IT Worker in Chennai

*Working-age commuter · Anxiety entry point · Donor profile · Engaged-not-addicted use*

**Opening Scene.** Anand commutes 90 minutes each way on the Chennai metro to a tech company in OMR. His wife is a college lecturer; their two kids are 5 and 7. His parents live in a village near Madurai; his father has heart trouble. The mortgage is real; the layoff rumors are real. He attends Tamil Protestant church on Sundays with his family but lately sits through the sermon scrolling LinkedIn. At 3am sometimes he wakes with a tightness in his chest and a phone in his hand.

**Rising Action.** A church friend mentions Arokia in their fellowship WhatsApp group. Anand installs it on a Sunday afternoon. He completes the Opening Vow with mild skepticism and clicks through. He sees the Triune screen and taps "மனம்" (Mind). He scrolls past the meditation list and finds *"Anxiety Library"* — a list of 5 anxiety types in Tamil. He taps "கவலை" (worry). The meditation is built around Matthew 6:25-34 in Tamil. Seven minutes long. He plays it on his commute the next morning, headphones in, eyes closed, train rumbling.

**Climax.** A month later he is in the middle of the *"Do Not Be Anxious" 21-Day Track* — one Tamil meditation per day, slowly walking through the same passage. On day 14 he hears Jesus's words *"Sufficient unto the day is the evil thereof"* in Tamil and something in his chest unclenches. He marks "Attended worship" the next Sunday — the first time in three months he's felt fully present in church. That evening he opens Arokia, taps the donation page, and sets up a ₹500/month recurring contribution. The Glass-Wall Budget shows him: *"₹50 of your ₹500 funds the Vadapalani church choir this quarter."*

**Resolution.** Six months in, Anand still uses Arokia weekly — not daily; the app deliberately doesn't push him to. He has never seen an ad. He has never received a notification. He shared the Forgiveness 14-Day Journey with his wife last month. They listen together at night, sometimes in silence afterward.

**Capabilities revealed:** Anxiety-type → scripture matcher, multi-day course/track engine, audio playback with offline cache for commute use, donation flow with recurring + transparent allocation, Glass-Wall Budget with named beneficiary visibility, optional church-attendance tracker (no streaks), share-to-WhatsApp.

### Journey 3 — Priya (23), Tamil CSI Software Engineer in Bangalore

*Young adult · Working professional · Tamil-rooted but English-fluent · Identity integration*

**Opening Scene.** Priya graduated CS from Anna University last year. She's now at a Bangalore startup, six months in, living in a paying-guest accommodation with three other young women. Her parents in Madurai run a small printing shop. She grew up in a Tamil CSI (Anglican) church, attended Sunday school until college. In Bangalore she found a large English-speaking Pentecostal church and visits some Sundays — it's loud, the worship is rock-band style, and something in it feels untranslated from her childhood quiet. Her grandmother in Madurai used to pray Tamil prayers over her every visit. Her grandmother passed away last year.

**Rising Action.** Priya scrolls Instagram on a Tuesday night. Her cousin has shared an Arokia post. She installs out of curiosity. The Opening Vow surprises her — *"This app is not Jesus. We will never paraphrase His words."* She has been reading articles about social media rewiring her brain; the anti-noise framing of the Vow lands. She finishes it. The Triune home screen feels like architecture, not gimmick.

She taps "ஆத்மா" (Soul) and finds a meditation on Matthew 11:28. She plays it. The Tamil voice is not her grandmother's exactly — but it's a Tamil voice, gentle, unhurried, reading Jesus's words in the language her grandmother prayed over her. Priya cries quietly in her PG room.

**Climax.** Three weeks in, Priya has built a small evening rhythm: 10 minutes of Arokia after dinner, before sleep. She uses the topic-search feature to find verses on identity (Galatians 2:20, John 1:12) when her work pressure makes her doubt herself. She shares one meditation with her mother on WhatsApp. Her mother calls back: *"Where did you find this? It is your patti's Tamil."*

**Resolution.** Six months later, Priya still uses Arokia weekly. When v1.1 ships with the Diaspora Bridge Mode (Tamil ↔ English side-by-side reading), she'll move to that — she wants to read Jesus's words in both her Tamil heart and her English mind, side by side. She has not donated yet — she's still on a starter salary — but she shares Arokia with three friends in her PG. They install too.

**Capabilities revealed:** Topic-search across content library (not just chronological browse), Tamil audio that reaches younger users without "ammai" framing, share-to-WhatsApp with reach beyond original installer, v1.1-readiness for Diaspora Bridge Mode (bilingual reading), no-pressure non-donation engagement (Arokia must work for users who can't yet contribute financially).

### Journey 4 — Mary (47), Tamil Pentecostal Schoolteacher in Coimbatore

*One representative slice of mid-life, multi-feature use, prayer-partner accountability*

**Note:** Mary is **one** mid-life Tamil Christian experience among many. Other mid-life Tamil Christians (a male shopkeeper, a nurse, a stay-at-home father, a recent widow) would have different journeys with the same architecture. Mary is included because her use exercises the broadest set of v1 capabilities.

**Opening Scene.** Mary teaches English at a girls' school. Her husband works in Bangalore and visits monthly. Her mother (78, diabetes, BP) lives with her — Mary is the primary caregiver. Her two children are in college, struggling with their own quiet anxieties. Mary leads the women's prayer group at her Tamil Pentecostal church. She is "the strong one" in three families simultaneously, and exhausted. She prays often but increasingly for everyone except herself.

**Rising Action.** Her sister-in-law sends her the Arokia app one Saturday afternoon. Mary installs it during her mother's nap. The Opening Vow stops her — *"This app is not Jesus."* It feels honest. She finishes the vow.

She tries the *"Walk with Jesus"* — a 20-minute Tamil walking meditation paced to a verse-and-step rhythm. She walks the colony park that evening, headphones in, and prays for the first time in weeks for *herself*. She tries *Kitchen Meditation* — a 5-minute audio that plays while she chops vegetables for dinner. She tries the *Hymn Breathwork* that paces breath to a familiar Tamil keerthanai melody she knows from childhood.

**Climax.** Three weeks in, she invites her three closest women's-group friends into a *Check-In Circle* through Arokia. They share a verse each Sunday afternoon and pray for one another silently. Mary's mother walks past, peering at the phone, and says quietly in Tamil: *"This is good for you."* Mary cries. Her mother does not see.

**Resolution.** Mary now uses Arokia in three rhythms: Walk with Jesus on her evening walk (Body), Hymn Breathwork during anxiety spikes when her mother's BP rises (Mind), Tamil Lectio Divina before sleep (Soul). She has set up monthly ₹300 donations. When v1.1 ships, she'll be the first to download Bedtime Jesus Stories for her cousin's kids.

**Capabilities revealed:** Multi-track concurrent usage (Mind/Body/Soul as separate but unified paths), audio designed for hands-busy contexts (walking, cooking), keerthanai-paced breathwork tracks, prayer-partner Check-In Circles (lightweight social, opt-in), donation as a core invitation not a paywall.

### Journey 5 — Lawrence (Founder), Operating Arokia Solo

*Admin/Operator · Founder's weekly maintenance loop*

**Opening Scene.** Sunday evening. Lawrence has 90 minutes between dinner and his weekly church preparation. His Arokia operations workflow is small but deliberate.

**Rising Action.** He opens the Sentry dashboard — zero new errors this week. He opens Supabase admin — content table shows 53 Jesus quotes (3 added this month), 17 meditations live, 1,240 monthly active users. He opens Razorpay dashboard — ₹4,800 received this month from 14 donors, ₹480 flagged for pay-it-forward. He opens his Glass-Wall Budget markdown file (committed in git) — updates: *"Servers ₹600 · ElevenLabs ₹0 (free tier) · Dev time ₹0 (founder) · Pay-It-Forward ₹480 to Madurai Mercy Home (Q2 named beneficiary)."* He commits the file. The static site deploys. Within five minutes the live About page reflects the new numbers.

**Climax.** He receives an email: an advisor — Pastor Ramesh, his home church pastor and one of the three named advisors — has flagged a verse attribution issue. *"The Tamil rendering of Matthew 5:9 in your meditation #7 uses the older translation; recommend updating to current Tamil OV."* Lawrence verifies, updates the database row, regenerates that one ElevenLabs audio file (₹3 cost), tests on his phone. Fixed in 15 minutes.

**Resolution.** Lawrence closes his laptop. The app maintains itself for another week with minimal intervention. The advisory feedback loop is working. The pay-it-forward is real. No ads were served. No one was tracked.

**Capabilities revealed:** Sentry-based error monitoring, Supabase admin for content management (no custom admin UI in v1 — direct DB access is sufficient at this scale), donation reconciliation with auto-allocation flag, Glass-Wall Budget as version-controlled markdown rendering on the About page, ElevenLabs single-track regeneration without batch reprocessing, advisor email-feedback workflow (no in-app submission portal in v1).

### Journey 6 — Ravi (24), Tamil Seminary Student Reporting a Concern

*Support · Theological integrity loop · User-driven correction*

**Opening Scene.** Ravi, a Tamil seminary student in Bangalore, is using Arokia for his daily devotion. On meditation #11, he hears the Tamil voice render John 3:16 with a subtle nuance that doesn't match his Tamil OV Bible. He pauses.

**Rising Action.** He opens the About page. He scrolls to a small but clearly visible section: *"Found a concern? Tell us. Theological accuracy matters."* He taps. A simple form opens (no login required) — three fields: which meditation, what's the concern, his name and email (optional). He writes the concern in two paragraphs. He submits.

**Climax.** Ravi receives an automated reply: *"Thank you. Your concern has been logged and will be reviewed by our advisory board within 7 days. If confirmed, the audio will be corrected and a public note will appear in our next Glass-Wall Budget update."* Three days later: a personal email from Lawrence — *"Ravi, you were right. We've corrected the Tamil rendering and re-generated the audio. Thank you."* Ravi opens Arokia, plays meditation #11, hears the corrected version.

**Resolution.** A week later, Ravi sees the next Glass-Wall Budget update: *"Theological correction this quarter: Meditation #11 audio updated per advisor + community feedback. Verbatim Tamil OV rendering restored."* Ravi shares Arokia with his seminary cohort.

**Capabilities revealed:** In-app concern-submission form (lightweight; no auth required), email-based notification workflow, advisory review SLA (7 days), public correction-disclosure pattern in Glass-Wall Budget updates, individual-track audio regeneration capability.

### Journey Requirements Summary

| Capability Area | Journeys That Require It |
|---|---|
| Non-skip Opening Vow with i18n support | All journeys |
| Triune (Mind/Body/Soul) home navigation | Selvi, Anand, Priya, Mary |
| Tamil audio playback (background, lockscreen, offline) | All user journeys |
| One-tap-deep "elder mode" UX | Selvi |
| Anxiety-type → scripture matcher | Anand |
| Multi-day course/track engine | Anand |
| Topic-search across content library | Priya, all power users |
| Walking/cooking-aware audio (hands-busy contexts) | Mary |
| Keerthanai-paced breathwork content | Mary |
| Prayer-partner Check-In Circles (opt-in) | Mary |
| Razorpay donation flow | Anand, Mary (and any donor) |
| Non-donation user value path | Priya (early-career, can't yet donate) |
| Auto pay-it-forward 10% allocation flag | All donors |
| Glass-Wall Budget rendering (version-controlled markdown) | Lawrence, all donors |
| Optional church-attendance tracker (no streaks) | Anand |
| Share-to-WhatsApp from any meditation | Anand, Priya, Mary |
| In-app concern-submission form (no auth) | Ravi |
| Bible-first hand-off link to external Tamil Bible | All meditation completions |
| Always-on verse attribution (UI-enforced) | All scripture displays |
| Advisor-feedback email workflow | Lawrence, advisors |
| Per-track audio regeneration | Theological correction loop |
| Sentry error monitoring + Supabase admin | Lawrence (operations) |

## Domain-Specific Requirements

### Compliance & Regulatory

**App Store (Apple App Store + Google Play)**

- Religious content must not make exclusive factual claims about other religions or present comparative-religion framing — no syncretism in content descriptions or metadata.
- Donation/contribution features require transparent in-app disclosure; Razorpay flow launches in external browser/webview to avoid App Store in-app purchase revenue share on donations.
- Content appropriate for all ages (COPPA-compliant for any under-13 usage). App carries 13+ age rating on all stores at launch — simplest path for email collection compliance.
- App Store review for religious apps: ecumenical framing (serving all Christians, not exclusive sect) reduces rejection risk; About page must support this framing.

**Payment Compliance (Razorpay)**

- Razorpay is an RBI-licensed payment aggregator; it handles PCI-DSS compliance for card processing.
- UPI transactions are subject to NPCI guidelines; Razorpay handles this.
- Recurring donations use RBI auto-debit mandate rules (UPI AutoPay or e-NACH); Razorpay manages mandate flow.
- Donation receipts at MVP stage are acknowledgment emails only — **not** 80G tax-exempt receipts. Tax exemption requires Section 80G trust registration, which is a post-MVP milestone. Receipts must be clearly labeled as acknowledgments, not tax receipts.

**Privacy Regulation**

- **DPDPA (India, 2023):** Arokia collects email addresses for donation receipt delivery — this is "personal data" under DPDPA requiring explicit, purpose-specific consent at the point of collection. No other PII is collected. Applies to all Indian users.
- **GDPR (EU):** Applies to Tamil diaspora users in the UK, EU, Germany, France, and elsewhere. Email-for-receipt qualifies as "legitimate interest"; no marketing emails without separate explicit consent.
- **COPPA (US):** 13+ age rating on all stores ensures no under-13 email collection without parental consent.

---

### Theological & Editorial Requirements

1. **Verbatim Scripture Only** — all scripture displayed or spoken in the app must be verbatim from the Tamil OV (Old Version) or a clearly stated equivalent translation. No paraphrasing, no summarizing, no "based on" language is permitted under any circumstance.

2. **Mandatory Verse Attribution (UI-Enforced)** — every scripture display (card, audio, meditation) must render the book, chapter, and verse reference. The scripture UI component must enforce this at the component level; a verse without its address is an invalid render state.

3. **No AI-as-Jesus Persona** — the app must never use first-person "I, Jesus" AI voice, never claim to represent what Jesus would say today, never paraphrase Jesus's words into modern idiom. The AI voice reads verbatim scripture; it never interprets, edits, or extends.

4. **Theological Advisory Review** — all content (meditations, commentary, study notes) must be reviewed by at least one named Tamil Christian advisor before publication. MVP launches with an advisory placeholder; named advisors must be publicly listed by month 3.

5. **Public Correction Disclosure** — if a theological or translation error is identified (wrong rendering, misattribution, incorrect verse), the correction must be publicly disclosed in the next Glass-Wall Budget update. The correction process is documented on the About page. Non-negotiable even if embarrassing.

6. **Strictly Christian Content** — no content from other religious traditions, no comparative-religion framing, no pairing of Jesus with teachers from other traditions (Thirukkural, Bhagavad Gita, Stoic philosophers, etc.). Keerthanai must be musically and spiritually Christian, never bhajan/mantra-adjacent.

7. **Ecumenical Inclusivity** — content must serve Catholic, Protestant, Pentecostal, CSI Anglican, and all Tamil Christian denominations without sectarian framing. Opening Vow and About page acknowledge the Arokia Matha heritage without favoring Catholics; content avoids denomination-specific doctrinal disputes.

8. **No False-Teacher Amplification** — no celebrity-pastor content, no prosperity-gospel framing, no influencer endorsements. All advisory board members must be vetted for theological fidelity to the New Testament.

---

### Technical Constraints

**Audio Pipeline**

- ElevenLabs Multilingual v2 generates all Tamil AI audio using a generate-once, cache-forever strategy. Each audio file is a permanent asset stored in Supabase Storage and CDN-cached.
- No audio regeneration except theological corrections or quality failures. Per-track regeneration must be possible without batch reprocessing.
- Audio format: MP3 at 128 kbps for voice content — balances quality, storage cost, and mobile bandwidth.
- Client-side local caching: the app pre-downloads one week of meditation content on first launch; playback works fully offline after initial download.

**Multilingual i18n Architecture**

- react-i18next from Day 1 on all UI strings; nothing hardcoded in components.
- Supabase content schema is language-agnostic from Day 1: the scripture table carries a `language_code` column. Adding Hindi content requires zero schema migration — only content data.
- No language-specific conditional code paths in UI components; all language branching goes through the i18n layer.

**Content Schema Fields Required from Day 1**

The following fields must exist in the content schema at MVP launch even if their v1.1 features are not yet built. Retrofitting schema after launch risks data migration cost and content re-entry.

| Field | Values | Used In |
|---|---|---|
| `language_code` | `ta`, `hi`, `te`, … | All content (multilingual) |
| `content_type` | `scripture_quote` / `meditation` / `sleep` / `lectio_divina` / `breathwork` / `reading_plan` | Drives category filtering and audio design spec selection |
| `time_of_day` | `morning` / `evening` / `any` | Kaalai/Maalai Jabam navigation (v1.1); all MVP content tagged `any` |
| `pillar` | `word` / `walk` / `hope_faith_love` / `integrity` | Triune home routing |
| `mood_tag` | `anxious` / `grieving` / `angry` / `lonely` / `tempted` / `none` | Anxiety library filtering |
| `verse_reference` | e.g., `Matthew 6:25` | Mandatory on all scripture content; UI layer enforces |
| `audio_url` | Supabase Storage path | All audio content |

**Privacy & Data Minimization**

- Zero third-party analytics SDKs in production: no Firebase Analytics, no Google Analytics, no Mixpanel, no Facebook SDK, no Amplitude.
- No user accounts required for core app functionality: content browsing, audio playback, and all meditations work without sign-in.
- Email collected only at donation flow for receipt delivery; no email marketing without explicit separate consent.
- Razorpay processes all financial PII; Arokia's database stores only: donation amount, timestamp, and pay-it-forward allocation flag.
- Quarterly dependency audit in CI to catch accidental third-party tracker introduction.

**Donation Flow Integrity**

- Pay-it-forward 10% allocation is computed and logged atomically at the time of each confirmed Razorpay webhook — never batch-reconciled retrospectively.
- Glass-Wall Budget is a version-controlled markdown file committed to git; each monthly update is a public, auditable record.
- Razorpay webhook confirms payment; the database donation record is created only on a confirmed, successful payment event.

---

### Integration Requirements

| Integration | Purpose | Plan at MVP | Free-Tier Limit | Notes |
|---|---|---|---|---|
| **Razorpay** | Donation processing — UPI, cards, netbanking, recurring | Standard (pay-per-transaction) | N/A | One-time + monthly recurring; external webview avoids App Store cut |
| **Supabase** | Postgres DB (content, donations), Auth, Storage (audio files) | Free → Pro | 500 MB DB, 1 GB storage, 50K MAU | Content + donations + audio CDN; upgrade path clear |
| **ElevenLabs** | Tamil AI voice generation (Multilingual v2) | Starter (~$5/mo) | ~30 min audio/month | Generate-once-cache-forever; minimal ongoing generation |
| **Sentry** | Error monitoring, crash reporting | Free | 5K errors/month | Production stability; no raw PII in error payloads |
| **Tamil OV Bible** | Verbatim scripture source (public domain) | N/A | N/A | Primary scripture text; digital copy to be locally bundled |
| **react-native-track-player** | Background audio, lockscreen controls, offline playback | Open source (latest stable) | N/A | Core audio infrastructure |
| **react-i18next** | UI string i18n externalization | Open source (latest stable) | N/A | All UI text; Day 1 architecture requirement |
| **WhatsApp Business API** | Daily Tamil scripture voice clips for elderly (no-app users) | v1.1 scope | N/A | Not in MVP; architecture designed to support it |
| **Deepgram** | Tamil STT for voice journaling | v2.0 scope | N/A | Not in MVP; planned for v2 |

---

### Domain-Specific Risks & Mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| Theological error in published content (wrong translation, misattribution) | High | Advisory review before publication; 7-day correction SLA; public Glass-Wall disclosure on every correction |
| ElevenLabs Tamil voice quality perceived as cold or unnatural | High | User testing before launch; rating prompt after first listen; human voice migration roadmapped for v1.1 |
| App Store rejection for religious content (exclusive-truth framing) | Medium | Ecumenical framing in all metadata; pre-submission review against Apple guideline §1.2; About page supports ecumenical positioning |
| Razorpay payment failures (UPI auto-debit mandate, card decline) | Medium | Razorpay handles most edge cases; failure UI with retry guidance; no rupees held in-app; no double-charge surface |
| DPDPA compliance gap for donor email collection | Medium | Explicit consent text at donation flow; single stated purpose (receipt delivery); no marketing reuse |
| Accidental third-party tracker introduced via dependency | Medium | Quarterly dependency audit automated in CI; no Firebase/GA in Podfile or build.gradle; flag in PR review checklist |
| AI voice perceived as sacrilegious ("machine reading Jesus") | Medium | Opening Vow explicitly names and explains AI voice; human migration path publicly roadmapped; ElevenLabs labeled on audio player |
| Content drift when adding Hindi/Telugu (Tamil content becomes stale or inconsistent) | Medium | Language-agnostic content schema; Tamil content fully locked and reviewed before new language added; no shared-string shortcuts between languages |
| Audio CDN cost spike at unexpected scale | Low | Client-side caching reduces repeat fetches; Supabase Storage + CDN priced at ~₹0.5/GB at low scale; upgrade path to Cloudflare R2 if needed |
| False teacher submitting content via future Pastor Portal (v1.1+) | Medium | No community content in MVP; all contributed content requires advisory vetting; community flagging mechanism in v1.1 design |

## Mobile App Specific Requirements

### Project-Type Overview

Arokia is a **cross-platform React Native (Expo) application** targeting iOS 16+ and Android 11+. It is designed for the mid-range Android device landscape dominant in India (4 GB RAM, Android 11) while meeting iOS quality expectations. The app distributes exclusively through Apple App Store and Google Play Store. No account is required to use core features, and the full content-and-audio experience works offline after initial content download.

### Platform Requirements

| Requirement | Decision | Rationale |
|---|---|---|
| Framework | React Native + Expo (managed workflow) | Cross-platform from one codebase; Expo EAS Build for both stores; solo dev velocity |
| Language | TypeScript strict mode | Type safety at architecture level; foundation for future contributors |
| iOS minimum | iOS 16+ | Covers 95%+ of active iPhones; react-native-track-player lockscreen controls require ≥16 |
| Android minimum | Android 11 (API 30)+ | Covers ~85% of India's Android install base; audio focus API stability |
| Build system | Expo EAS Build | Cloud builds; no local Xcode/Android Studio required; OTA updates via Expo Updates |
| OTA updates | Expo Updates (non-breaking JS changes) | Fast theological corrections and content updates without App Store review cycle |
| Styling | NativeWind (Tailwind for RN) | Utility-class styling; consistent with future web presence; Tamil is LTR |
| State management | Zustand | Lightweight; no boilerplate; sufficient for audio player state, user prefs, content filters |
| Navigation | React Navigation v6+ | De-facto standard; deep-link ready for WhatsApp share URLs |

### Device Permissions

| Permission | Platform | Purpose | Required vs. Optional |
|---|---|---|---|
| `FOREGROUND_SERVICE` (Audio) | Android | Background audio playback while app is backgrounded | Required |
| `WAKE_LOCK` | Android | Prevent CPU sleep during audio playback | Required |
| Internet access | Both | Content streaming + donation flow + audio download | Required |
| Local storage / file read | Both | Audio file caching to device | Required (implicit) |
| Microphone | iOS + Android | **NOT requested at MVP.** Voice journaling (v2) will request at that time. | Not in MVP |
| Notifications | iOS + Android | **NOT requested.** Arokia sends no push notifications; no system prompt shown. | Not in MVP |
| Camera | Both | **NOT requested.** | Never |
| Contacts | Both | **NOT requested.** | Never |
| Location | Both | **NOT requested.** | Never |

The minimal permission footprint is a product value: users who check app permissions see almost nothing, reinforcing the no-tracking positioning.

### Offline Mode

Arokia's offline capability is a **first-class feature**. Tamil Christian users in rural Tamil Nadu and diaspora contexts with poor connectivity are in the core audience.

- On first launch (after Opening Vow), the app downloads one full week of meditation content to device storage (audio files + scripture text).
- `react-native-track-player` plays from local cache; no network request during playback.
- Scripture text and verse attributions are bundled locally (Expo SQLite) — no network required to read a verse.
- User preferences stored in Expo SecureStore (local only).
- Content updates pulled on next app open with network; old content continues working offline while new content downloads in background.
- Donation flow requires network; a clear offline indicator is shown if unavailable.
- **Offline content package size target:** ≤50 MB for first-week content (MP3 at 128 kbps; ~15 meditations × ~5 MB each + overhead).

### Push Notification Strategy

**Arokia sends zero push notifications.** This is a permanent product decision, not an MVP scope reduction.

- No notification permission prompt is shown on iOS (we never request it).
- No FCM/APNs tokens registered.
- No "daily verse" push, no re-engagement notifications.

The absence of push is Signature Feature #7: *"No Ads, No Notifications, No Paraphrasing."* The WhatsApp Voice Bot (v1.1) operates through WhatsApp's own delivery — Arokia does not manage it as a push channel.

### App Store Compliance

**Apple App Store:**

- Donation flow uses Razorpay via external webview (SFSafariViewController) — real-world external transaction, exempt from App Store 30% cut under guideline §3.1.3(a).
- Religious content (§1.1): ecumenical framing (all Tamil Christians, no exclusive-sect claims) reduces rejection risk.
- Age rating: 13+ (for email collection at donation flow; no mature content).
- Privacy nutrition label: minimal disclosures — no tracking, no data linked to user beyond donor email (user-provided, disclosed).

**Google Play Store:**

- Razorpay donation via Custom Tab — avoids in-app billing requirement.
- Content rating: age-appropriate for all audiences; religious content — "broadly acceptable."
- Tamil-language metadata (title, description, screenshots) for Play Store Tamil locale.

**Both stores — pre-submission checklist:**

- [ ] Opening Vow screen demonstrates theological safety (useful to include in App Review notes)
- [ ] About page live with advisory board and correction process
- [ ] Privacy Policy URL live before submission (required for email collection)
- [ ] Donation flow tested end-to-end on physical iOS + Android devices

### Home Screen Architecture Constraint

The v1 Triune home screen (Mind / Body / Soul) must be architecturally designed to accommodate a **time-of-day layer** in v1.1 without structural redesign. Specifically:

- The home screen navigation component must be extensible to show a contextual morning (Kaalai) or evening (Maalai) entry point above the Triune grid when the device clock falls within morning (5am–11am) or evening (5pm–9pm) windows.
- The content-fetching logic must be able to filter by `time_of_day` field from Day 1 — even if the v1 UI always passes `any` as the filter value.
- The Triune navigation remains the primary persistent navigation; the time-of-day entry is an additive contextual shortcut, not a replacement.

This is a forward-compatibility constraint for the architect, not a v1 feature.

### Audio Player Behaviour

- `react-native-track-player` v4+: background audio with lockscreen Now Playing card and remote control (play/pause/seek via lock screen and headphone/Bluetooth buttons).
- Audio session management: ducks other audio on play; handles phone-call interruption gracefully (pause on call start, auto-resume on end).
- Playback speed options: 0.75× / 1× / 1.25× — slower option serves Tamil comprehension for non-native or elderly listeners.
- Sleep timer options: 15 / 30 / 45 min — supports pre-sleep listening without device staying awake.

*Specific performance and accessibility targets are defined in the Non-Functional Requirements section (NFR-P1–P5, NFR-A1–A5).*

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** *Experience MVP* — the first version must feel complete and spiritually trustworthy, not a barebones prototype. A Tamil Christian user who opens Arokia on Day 1 must be able to hear Jesus's words in Tamil, complete a meditation, understand the donation model, and trust the product's integrity. A rough-edges release would violate the Integrity pillar and undermine the theological trust the product is built on.

**Product Decision Filter:** *"Does this serve mind-body-soul wholeness through Jesus's words? If yes, ship. If no, cut."* — applies to every feature decision, now and in the future.

**Resource constraint:** Solo developer · 10-20 hrs/week · 60-75 day target · ₹10-20k/month budget.

### MVP Feature Set (Phase 1) — 60-75 Days

**Core user journeys supported:** Selvi (one-button elder access), Anand (anxiety-to-scripture, donation), Priya (young adult, topic search, share), Mary (multi-path daily practice), Lawrence (operator loop), Ravi (correction loop).

**Must-have capabilities:**

| Capability | Why It's a Must-Have |
|---|---|
| Opening Vow (first-launch, non-skippable) | Mission-critical theological statement; defines the product before any content is seen |
| Triune home screen (Mind / Body / Soul) | The core UX architecture; all content paths flow from here |
| 50 Jesus quotes (Tamil text + Tamil audio + verse attribution) | Minimum content depth for genuine scripture encounter and word-of-mouth |
| 15 meditations (5 × Mind / 5 × Body / 5 × Soul), 5-7 min each | Triune structure has no product if each arm has zero sessions |
| 5 anxiety-type → scripture meditations | Highest-urgency entry point (anxiety); validates core product-market fit |
| 1 "Silence Between Words" Lectio Divina track | Differentiator signaling Arokia is not a generic meditation app |
| Always-on verse attribution (UI-enforced) | Theological requirement and implementation enforcing the verbatim scripture constraint |
| Bible-first hand-off link at meditation end | Product's anti-substitution commitment expressed in UX |
| Offline audio cache (first-week content) | Without this, Selvi and rural users are excluded |
| Background audio + lockscreen controls | Without this, Anand's commute use case is broken |
| Razorpay donation flow (one-time + recurring) | Mission sustainability; Pay-It-Forward commitment requires a working donation channel |
| Auto pay-it-forward 10% flag at transaction time | Non-negotiable; must be atomic, not retroactive |
| Glass-Wall Budget page | Integrity pillar live from day 1; trust foundation for every donor |
| About page (Arokia name story + ecumenical positioning + correction process) | App Store compliance + theological honesty |
| In-app concern-submission form (no auth) | Enables the public correction disclosure commitment |
| react-i18next i18n architecture (all UI strings externalized) | Architectural requirement; cannot be retrofitted later |
| Language-agnostic content schema in Supabase | Hindi/Telugu cannot be added later without this being correct from the start |

**Explicit non-features in MVP (permanent):** No push notifications · No ads · No paywall · No engagement streaks · No celebrity-pastor content · No AI-as-Jesus persona · No third-party trackers · No paraphrased scripture · No Sabbath lock · No user accounts for core features.

**Explicitly deferred (v1.1+):** WhatsApp Voice Bot · Human voice recording · Kids content · Holy Week challenge · Church-visit tracker · Advisory Board page · Kaalai/Maalai Jabam navigation · Sleep content category · Personal verse highlights · Seasonal scripture card variants.

*Note: although the above are deferred features, their content schema fields (`time_of_day`, `content_type`, `mood_tag`) must be present in the Day 1 database schema so that v1.1 content entry requires no migration.*

### Post-MVP Features

**Phase 2 — v1.1 (Months 4-9):**

- **Kaalai / Maalai Jabam** — Morning and evening devotion flows; home screen shows time-aware entry point. Content tagged `morning`/`evening`/`any` in schema from Day 1; v1.1 activates the navigation layer. *Validated by Lectio 365 and Soultime as the most natural rhythm for daily use.*
- **Sleep Scripture Category** — Psalm 4:8 Sleep Series and additional sleep sessions; audio designed for pre-sleep listening (slower speech, softer keerthanai, structure that guides toward rest). Distinct `sleep` content_type in schema from Day 1. *Validated by Calm/Hallow as a major unmet need; complements the existing sleep timer (FR20).*
- **Personal Verse Highlights** — Locally stored highlights on Jesus quotes; no server sync, no account required. Collected in a personal "My Highlights" screen. *Validated by YouVersion as the deepest scripture engagement mechanic.*
- **Visual Scripture Card sharing** is already in MVP (FR34/FR42); v1.1 adds card design variants (different background styles, seasonal cards for Holy Week etc.)
- Kids content: Bedtime Jesus Stories in Tamil
- Human voice migration: family-member female Tamil voice for flagship content
- WhatsApp Voice Bot: daily Tamil scripture clip for elderly/offline users (no-app distribution)
- Holy Week 8-day journey (Palm Sunday → Easter) — framed as a community *challenge* (invite friends; do it together); this is the seasonal growth campaign model validated by Hallow's Advent Challenge
- "Do Not Be Anxious" 21-Day structured track (Matthew 6:25-34)
- Print-to-Paper PDF export for offline/print distribution
- Optional Sunday church-visit tracker (no streaks)
- Advisory Board page (3-5 publicly named Tamil pastors/theologians, Protestant + Catholic)
- Diaspora Bridge Mode: Tamil ↔ English side-by-side reading

**Phase 3 — v2+ (Months 10-24+):**

- Hindi language layer (architectural validation of multi-language scale)
- Telugu, Malayalam, Kannada layers
- Pastor Portal (vetted contribution model)
- Testimony Archive
- Voice journaling (Deepgram Tamil STT; scripture-matched response, never AI-as-Jesus)
- Family Devotion Mode
- Full liturgical calendar
- Memorial Voice Preservation (real recordings only, no AI cloning)

### Risk Mitigation Strategy

**Technical risk — content production volume:**

71 pieces of content (50 quotes + 15 meditations + 5 anxiety + 1 Lectio Divina) each require: Tamil text curation, verse verification, ElevenLabs audio generation, audio quality review, and database entry. Content production is the longest-lead-time item — not the React Native code.

*Mitigation:* Begin ElevenLabs audio generation in Week 1, in parallel with infrastructure setup. Generate in batches. Target: all audio assets complete by Day 45, leaving 15-30 days for UI integration and testing.

**Technical risk — Expo managed workflow audio limitations:**

react-native-track-player background audio may require bare workflow (ejecting from Expo managed). Ejection mid-project costs significant time.

*Mitigation:* Validate background audio behavior in a throwaway Expo managed prototype in Week 1. If bare workflow is required, eject before any app code is written.

**Market risk — early adopter seeding:**

Tamil Christian early adopters are a well-defined community but not discoverable via App Store search alone.

*Mitigation:* Seed from Lawrence's personal network (home church, young Christian contacts). WhatsApp-first share feature enables organic community spread from day 1. Target: 50-100 users from personal network before any public launch announcement.

**Resource risk — solo dev doing all roles:**

60-75 days with Lawrence handling development + content curation + audio generation + App Store submission + Razorpay setup + advisory outreach is aggressive.

*Mitigation:* Advisory board handles theological content review (offloads vetting). Glass-Wall Budget is a markdown file, not a dashboard — zero dev cost. App Store submission submitted at Day 50 (not Day 75) to absorb review delay. ElevenLabs audio generation is batch-scriptable once prompts are tuned.

### 60-Day Build Roadmap

| Weeks | Focus | Target Hours | Key Deliverables |
|---|---|---|---|
| 1-2 | Foundation | ~25 hrs | Project scaffold, i18n setup, content schema, Supabase, Tamil Bible import, CI/CD, react-native-track-player background audio validation |
| 3-4 | The Word | ~25 hrs | 50 Jesus quotes entered, ElevenLabs Tamil audio generated, Red-Letter browser + search, verse attribution pattern locked |
| 5-6 | The Walk + Hope·Faith·Love | ~30 hrs | Triune home screen, audio player, Silence Between Words, 15 meditations, 5 anxiety-type meditations |
| 7 | Integrity + Donations | ~20 hrs | Opening Vow, About page, Glass-Wall Budget (static markdown), Razorpay integration, pay-it-forward 10% allocation |
| 8 | Beta + Polish | ~15 hrs | 10-20 beta testers (family + church contacts), bug fixes, accessibility pass |
| 9-10 (buffer) | Launch | ~15 hrs | App Store + Google Play submissions, soft launch, first pay-it-forward disbursement |

**Total: ~130 hours at ~15 hrs/week average. 60 days with focus; 75-day buffer absorbs quality work.**

**Cost projection:** ₹12-18k one-time (ElevenLabs content generation + app store fees + domain). Ongoing: <₹1-2k/month (free tiers cover initial scale). Well within the ₹10-20k/month ceiling.

## Functional Requirements

### Onboarding & Theological Framing

- **FR1:** A first-time user can read and acknowledge the Opening Vow before accessing any app content.
- **FR2:** A user who does not acknowledge the Opening Vow cannot proceed to the app's content.
- **FR3:** A returning user is prompted to re-acknowledge the Opening Vow after significant app updates.
- **FR4:** Any user can read the About page describing Arokia's name, origin, mission, and ecumenical positioning.
- **FR5:** Any user can access the current Privacy Policy from within the app.

### Daily Practice Navigation (Triune Home)

- **FR6:** A user can navigate to three distinct practice paths (Mind, Body, Soul) from the home screen.
- **FR7:** A user can reach today's featured content within the Soul path with minimal navigation steps.
- **FR8:** A user can browse the full meditation library organized by practice path (Mind / Body / Soul).
- **FR9:** A user can access a library of meditations filtered by emotional/spiritual state (anxious, grieving, angry, lonely, tempted).

### Scripture & Content Discovery

- **FR10:** A user can browse Jesus's direct quotes from the Gospels, with each quote showing verbatim Tamil text and its verse reference.
- **FR11:** A user can search the content library by topic or keyword.
- **FR12:** A user can access the Silence Between Words Lectio Divina track.
- **FR41:** A user can access meditation content accompanied by Tamil Christian keerthanai instrumental audio — music that is distinctly Christian in character and never bhajan, mantra, or other non-Christian style.
- **FR13:** Every scripture display renders the verbatim Tamil text alongside the full verse reference (book, chapter, verse) — the verse reference cannot be hidden or omitted.
- **FR14:** Every meditation ends with a link that opens the complete scripture passage in an external Tamil Bible resource.

### Audio Meditation Playback

- **FR15:** A user can play any meditation or Jesus-quote audio track with standard playback controls (play, pause, seek).
- **FR16:** A user can continue audio playback while the app is backgrounded or the device screen is locked.
- **FR17:** A user can control playback (play, pause, seek) from the device lock screen and hardware audio controls (headphone buttons, car Bluetooth).
- **FR18:** A user can download content to the device for offline playback before losing network connectivity.
- **FR19:** The app automatically pre-downloads a baseline content set on first launch so the user has offline access immediately.
- **FR20:** A user can set a sleep timer so audio stops automatically after a chosen duration.
- **FR21:** A user can adjust playback speed to slow down or speed up Tamil audio.
- **FR22:** A user can access all audio content without creating an account or signing in.

### Donation & Financial Transparency

- **FR23:** A user can make a one-time donation via Razorpay (supporting UPI, cards, and netbanking).
- **FR24:** A user can set up a monthly recurring donation via Razorpay.
- **FR25:** A user making a donation is shown an explicit consent statement before providing their email address, disclosing its single purpose (receipt delivery).
- **FR26:** Each confirmed donation is automatically allocated — 10% to the current pay-it-forward beneficiary and 90% to operations — at the time of the transaction.
- **FR27:** A donor receives an email acknowledgment after a confirmed donation.
- **FR28:** Any user can view the Glass-Wall Budget showing cumulative income, expenses, and pay-it-forward disbursements.
- **FR29:** Any user can see the current quarter's named pay-it-forward beneficiary and amount committed.

### Theological Integrity & Correction

- **FR30:** Any user can submit a theological concern (translation issue, misattribution, wrong verse reference) without creating an account.
- **FR31:** A user who submits a concern receives an automated acknowledgment confirming the review SLA (7 days).
- **FR32:** Confirmed theological corrections are publicly disclosed in the next Glass-Wall Budget update, visible to all users.
- **FR33:** The operator can view and respond to submitted concerns through an admin or email workflow.

### Sharing & Optional Community

- **FR34:** A user can share any Jesus quote or meditation scripture as a formatted Tamil verse card — a visual image containing the verbatim Tamil text, the full verse reference, and the Arokia name — to WhatsApp or any installed share target on the device.
- **FR42:** The verse attribution (book, chapter, verse) is mandatory on every shared verse card; a card cannot be generated or shared without it.
- **FR35:** A user can optionally record attendance at a worship service on a given Sunday, with no streak, score, or gamification applied to this action.

### Operator & Content Administration

- **FR36:** The operator can add, update, and publish new scripture quotes and meditations through the content management system.
- **FR37:** The operator can regenerate audio for a single content item without affecting the rest of the library.
- **FR38:** The operator can update the Glass-Wall Budget, with the About page reflecting the changes automatically.
- **FR39:** The operator can view application error and crash reports.
- **FR40:** The operator can view donation totals, recurring-donor count, and pay-it-forward allocation summaries.

---

### v1.1 Functional Requirements

*These capabilities are not in the MVP build but must be supported by the v1 architecture and content schema from Day 1. The architect must design for these without implementing them.*

**Morning & Evening Devotion (Kaalai / Maalai Jabam)**

- **FR-V1-01:** A user can enter a morning devotion flow (Kaalai Jabam) from the home screen — a curated sequence of scripture, meditation, and silence appropriate for the start of the day.
- **FR-V1-02:** A user can enter an evening devotion flow (Maalai Jabam) from the home screen — a curated sequence appropriate for rest, reflection, and closing the day.
- **FR-V1-03:** The home screen displays a time-of-day aware entry point (Kaalai / Maalai) based on the device clock, coexisting with — not replacing — the Triune (Mind/Body/Soul) navigation.
- **FR-V1-04:** The operator can tag any meditation or Jesus quote as `morning`, `evening`, or `any` to control its appearance in time-of-day flows.

**Sleep Scripture Content**

- **FR-V1-05:** A user can access a dedicated Sleep content category — scripture-based audio sessions designed for pre-sleep listening, with slower pacing, softer instrumentation, and a structure that guides the listener toward rest rather than active engagement.
- **FR-V1-06:** Sleep content sessions use the existing sleep timer (FR20) as their primary interaction — the user sets the timer and lets the audio run; no other interaction is expected after pressing play.
- **FR-V1-07:** The operator can mark content with a `sleep` type tag, which controls its audio design spec and its placement in the Sleep category.

**Personal Scripture Highlights**

- **FR-V1-08:** A user can highlight (mark as personally significant) any Jesus quote they have encountered; highlights are stored locally on the device and require no account.
- **FR-V1-09:** A user can view all their highlighted Jesus quotes as a personal collection, accessible from a dedicated screen.
- **FR-V1-10:** Highlights persist across app updates and are stored only on the user's device — never synced to a server, never linked to a user identity.

## Non-Functional Requirements

### Performance

- **NFR-P1:** The app reaches an interactive state within 2 seconds of launch on a mid-range Android device (Snapdragon 680-class, 4 GB RAM, Android 11).
- **NFR-P2:** Audio playback begins within 500 ms of user tap when content is cached locally; within 2 seconds when streaming from the network.
- **NFR-P3:** The app maintains ≤150 MB in-session memory footprint to prevent Android low-memory kills during active background audio.
- **NFR-P4:** Any scrollable content list renders within 1 second.
- **NFR-P5:** The first-week offline content package is ≤50 MB total, enabling download on a cellular connection without significant data cost for Indian users.
- **NFR-P6:** Tamil verse card image generation (FR34) is performed locally on-device with no network dependency; a user can generate and share a verse card while offline.

### Security

- **NFR-S1:** All network communication uses TLS 1.2 or higher.
- **NFR-S2:** Arokia stores no payment PII; Razorpay processes all card, UPI, and banking data under its own PCI-DSS compliance scope.
- **NFR-S3:** Razorpay webhook events are verified using Razorpay's HMAC signature before any donation record is created.
- **NFR-S4:** The only PII Arokia stores is a donor's email address — provided voluntarily, consent-gated, used solely for receipt delivery.
- **NFR-S5:** No third-party advertising or analytics SDK is present in the production app build; verified by a quarterly dependency audit.

### Reliability

- **NFR-R1:** Production crash rate is ≤0.1% per session after the first 90 days of operation.
- **NFR-R2:** Audio playback pauses gracefully on an incoming phone call and resumes automatically when the call ends.
- **NFR-R3:** The app loses no user state and does not crash when network connectivity is lost during any operation except the donation flow (which clearly communicates the network requirement).
- **NFR-R4:** The donation flow surfaces an unambiguous success or failure state to the user; no donation record is created without a confirmed Razorpay webhook.

### Scalability

- **NFR-SC1:** The system supports growth from 100 to 15,000 MAU without architectural changes; Supabase free-to-Pro tier upgrade is the only required operational step at scale.
- **NFR-SC2:** Audio content is static and CDN-cached; a 10× increase in active users produces no increase in database query load.
- **NFR-SC3:** Adding a new language (Hindi, Telugu, etc.) requires only a new locale JSON file and content data entry — zero application code changes.

### Accessibility

- **NFR-A1:** All interactive UI elements have a minimum touch target of 48×48 dp.
- **NFR-A2:** The app respects and scales to the device's system font size setting; the UI remains fully usable at 1.5× system font scale.
- **NFR-A3:** All text meets WCAG AA contrast ratios (4.5:1 for normal text; 3:1 for large text ≥18 pt) in both light and dark modes.
- **NFR-A4:** The most common action (play today's content) is reachable within 2 taps from the home screen.
- **NFR-A5:** Lock screen audio controls (play, pause, seek) are compatible with system accessibility services (VoiceOver on iOS, TalkBack on Android).

### Privacy

- **NFR-PR1:** No user account or sign-in is required to access any core content (scripture browsing, meditation playback, Lectio Divina).
- **NFR-PR2:** No analytics data is linked to individual user identity; only aggregate counts (MAU, meditation completions) are tracked.
- **NFR-PR3:** Donor email addresses are used solely for donation receipts and are never used for marketing without a separate, explicit consent action.
- **NFR-PR4:** The App Store and Play Store privacy nutrition labels accurately reflect the app's data collection practices: no cross-app tracking, no data linked to user identity beyond voluntary donor email.

### Audio Content Design Standards

- **NFR-AU1:** Standard meditations and Jesus-quote audio are produced at a natural Tamil speech pace (1×) with keerthanai instrumental background at 20-30% relative volume.
- **NFR-AU2:** Sleep content audio (v1.1 `content_type: sleep`) is produced at 0.7× normal speech pace with softer keerthanai instrumentation, no sharp transitions, and a structure that does not require listener interaction after the first 60 seconds.
- **NFR-AU3:** All keerthanai instrumental audio is sourced or produced to be distinctly Christian in character — no shared melodic phrases with bhajan, qawwali, or other non-Christian devotional styles.
- **NFR-AU4:** Breathwork audio (v1.1 `content_type: breathwork`) includes a clearly paced breath cue (inhale / hold / exhale) delivered verbally in Tamil, synchronised with a keerthanai-based rhythm.

### Internationalisation

- **NFR-I1:** All user-facing UI strings are externalized in react-i18next locale files; zero UI strings are hardcoded in components.
- **NFR-I2:** All Supabase content records include a `language_code` field from initial schema creation; the data model supports multiple languages without a schema migration.
- **NFR-I3:** Tamil text rendering uses system-installed Tamil fonts; no custom Tamil font is bundled in the app binary.
