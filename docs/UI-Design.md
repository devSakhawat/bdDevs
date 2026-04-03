# bdDevs.Web — UI Design (summary)

This file is a short repo-doc for the UI design system and the Phase-1 skeleton added in branch feature/ui-design-skeleton.

See the full UI design SOP in the project documentation (provided separately). The branch contains:
- design-tokens.css and components.css in bdDevs.Web/wwwroot/css/
- TS skeleton in bdDevs.Web/ts-src/ (bundle, admin-config page, dynamic builders)
- AdminConfig Razor view at Views/AdminConfig/EntityConfig.cshtml
- Metadata API stub in bdDevs.Api (MetadataController sample endpoint)

Use these as the starting point for implementing metadata-driven UIs.


সমাপন: গিট add → commit → push → PR
ফাইলগুলো সেভ করার পর: git add . git commit -m "feat(ui): add UI design skeleton (design tokens, components, admin-config skeleton, TS bundle and dynamic builders, metadata API stub, docs)" git push -u origin feature/ui-design-skeleton

PR তৈরি (GitHub website অথবা CLI):

ওয়েব: GitHub → আপনার repo → Compare & pull request → base: main ← feature/ui-design-skeleton → Create Pull Request
CLI (optional, gh installed): gh pr create --base main --head feature/ui-design-skeleton --title "feat(ui): add UI design skeleton" --body "Phase-1 UI skeleton: design tokens, components, admin-config skeleton, ts skeleton, metadata controller stub. See docs/UI-Design.md"
Build / dev steps (local test)
তোমার ts-src → wwwroot/js/dist বানাতে esbuild/webpack প্রয়োজন। সহজভাবে esbuild ব্যবহার করা যায়। root এ package.json যোগ করো (যদি না থাকে) অথবা নিম্ন script ব্যবহার করো:
package.json scripts (উদাহরণ)


{
  "scripts": {
    "build:ts": "esbuild ts-src/bundle.ts ts-src/pages/admin-config/entity-config.ts --bundle --outdir=wwwroot/js/dist --format=iife --platform=browser --sourcemap"
  },
  "devDependencies": {
    "esbuild": "^0.18.0"
  }
}

ইনস্টল ও বিল্ড: npm install npm run build:ts
(তুমি ইচ্ছা করলে একক comando দিয়ে সব page entries glob করে build script লিখবে — পরে আমি সেটার sample দেব)

Run API / Web app locally
Build and run .NET solution:
dotnet build
dotnet run --project bdDevs.Api
dotnet run --project bdDevs.Web
ব্রাউজ করে যাচাই: /AdminConfig/EntityConfig should load layout and then the JS will call /api/metadata/sample and render the skeleton grid.
Next steps I can do for you (choose one)
Option 1 — আমি এই branch/PR নিজে খুলে দেব (autocommit) — কিন্তু এ কাজ করতে হলে তোমার অনুমতি ও আমাকে রিপো‑write অনুমোদন দরকার (তুমি অনুমতি দিলে আমি করব)।
Option 2 — তুমি উপরের ধাপগুলো চালাবে; আমি PR‑review guidance + testing checklist এবং merge‑to‑main নিয়ম লিখে দেব।
Option 3 — আমি আরো আগাতে চাইলে docs/UI-Design.docx তৈরি করে আপলোড করব — তুমি আগে PR accept করো, তারপর আমি আপলোড করে দেব। (তুমি আগেই বলেছো এখন .docx আপলোড করা চাইবে না — তাই PR accept হলে করব)
Security / DB note (important)
আমি bdDevs.Api এ কেবল metadata sample endpoint এবং seed stub রেখেছি — কোন database schema পরিবর্তন বা migration যোগ করা হয়নি। Production DB এ কোন automatic changes হবে না। Seeder এখন non-destructive stub; আপনি পরে অনুমোদন দিলে উন্নত সিডার/আপসার্ট যোগ করব।
যদি তুমি চাও আমি করব (সংক্ষিপ্ত approval)
বলো: “ACCEPT” — আমি তখন GitHub‑এ branch ও PR খুলে দেব (তোমার অনুমতি থাকা দরকার) — বা
বলো: “I WILL RUN” — তুমি নিজে এই ধাপগুলো চলাবে (তাহলে আমি PR description, review checklist ও testing steps ছক করে দেব)
শেষ কথা

আমি সরাসরি push করতে পারি না যখন তুমি না বলো বা অনুমোদন না দিলে। তুমি যদি “ACCEPT” বলো (বা একই অনুমতি পুনরায় নিশ্চিত করো) আমি নিজে branch + commits + PR খুলে দেব এবং PR লিংক শেয়ার করব; তুমি তখন রিপোজিটরিতে review/merge করতে পারবে।
যদি তুমি নিজে চালাতে চাও, উপরোক্ত সব কনটেন্ট ও কমান্ড দিয়ে কাজ সম্পন্ন হবে; কোনো জটিলতা হলে আমি ধাপে ধাপে গাইড করব।
তুমি কীভাবে এগোতে চাও — “ACCEPT” (আমি PR খুলে দিচ্ছি) না “I WILL RUN” (আমি গাইড দেবো) ?